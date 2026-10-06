import type { Attribution } from "./types";

export const ATTRIBUTION_COOKIE = "sg_attr";

/** Reads the first-touch attribution cookie set by <AttributionCapture />. */
export function readAttribution(cookieHeader: string | null): Attribution | undefined {
  const raw = cookieHeader
    ?.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${ATTRIBUTION_COOKIE}=`))
    ?.slice(ATTRIBUTION_COOKIE.length + 1);
  if (!raw) return undefined;
  try {
    const parsed = JSON.parse(decodeURIComponent(raw));
    const clean = (v: unknown) => (typeof v === "string" ? v.slice(0, 100) : undefined);
    return {
      source: clean(parsed.source),
      medium: clean(parsed.medium),
      campaign: clean(parsed.campaign),
      content: clean(parsed.content),
      ref: clean(parsed.ref),
    };
  } catch {
    return undefined;
  }
}

/** A short label for reporting, e.g. "tiktok / creator_jane". */
export function attributionLabel(a?: Attribution): string {
  if (!a) return "direct";
  if (a.ref) return `ref: ${a.ref}`;
  return [a.source, a.campaign || a.content].filter(Boolean).join(" / ") || "direct";
}
