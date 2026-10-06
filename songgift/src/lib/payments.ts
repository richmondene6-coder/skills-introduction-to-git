import { customAlphabet } from "nanoid";
import { markPaid } from "./fulfill";
import { PaystackError, verifyTransaction } from "./paystack";
import { getOrder } from "./store";
import type { Order } from "./types";

// Paystack references allow only letters, digits, "-", "." and "=".
const randomPart = customAlphabet("abcdefghijkmnpqrstuvwxyz23456789", 8);
export const newReference = (orderId: string) => `sg-${orderId}-${randomPart()}`;
export const orderIdFromReference = (reference: string) => /^sg-([a-z0-9]+)-[a-z0-9]+$/.exec(reference)?.[1];

export type Settlement =
  | { ok: true; orderId: string }
  | { ok: false; orderId?: string; reason: "not_found" | "not_successful" | "mismatch" };

/**
 * Confirms a payment with Paystack and marks the order paid. Safe to call more than once
 * (the redirect and the webhook both call it). Only checkouts this server started are accepted,
 * at the amount and currency it asked for: anyone holding the public key can create a Paystack
 * transaction with made-up metadata, so the metadata alone is never trusted.
 */
export async function settlePayment(reference: string): Promise<Settlement> {
  const orderId = orderIdFromReference(reference);
  const order = orderId ? await getOrder(orderId) : null;
  if (!order) return { ok: false, reason: "not_found" };

  const expected = order.checkouts?.[reference];
  if (!expected) return { ok: false, orderId: order.id, reason: "mismatch" };

  let tx;
  try {
    tx = await verifyTransaction(reference);
  } catch (err) {
    // 4xx: Paystack has no such transaction. Anything else is retryable, so rethrow.
    if (err instanceof PaystackError && err.httpStatus >= 400 && err.httpStatus < 500) {
      return { ok: false, orderId: order.id, reason: "not_found" };
    }
    throw err;
  }

  if (tx.status !== "success") return { ok: false, orderId: order.id, reason: "not_successful" };
  if (tx.reference !== reference || tx.currency !== expected.currency || tx.amount < expected.amount) {
    console.error(
      `[payments] ${reference}: paid ${tx.amount} ${tx.currency}, expected ${expected.amount} ${expected.currency}`,
    );
    return { ok: false, orderId: order.id, reason: "mismatch" };
  }

  await markPaid(order.id, expected.tier, {
    reference,
    amount: tx.amount,
    currency: tx.currency,
    promoCode: expected.promoCode,
  });
  return { ok: true, orderId: order.id };
}

/** Keeps the most recent checkouts on the order (a buyer may start checkout more than once). */
export function withCheckout(order: Order, reference: string, checkout: NonNullable<Order["checkouts"]>[string]) {
  const recent = Object.entries(order.checkouts ?? {})
    .sort((a, b) => a[1].createdAt.localeCompare(b[1].createdAt))
    .slice(-4);
  return Object.fromEntries([...recent, [reference, checkout]]);
}
