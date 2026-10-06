import { NextResponse } from "next/server";
import { after } from "next/server";
import { z } from "zod";
import { siteUrl } from "@/lib/email";
import { fulfillOrder, markPaid } from "@/lib/fulfill";
import { getOrder } from "@/lib/store";
import { devPaymentBypass, stripe } from "@/lib/stripe";
import { TIERS } from "@/lib/types";

export const maxDuration = 300;

const Body = z.object({ orderId: z.string(), tier: z.enum(["standard", "deluxe"]) });

/** Starts Stripe Checkout for an order (or skips payment in local dev without Stripe keys). */
export async function POST(request: Request) {
  const parsed = Body.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { orderId, tier } = parsed.data;

  const order = await getOrder(orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "preview") return NextResponse.json({ url: `/song/${orderId}` });

  if (devPaymentBypass) {
    await markPaid(orderId, tier);
    after(() => fulfillOrder(orderId));
    return NextResponse.json({ url: `/song/${orderId}` });
  }
  if (!stripe) return NextResponse.json({ error: "Payments are not configured" }, { status: 500 });

  const t = TIERS[tier];
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    customer_email: order.quiz.email,
    line_items: [
      {
        quantity: 1,
        price_data: {
          currency: "usd",
          unit_amount: t.priceCents,
          product_data: { name: `${t.label}: "${order.lyrics.title}"`, description: t.description },
        },
      },
    ],
    allow_promotion_codes: true,
    metadata: { orderId, tier },
    success_url: `${siteUrl()}/song/${orderId}?paid=1`,
    cancel_url: `${siteUrl()}/song/${orderId}`,
  });
  return NextResponse.json({ url: session.url });
}
