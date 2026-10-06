import { NextResponse } from "next/server";
import { after } from "next/server";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdminToken } from "@/lib/admin-auth";
import { isStuck, retryOrder } from "@/lib/fulfill";
import { getOrder } from "@/lib/store";

export const maxDuration = 300;

export async function POST(request: Request) {
  const jar = await cookies();
  if (!isAdminToken(jar.get(ADMIN_COOKIE)?.value)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { orderId } = await request.json().catch(() => ({}));
  const order = typeof orderId === "string" ? await getOrder(orderId) : null;
  if (!order || !(order.status === "failed" || isStuck(order))) {
    return NextResponse.json({ error: "Only failed or stuck orders can be retried" }, { status: 400 });
  }
  after(() => retryOrder(order.id));
  return NextResponse.json({ ok: true });
}
