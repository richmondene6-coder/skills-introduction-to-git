import Link from "next/link";
import CountdownBanner from "@/components/countdown-banner";
import Samples from "@/components/samples";
import { formatMoney, PRICES } from "@/lib/pricing";
import { TIERS, type TierId } from "@/lib/types";

const steps = [
  { title: "Tell us about them", body: "Names, memories, inside jokes and what happened this year. It takes about 2 minutes." },
  { title: "Read your lyrics free", body: "Our songwriter drafts lyrics from your story. Preview the first verse and chorus before you pay." },
  { title: "Get your song in minutes", body: "A fully produced song with vocals, plus a printable gift card with a QR code for under the tree." },
];

const faqs = [
  { q: "How long does it take?", a: "Most songs are ready within 5 minutes of checkout. We also email you a link." },
  { q: "Can I choose the music style?", a: "Yes: classic crooner, holiday pop, country, cozy acoustic, kids' singalong or smooth R&B." },
  { q: "How do I give it as a gift?", a: "Print the gift card (or send the link). They scan the QR code and the song plays." },
  { q: "What if I don't love it?", a: "Email us within 7 days and we'll rewrite it once for free, or refund you in full. See our refund policy." },
];

export const revalidate = 3600;

export default function Home() {
  return (
    <div>
      <CountdownBanner />
      <section className="mx-auto max-w-5xl px-4 pb-16 pt-14 text-center sm:pt-20">
        <p className="mb-4 inline-block rounded-full bg-pine/10 px-4 py-1 text-sm font-semibold text-pine">
          The most personal gift under the tree this year
        </p>
        <h1 className="font-display text-4xl font-semibold leading-tight text-pine-dark sm:text-6xl">
          A Christmas song written <em className="text-berry">just for them</em>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          Their name in the chorus. Your memories in the verses. Your inside jokes in the bridge. A fully produced song,
          ready in minutes, that they&apos;ll play every December.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/create" className="btn-primary px-8 py-3.5 text-lg">
            Write my song, free preview →
          </Link>
          <span className="text-sm text-muted">From {formatMoney(PRICES.standard)} · Delivered in minutes</span>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-4 px-4 pb-16 sm:grid-cols-3">
        {steps.map((s, i) => (
          <div key={s.title} className="card">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-berry font-display text-lg text-white">
              {i + 1}
            </div>
            <h3 className="font-display text-xl font-semibold text-pine-dark">{s.title}</h3>
            <p className="mt-2 text-muted">{s.body}</p>
          </div>
        ))}
      </section>

      <Samples />

      <section className="bg-pine py-16 text-white">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center font-display text-3xl font-semibold sm:text-4xl">Simple pricing</h2>
          <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
            {(Object.entries(TIERS) as [TierId, (typeof TIERS)[TierId]][]).map(([id, t]) => (
              <div key={id} className={`rounded-2xl p-6 ${id === "deluxe" ? "bg-white text-ink ring-4 ring-gold" : "bg-pine-dark"}`}>
                {id === "deluxe" && <p className="mb-2 text-sm font-semibold text-berry">Most popular</p>}
                <h3 className="font-display text-2xl font-semibold">{t.label}</h3>
                <p className="mt-1 font-display text-4xl font-semibold">{formatMoney(PRICES[id])}</p>
                <p className={`mt-3 ${id === "deluxe" ? "text-muted" : "text-white/80"}`}>{t.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link href="/create" className="btn-primary px-8 py-3.5 text-lg">
              Start with a free lyric preview
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-16">
        <h2 className="text-center font-display text-3xl font-semibold text-pine-dark">Questions</h2>
        <div className="mt-6 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card cursor-pointer">
              <summary className="font-semibold">{f.q}</summary>
              <p className="mt-2 text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
