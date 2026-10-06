import { NextResponse } from "next/server";
import { after } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import { settlePayment } from "@/lib/payments";
import { isValidWebhookSignature } from "@/lib/paystack";

// Song generation runs after the response, within this route's time limit.
export const maxDuration = 300;

/** Paystack's server-to-server notice. Catches payments where the buyer never came back to the site. */
export async function POST(request: Request) {
  const rawBody = await request.text();
  if (!isValidWebhookSignature(rawBody, request.headers.get("x-paystack-signature"))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: { event?: string; data?: { reference?: unknown } };
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  const reference = event.data?.reference;
  if (event.event !== "charge.success" || typeof reference !== "string") {
    return NextResponse.json({ received: true });
  }

  try {
    const result = await settlePayment(reference);
    if (result.ok) after(() => fulfillOrder(result.orderId));
    else console.warn(`[paystack-webhook] ${reference} not settled: ${result.reason}`);
  } catch (err) {
    console.error(`[paystack-webhook] could not verify ${reference}`, err);
    // A non-2xx response makes Paystack retry the webhook later.
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
  return NextResponse.json({ received: true });
}
