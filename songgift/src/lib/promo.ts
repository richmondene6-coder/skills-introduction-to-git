import { getCounter, incrementCounter } from "./store";

export type Promo = { code: string; percentOff: number; maxUses?: number };

/** PROMO_CODES="FAMILY:100:30,MERRY20:20" means code:percent-off[:max uses]. */
function promoCodes(): Map<string, Promo> {
  const codes = new Map<string, Promo>();
  for (const entry of (process.env.PROMO_CODES ?? "").split(",")) {
    const [rawCode, rawPercent, rawMax] = entry.trim().split(":");
    const code = rawCode?.trim().toUpperCase();
    const percentOff = Number(rawPercent);
    if (!code || !Number.isInteger(percentOff) || percentOff < 1 || percentOff > 100) continue;
    const maxUses = Number(rawMax);
    codes.set(code, { code, percentOff, maxUses: Number.isInteger(maxUses) && maxUses > 0 ? maxUses : undefined });
  }
  return codes;
}

const usesKey = (code: string) => `promo-uses:${code}`;

/** Validates a code a buyer typed in, including its usage limit. */
export async function findPromo(input: string): Promise<{ ok: true; promo: Promo } | { ok: false; error: string }> {
  const promo = promoCodes().get(input.trim().toUpperCase());
  if (!promo) return { ok: false, error: "That promo code isn't valid." };
  if (promo.maxUses && (await getCounter(usesKey(promo.code))) >= promo.maxUses) {
    return { ok: false, error: "That promo code has been fully used." };
  }
  return { ok: true, promo };
}

export function discounted(amount: number, promo?: Promo): number {
  return promo ? Math.round((amount * (100 - promo.percentOff)) / 100) : amount;
}

export async function recordPromoUse(code: string): Promise<void> {
  await incrementCounter(usesKey(code));
}
