import type { Lyrics, Order } from "./types";

export type PublicOrder = {
  id: string;
  status: Order["status"];
  title: string;
  recipientName: string;
  fromName: string;
  styleId: Order["quiz"]["style"];
  lyrics: Lyrics;
  lockedSections: number;
  versions: Order["versions"];
  /** Minor units (cents, kobo, pesewas). */
  paidAmount?: number;
  currency?: string;
  error?: string;
};

/** The order as the browser may see it: before payment, only the first verse and chorus are revealed. */
export function publicOrder(order: Order): PublicOrder {
  const paid = order.status !== "preview";
  const visible = paid ? order.lyrics.sections : order.lyrics.sections.slice(0, 2);
  return {
    id: order.id,
    status: order.status,
    title: order.lyrics.title,
    recipientName: order.quiz.recipientName,
    fromName: order.quiz.fromName,
    styleId: order.quiz.style,
    lyrics: { title: order.lyrics.title, sections: visible },
    lockedSections: order.lyrics.sections.length - visible.length,
    versions: order.versions,
    paidAmount: order.amountPaid,
    currency: order.currency,
    error: order.error,
  };
}
