import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getOrder } from "@/lib/store";
import { publicOrder } from "@/lib/public-order";
import SongView from "./song-view";

export async function generateMetadata({ params }: PageProps<"/song/[id]">): Promise<Metadata> {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) return { title: "Song not found · SongGift" };
  const title = `“${order.lyrics.title}”: a song for ${order.quiz.recipientName}`;
  // Song pages are private links: keep them out of search engines.
  return { title, openGraph: { title }, robots: { index: false, follow: false } };
}

export default async function SongPage({ params, searchParams }: PageProps<"/song/[id]">) {
  const { id } = await params;
  const { paid } = await searchParams;
  const order = await getOrder(id);
  if (!order) notFound();
  return <SongView initial={publicOrder(order)} returnedFromCheckout={paid === "1"} />;
}
