import type { Order } from "./types";

/** Sends the "your song is ready" email through Resend, if configured. */
export async function sendSongReadyEmail(order: Order): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.log(`[email] skipped for order ${order.id} (RESEND_API_KEY / EMAIL_FROM not set)`);
    return;
  }
  const link = `${siteUrl()}/song/${order.id}`;
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: order.quiz.email,
      subject: `🎄 Your song for ${order.quiz.recipientName} is ready`,
      html: `<p>Hi ${escapeHtml(order.quiz.fromName)},</p>
<p>Your personalized song <strong>"${escapeHtml(order.lyrics.title)}"</strong> for ${escapeHtml(order.quiz.recipientName)} is ready.</p>
<p><a href="${link}">Listen, download and print the gift card →</a></p>
<p>Merry Christmas!<br/>The SongGift team</p>`,
    }),
  });
  if (!res.ok) console.error(`[email] Resend error ${res.status}: ${await res.text()}`);
}

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
}

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
