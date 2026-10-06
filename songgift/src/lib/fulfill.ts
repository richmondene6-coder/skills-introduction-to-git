import { composeSong } from "./music";
import { storeAudio } from "./audio-storage";
import { sendSongReadyEmail } from "./email";
import { recordPromoUse } from "./promo";
import { claimOnce, getOrder, updateOrder } from "./store";
import { STYLES, TIERS, type Order, type StyleId, type TierId } from "./types";

export type Payment = {
  reference: string;
  /** Minor units (cents, kobo, pesewas). */
  amount: number;
  currency: string;
  promoCode?: string;
};

// Longer than any generation can run (route maxDuration is 300s).
const FULFILL_LOCK_SECONDS = 15 * 60;

/** Marks an order paid and records which song versions to produce. Idempotent. */
export async function markPaid(orderId: string, tier: TierId, payment: Payment) {
  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.status !== "preview") return order;
  const paid = await updateOrder(orderId, {
    status: "paid",
    tier,
    paymentReference: payment.reference,
    amountPaid: payment.amount,
    currency: payment.currency,
    promoCode: payment.promoCode,
    paidAt: new Date().toISOString(),
    versions: pickStyles(order.quiz.style, TIERS[tier].versions).map((styleId) => ({ styleId })),
  });
  if (payment.promoCode && (await claimOnce(`promo-counted:${orderId}`, 60 * 60 * 24 * 120))) {
    await recordPromoUse(payment.promoCode);
  }
  return paid;
}

/** Generates and stores every song version, then emails the buyer. */
export async function fulfillOrder(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order || order.status !== "paid") return;
  // Both the payment redirect and the webhook trigger this; only one may produce the song.
  if (!(await claimOnce(`fulfill:${orderId}`, FULFILL_LOCK_SECONDS))) return;
  await generate(orderId, order);
}

/** A paid order whose generation never finished (for example, the server timed out). */
export function isStuck(order: Order, now = Date.now()): boolean {
  return (
    (order.status === "paid" || order.status === "generating") &&
    !!order.paidAt &&
    now - Date.parse(order.paidAt) > FULFILL_LOCK_SECONDS * 1000
  );
}

/** Re-runs generation for a failed or stuck order (from the admin dashboard). */
export async function retryOrder(orderId: string): Promise<boolean> {
  const order = await getOrder(orderId);
  if (!order || !(order.status === "failed" || isStuck(order))) return false;
  await generate(orderId, order);
  return true;
}

async function generate(orderId: string, order: Order): Promise<void> {
  console.log(`[fulfill] generating ${order.versions.length} version(s) for order ${orderId}`);
  await updateOrder(orderId, { status: "generating" });

  try {
    // Versions render in parallel so a two-song order finishes well within the time limit.
    const versions = await Promise.all(
      order.versions.map(async (version, i) => {
        const { bytes, contentType } = await composeSong(order.lyrics, version.styleId);
        return { ...version, audioUrl: await storeAudio(`${order.id}-${i + 1}`, bytes, contentType) };
      }),
    );
    const ready = await updateOrder(orderId, { status: "ready", versions, error: undefined });
    await sendSongReadyEmail(ready);
  } catch (err) {
    console.error(`[fulfill] order ${orderId} failed`, err);
    await updateOrder(orderId, { status: "failed", error: "Song generation failed. Our team has been notified." });
  }
}

/** The buyer's chosen style first, then contrasting styles for extra versions. */
function pickStyles(primary: StyleId, count: number): StyleId[] {
  const rest = STYLES.map((s) => s.id).filter((id) => id !== primary && id !== "kids");
  return [primary, ...rest].slice(0, count);
}
