import { composeSong } from "./music";
import { storeAudio } from "./audio-storage";
import { sendSongReadyEmail } from "./email";
import { getOrder, updateOrder } from "./store";
import { STYLES, TIERS, type Order, type SongVersion, type StyleId, type TierId } from "./types";

/** Marks an order paid and records which song versions to produce. Idempotent. */
export async function markPaid(orderId: string, tier: TierId, stripeSessionId?: string, amountPaidCents?: number) {
  const order = await getOrder(orderId);
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.status !== "preview") return order;
  return updateOrder(orderId, {
    status: "paid",
    tier,
    stripeSessionId,
    amountPaidCents: amountPaidCents ?? TIERS[tier].priceCents,
    paidAt: new Date().toISOString(),
    versions: pickStyles(order.quiz.style, TIERS[tier].versions).map((styleId) => ({ styleId })),
  });
}

/** Generates and stores every song version, then emails the buyer. */
export async function fulfillOrder(orderId: string): Promise<void> {
  const order = await getOrder(orderId);
  if (!order || order.status !== "paid") return;
  await generate(orderId, order);
}

/** Re-runs generation for an order that failed (from the admin dashboard). */
export async function retryOrder(orderId: string): Promise<boolean> {
  const order = await getOrder(orderId);
  if (!order || order.status !== "failed") return false;
  await generate(orderId, order);
  return true;
}

async function generate(orderId: string, order: Order): Promise<void> {
  await updateOrder(orderId, { status: "generating" });

  try {
    const versions: SongVersion[] = [];
    for (const [i, version] of order.versions.entries()) {
      const { bytes, contentType } = await composeSong(order.lyrics, version.styleId);
      const audioUrl = await storeAudio(`${order.id}-${i + 1}`, bytes, contentType);
      versions.push({ ...version, audioUrl });
    }
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
