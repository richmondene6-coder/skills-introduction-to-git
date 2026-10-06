import { NextResponse } from "next/server";
import { after } from "next/server";
import { fulfillOrder } from "@/lib/fulfill";
import { orderIdFromReference, settlePayment } from "@/lib/payments";

// Song generation runs after the redirect, within this route's time limit.
export const maxDuration = 300;

/** Paystack sends the buyer here after payment (?reference=...). Confirm it, then show their song page. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const reference = url.searchParams.get("reference") ?? url.searchParams.get("trxref") ?? "";
  let orderId = orderIdFromReference(reference);
  let failed = false;

  try {
    const result = await settlePayment(reference);
    orderId = result.orderId ?? orderId;
    if (result.ok) after(() => fulfillOrder(result.orderId));
    else failed = true;
  } catch (err) {
    // Paystack unreachable: the webhook will confirm the payment, so show the "recording" state.
    console.error(`[paystack-callback] could not verify ${reference}`, err);
  }

  if (!orderId) return NextResponse.redirect(new URL("/", request.url), 303);
  const destination = new URL(`/song/${orderId}`, request.url);
  destination.searchParams.set(failed ? "payment" : "paid", failed ? "failed" : "1");
  return NextResponse.redirect(destination, 303);
}
