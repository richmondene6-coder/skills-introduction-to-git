"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { formatMoney, PRICES } from "@/lib/pricing";
import type { PublicOrder } from "@/lib/public-order";
import { SUPPORT_EMAIL } from "@/lib/site";
import { track, trackPurchaseOnce } from "@/lib/track";
import { STYLES, TIERS, type TierId } from "@/lib/types";

const styleLabel = (id: string) => STYLES.find((s) => s.id === id)?.label ?? id;

type Props = { initial: PublicOrder; returnedFromCheckout: boolean; paymentFailed: boolean };

export default function SongView({ initial, returnedFromCheckout, paymentFailed }: Props) {
  const [order, setOrder] = useState(initial);
  const [paying, setPaying] = useState<TierId | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [promoCode, setPromoCode] = useState("");
  const [waitedTooLong, setWaitedTooLong] = useState(false);

  const inProgress = order.status === "paid" || order.status === "generating";
  const waitingForWebhook = order.status === "preview" && returnedFromCheckout;

  // If Paystack's confirmation hasn't arrived after 2 minutes, say so instead of spinning forever.
  useEffect(() => {
    if (!waitingForWebhook) return;
    const timer = setTimeout(() => setWaitedTooLong(true), 120_000);
    return () => clearTimeout(timer);
  }, [waitingForWebhook]);

  // Poll while the song is being produced (or while Paystack's confirmation is on its way).
  useEffect(() => {
    if (!inProgress && !waitingForWebhook) return;
    const timer = setInterval(async () => {
      const res = await fetch(`/api/orders/${order.id}`, { cache: "no-store" });
      if (res.ok) setOrder(await res.json());
    }, 4000);
    return () => clearInterval(timer);
  }, [inProgress, waitingForWebhook, order.id]);

  // Report the sale to ad pixels once payment is confirmed.
  useEffect(() => {
    if (order.status !== "preview" && order.paidAmount && order.currency) {
      trackPurchaseOnce(order.id, order.paidAmount, order.currency);
    }
  }, [order.status, order.paidAmount, order.currency, order.id]);

  async function checkout(tier: TierId) {
    setPaying(tier);
    track("InitiateCheckout", { value: PRICES[tier] / 100, orderId: order.id });
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, tier, promoCode: promoCode.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed");
      window.location.assign(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
      setPaying(null);
    }
  }

  async function share() {
    const url = window.location.origin + window.location.pathname;
    if (navigator.share) {
      await navigator.share({ title: order.title, text: `A song for ${order.recipientName} 🎄`, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <p className="text-sm font-semibold uppercase tracking-wide text-berry">
        For {order.recipientName} · from {order.fromName}
      </p>
      <h1 className="mt-1 font-display text-4xl font-semibold text-pine-dark sm:text-5xl">&ldquo;{order.title}&rdquo;</h1>

      {order.status === "ready" && (
        <div className="card mt-6 space-y-5">
          {order.versions.map((v, i) => (
            <div key={i}>
              <p className="mb-2 font-semibold">{order.versions.length > 1 ? `Version ${i + 1}: ` : ""}{styleLabel(v.styleId)}</p>
              <audio controls src={v.audioUrl} className="w-full" />
              <a href={v.audioUrl} download className="mt-2 inline-block text-sm font-semibold text-pine underline">
                Download
              </a>
            </div>
          ))}
          <div className="flex flex-wrap gap-3 border-t border-line pt-5">
            <Link href={`/song/${order.id}/card`} className="btn-primary">🎁 Print the gift card</Link>
            <button onClick={share} className="btn-secondary">{copied ? "Link copied!" : "Share link"}</button>
          </div>
        </div>
      )}

      {(inProgress || waitingForWebhook) && (
        <div className="card mt-6 text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-pine/20 border-t-pine" />
          <p className="font-display text-xl font-semibold">Recording your song…</p>
          <p className="mt-1 text-muted">This usually takes 2–5 minutes. We&apos;ll also email you when it&apos;s ready, so feel free to close this page.</p>
          {waitingForWebhook && waitedTooLong && (
            <p className="mt-3 text-sm text-muted">
              Still waiting for payment confirmation. If you were charged, email{" "}
              <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a> with this page&apos;s link.
            </p>
          )}
        </div>
      )}

      {order.status === "preview" && paymentFailed && (
        <div className="card mt-6 bg-berry/5">
          <p className="font-semibold text-berry">Your payment wasn&apos;t completed, so you haven&apos;t been charged.</p>
          <p className="mt-1 text-muted">You can try again below.</p>
        </div>
      )}

      {order.status === "failed" && (
        <div className="card mt-6 bg-berry/5">
          <p className="font-semibold text-berry">{order.error ?? "Something went wrong."}</p>
          <p className="mt-1 text-muted">
            Email <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">{SUPPORT_EMAIL}</a> with this page&apos;s link and we&apos;ll fix it right away.
          </p>
        </div>
      )}

      <div className="card mt-6">
        <h2 className="font-display text-2xl font-semibold text-pine-dark">The lyrics</h2>
        <div className="mt-4 space-y-5">
          {order.lyrics.sections.map((s, i) => (
            <div key={i}>
              <p className="text-xs font-bold uppercase tracking-wider text-gold">{s.name}</p>
              {s.lines.map((line, j) => <p key={j} className="font-display text-lg leading-relaxed">{line}</p>)}
            </div>
          ))}
          {order.lockedSections > 0 && (
            <div className="relative">
              <div aria-hidden className="select-none space-y-1 blur-sm">
                {["Another verse with the memories you shared", "The bridge where the inside joke lands", "And a final chorus with their name"].map((l) => (
                  <p key={l} className="font-display text-lg">{l}</p>
                ))}
              </div>
              <p className="absolute inset-0 flex items-center justify-center text-center font-semibold text-pine">
                🔒 {order.lockedSections} more sections unlock with your song
              </p>
            </div>
          )}
        </div>
      </div>

      {order.status === "preview" && !waitingForWebhook && (
        <div className="mt-6">
          <h2 className="font-display text-2xl font-semibold text-pine-dark">Love it? Turn it into a real song</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {(Object.entries(TIERS) as [TierId, (typeof TIERS)[TierId]][]).map(([id, t]) => (
              <div key={id} className={`card flex flex-col ${id === "deluxe" ? "ring-2 ring-gold" : ""}`}>
                {id === "deluxe" && <p className="text-sm font-semibold text-berry">Most popular</p>}
                <h3 className="font-display text-xl font-semibold">{t.label}</h3>
                <p className="font-display text-3xl font-semibold">{formatMoney(PRICES[id])}</p>
                <p className="mt-2 flex-1 text-muted">{t.description}</p>
                <button onClick={() => checkout(id)} disabled={paying !== null} className="btn-primary mt-4">
                  {paying === id ? "Opening checkout…" : `Get ${t.label}`}
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            {showPromo ? (
              <div className="mx-auto flex max-w-sm gap-2">
                <input
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  placeholder="Promo code"
                  aria-label="Promo code"
                  maxLength={40}
                  className="field py-2 uppercase"
                />
              </div>
            ) : (
              <button onClick={() => setShowPromo(true)} className="text-sm font-semibold text-pine underline">
                Have a promo code?
              </button>
            )}
            {showPromo && <p className="mt-1 text-xs text-muted">Your discount is applied when you choose a package.</p>}
          </div>
          {error && <p className="mt-3 text-center text-berry">{error}</p>}
          <p className="mt-4 text-center text-sm text-muted">
            Not quite right? <Link href="/create" className="underline">Start over with new details</Link>
          </p>
        </div>
      )}
    </div>
  );
}
