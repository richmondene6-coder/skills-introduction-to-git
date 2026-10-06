import { ogCard, OG_SIZE } from "@/lib/og-card";

export const alt = "SongGift: a Christmas song written just for them";
export const size = OG_SIZE;
export const contentType = "image/png";

export default function Image() {
  return ogCard({
    eyebrow: "The most personal gift this year",
    title: "A Christmas song written just for them",
    footer: "Their name. Your memories. Ready in minutes.",
  });
}
