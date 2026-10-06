import { NextResponse } from "next/server";
import { after } from "next/server";
import { fulfillOrder, markPaid } from "@/lib/fulfill";
import { stripe } from "@/lib/stripe";
import type { TierId } from "@/lib/types";

// Song generation runs after the response, within this route's time limit.
export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!stripe || !secret || !signature) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 400 });
  }

  let event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.orderId;
    const tier = session.metadata?.tier as TierId | undefined;
    if (orderId && tier && session.payment_status === "paid") {
      await markPaid(orderId, tier, session.id);
      after(() => fulfillOrder(orderId));
    }
  }
  return NextResponse.json({ received: true });
}
