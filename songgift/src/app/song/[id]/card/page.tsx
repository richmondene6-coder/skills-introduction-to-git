import { notFound } from "next/navigation";
import QRCode from "qrcode";
import { siteUrl } from "@/lib/email";
import { getOrder } from "@/lib/store";
import PrintButton from "./print-button";

/** A printable gift card: they scan the QR code and their song plays. */
export default async function GiftCardPage({ params }: PageProps<"/song/[id]/card">) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order || order.status === "preview") notFound();

  const qr = await QRCode.toDataURL(`${siteUrl()}/song/${order.id}`, { margin: 1, width: 360, color: { dark: "#143526" } });

  return (
    <div className="mx-auto max-w-xl px-4 py-10 print:py-0">
      <div className="rounded-3xl border-4 border-double border-gold bg-white p-10 text-center shadow-sm print:shadow-none">
        <p className="text-4xl">🎄</p>
        <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-berry">A song written just for you</p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-pine-dark">{order.quiz.recipientName}</h1>
        <p className="mt-6 font-display text-2xl italic">&ldquo;{order.lyrics.title}&rdquo;</p>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={qr} alt="QR code to play the song" className="mx-auto mt-8 h-48 w-48" />
        <p className="mt-3 text-muted">Scan to play your song</p>
        <p className="mt-8 font-display text-lg">With love, {order.quiz.fromName}</p>
      </div>
      <div className="mt-6 text-center print:hidden">
        <PrintButton />
      </div>
    </div>
  );
}
