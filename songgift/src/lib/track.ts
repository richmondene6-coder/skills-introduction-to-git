type PixelWindow = Window & {
  fbq?: (...args: unknown[]) => void;
  ttq?: { track: (event: string, data?: Record<string, unknown>) => void };
};

const TIKTOK_EVENTS = {
  Lead: "SubmitForm",
  InitiateCheckout: "InitiateCheckout",
  Purchase: "CompletePayment",
} as const;

type FunnelEvent = keyof typeof TIKTOK_EVENTS;

/** Sends a funnel event to whichever ad pixels are loaded. Safe to call when none are. */
export function track(event: FunnelEvent, data: { value?: number; orderId?: string } = {}) {
  const w = window as PixelWindow;
  const payload = { currency: "USD", ...(data.value !== undefined && { value: data.value }) };
  const options = data.orderId ? { eventID: `${event}-${data.orderId}` } : undefined;
  w.fbq?.("track", event, payload, options);
  w.ttq?.track(TIKTOK_EVENTS[event], payload);
}

/** Fires Purchase at most once per order in this browser. */
export function trackPurchaseOnce(orderId: string, valueCents: number) {
  const key = `sg_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // Storage unavailable: still report the purchase.
  }
  track("Purchase", { value: valueCents / 100, orderId });
}
