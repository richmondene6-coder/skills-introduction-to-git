import type { TierId } from "./types";

/** Currencies Paystack charges in. All use 100 minor units (cents, kobo, pesewas). */
const SUPPORTED_CURRENCIES = ["USD", "NGN", "GHS", "ZAR", "KES"] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

function readCurrency(): Currency {
  const currency = (process.env.NEXT_PUBLIC_CURRENCY || "USD").trim().toUpperCase();
  if (!(SUPPORTED_CURRENCIES as readonly string[]).includes(currency)) {
    throw new Error(`NEXT_PUBLIC_CURRENCY must be one of ${SUPPORTED_CURRENCIES.join(", ")} (got "${currency}")`);
  }
  return currency as Currency;
}

export const CURRENCY = readCurrency();

/** Reads a price in major units (29 = $29). Prices in currencies other than USD must be set explicitly. */
function readPrice(raw: string | undefined, usdDefault: number, name: string): number {
  const value = raw ? Number(raw) : CURRENCY === "USD" ? usdDefault : NaN;
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`Set ${name} to the price in ${CURRENCY}, e.g. ${name}=15000`);
  }
  return Math.round(value * 100);
}

/** Tier prices in the currency's minor unit (cents, kobo, pesewas). */
export const PRICES: Record<TierId, number> = {
  standard: readPrice(process.env.NEXT_PUBLIC_PRICE_STANDARD, 29, "NEXT_PUBLIC_PRICE_STANDARD"),
  deluxe: readPrice(process.env.NEXT_PUBLIC_PRICE_DELUXE, 49, "NEXT_PUBLIC_PRICE_DELUXE"),
};

/** 2900 → "$29", 1500000 (NGN) → "₦15,000". */
export function formatMoney(minor: number, currency: string = CURRENCY): string {
  const digits = minor % 100 === 0 ? 0 : 2;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(minor / 100);
}
