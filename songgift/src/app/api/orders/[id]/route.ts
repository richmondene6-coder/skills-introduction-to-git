import { NextResponse } from "next/server";
import { getOrder } from "@/lib/store";
import { publicOrder } from "@/lib/public-order";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(publicOrder(order));
}
