import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE = "sg_admin";

/** Session token derived from ADMIN_PASSWORD; changing the password signs everyone out. */
export function adminToken(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return null;
  return createHmac("sha256", password).update("songgift-admin-v1").digest("hex");
}

export function isValidPassword(input: string): boolean {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(password);
  return a.length === b.length && timingSafeEqual(a, b);
}

export function isAdminToken(value: string | undefined): boolean {
  const expected = adminToken();
  if (!expected || !value || value.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(value), Buffer.from(expected));
}
