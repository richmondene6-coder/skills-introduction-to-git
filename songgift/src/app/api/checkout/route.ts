import { NextResponse } from "next/server";
import { after } from "next/server";
import { z } from "zod";
import { siteUrl } from "@/lib/email";
import { fulfillOrder, markPaid } from "@/lib/fulfill";
import { newReference, withCheckout } from "@/lib/payments";
import { devPaymentBypass, initializeTransaction, paystackConfigured } from "@/lib/paystack";
import { CURRENCY, PRICES } from "@/lib/pricing";
import { discounted, findPromo, type Promo } from "@/lib/promo";
import { getOrder, updateOrder } from "@/lib/store";

export const maxDuration = 300;

const Body = z.object({
  orderId: z.string(),
  tier: z.enum(["standard", "deluxe"]),
  promoCode: z.string().trim().max(40).optional(),
});

/** Starts a Paystack checkout for an order. Free (100% off) orders and local dev skip payment. */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { orderId, tier, promoCode } = parsed.data;

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "preview") return NextResponse.json({ url: `/song/${orderId}` });

  let promo: Promo | undefined;
  if (promoCode) {
    const found = await findPromo(promoCode);
    if (!found.ok) return NextResponse.json({ error: found.error }, { status: 400 });
    promo = found.promo;
  }
  const amount = discounted(PRICES[tier], promo);

  if (amount === 0 || devPaymentBypass()) {
    const reference = amount === 0 ? `free-${orderId}` : `dev-${orderId}`;
    await markPaid(orderId, tier, { reference, amount, currency: CURRENCY, promoCode: promo?.code });
    after(() => fulfillOrder(orderId));
    return NextResponse.json({ url: `/song/${orderId}` });
  }
  if (!paystackConfigured()) return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });

  const reference = newReference(orderId);
  await updateOrder(orderId, {
    checkouts: withCheckout(order, reference, {
      tier,
      amount,
      currency: CURRENCY,
      promoCode: promo?.code,
      createdAt: new Date().toISOString(),
    }),
  });

  try {
    const tx = await initializeTransaction({
      email: order.quiz.email,
      amount,
      currency: CURRENCY,
      reference,
      callback_url: `${siteUrl()}/api/paystack/callback`,
      metadata: {
        orderId,
        tier,
        // Where Paystack sends the buyer if they cancel on the payment page.
        cancel_action: `${siteUrl()}/song/${orderId}`,
        custom_fields: [{ display_name: "Song", variable_name: "song", value: order.lyrics.title }],
      },
    });
    return NextResponse.json({ url: tx.authorization_url });
  } catch (err) {
    console.error(`[checkout] Paystack initialize failed for ${orderId}`, err);
    // While testing, show Paystack's reason (e.g. "Currency not supported by merchant" if USD isn't enabled yet).
    const detail = process.env.NODE_ENV !== "production" && err instanceof Error ? ` (Paystack: ${err.message})` : "";
    return NextResponse.json({ error: `Payment couldn't be started. Please try again in a minute.${detail}` }, { status: 502 });
  }
}
