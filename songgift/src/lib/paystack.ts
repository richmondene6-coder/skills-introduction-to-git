import { createHmac, timingSafeEqual } from "crypto";

// PAYSTACK_API_URL is only for pointing at a mock server in local tests.
const API_URL = process.env.PAYSTACK_API_URL || "https://api.paystack.co";
const secretKey = () => process.env.PAYSTACK_SECRET_KEY;

export const paystackConfigured = () => Boolean(secretKey());

/** Lets the full flow run locally without Paystack keys. Never active in production. */
export const devPaymentBypass = () => !secretKey() && process.env.NODE_ENV !== "production";

export class PaystackError extends Error {
  constructor(
    message: string,
    readonly httpStatus: number,
  ) {
    super(message);
  }
}

export type PaystackTransaction = {
  status: string; // "success", "failed", "abandoned", ...
  reference: string;
  amount: number; // minor units
  currency: string;
  metadata: unknown;
};

async function call<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
  const key = secretKey();
  if (!key) throw new PaystackError("PAYSTACK_SECRET_KEY is not set", 500);
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json().catch(() => null)) as { status?: boolean; message?: string; data?: T } | null;
  if (!res.ok || !json?.status || json.data === undefined) {
    throw new PaystackError(json?.message ?? `Paystack request failed (${res.status})`, res.status);
  }
  return json.data;
}

export function initializeTransaction(params: {
  email: string;
  amount: number;
  currency: string;
  reference: string;
  callback_url: string;
  metadata: Record<string, unknown>;
}) {
  return call<{ authorization_url: string; access_code: string; reference: string }>("POST", "/transaction/initialize", params);
}

export function verifyTransaction(reference: string) {
  return call<PaystackTransaction>("GET", `/transaction/verify/${encodeURIComponent(reference)}`);
}

/** Paystack signs every webhook body with HMAC-SHA512 using your secret key. */
export function isValidWebhookSignature(rawBody: string, signature: string | null): boolean {
  const key = secretKey();
  if (!key || !signature) return false;
  const expected = createHmac("sha512", key).update(rawBody).digest("hex");
  return expected.length === signature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}
