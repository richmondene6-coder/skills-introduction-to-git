import { NextResponse } from "next/server";
import { ADMIN_COOKIE, adminToken, isValidPassword } from "@/lib/admin-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const url = new URL("/admin", request.url);
  if (!isValidPassword(password)) {
    url.searchParams.set("error", "1");
    return NextResponse.redirect(url, 303);
  }
  const res = NextResponse.redirect(url, 303);
  res.cookies.set(ADMIN_COOKIE, adminToken()!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24 * 14,
  });
  return res;
}
