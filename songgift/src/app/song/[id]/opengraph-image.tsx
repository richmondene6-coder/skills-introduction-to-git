import { getOrder } from "@/lib/store";
import { ogCard, OG_SIZE } from "@/lib/og-card";

export const alt = "A personalized Christmas song";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const order = await getOrder(id);
  return ogCard({
    eyebrow: order ? `A song for ${order.quiz.recipientName}` : "A song written just for you",
    title: order ? `“${order.lyrics.title}”` : "SongGift",
    footer: "Tap to listen 🎶",
  });
}
