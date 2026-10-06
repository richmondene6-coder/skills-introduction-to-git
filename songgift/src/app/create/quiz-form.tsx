"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { track } from "@/lib/track";
import { RELATIONSHIPS, STYLES, TONES } from "@/lib/types";

const TONE_LABELS: Record<(typeof TONES)[number], string> = {
  heartfelt: "Heartfelt 🥹",
  funny: "Funny 😂",
  mix: "A bit of both",
};

export default function QuizForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const body = Object.fromEntries(new FormData(e.currentTarget));
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      track("Lead", { orderId: data.id });
      router.push(`/song/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <div className="card space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="recipientName">Who is the song for?</label>
            <input id="recipientName" name="recipientName" required maxLength={60} className="field" placeholder="e.g. Grandma Rose" />
          </div>
          <div>
            <label className="label" htmlFor="relationship">They are my…</label>
            <select id="relationship" name="relationship" className="field" defaultValue="partner">
              {RELATIONSHIPS.map((r) => (
                <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fromName">From</label>
            <input id="fromName" name="fromName" required maxLength={60} className="field" placeholder="e.g. Sam & the kids" />
          </div>
          <div>
            <label className="label" htmlFor="occasion">Occasion</label>
            <input id="occasion" name="occasion" maxLength={80} className="field" defaultValue="Christmas" />
          </div>
        </div>
      </div>

      <div className="card space-y-4">
        <div>
          <label className="label" htmlFor="memories">Favorite memories and details about them</label>
          <textarea id="memories" name="memories" required minLength={10} maxLength={800} rows={4} className="field"
            placeholder="How you met, what they love, the things only you would know. e.g. She makes cinnamon rolls every Christmas morning and always burns the first batch." />
        </div>
        <div>
          <label className="label" htmlFor="insideJokes">Inside jokes or nicknames <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="insideJokes" name="insideJokes" maxLength={400} rows={2} className="field" placeholder="e.g. We call him 'Captain Thermostat'" />
        </div>
        <div>
          <label className="label" htmlFor="thisYear">What happened this year? <span className="font-normal text-muted">(optional)</span></label>
          <textarea id="thisYear" name="thisYear" maxLength={400} rows={2} className="field" placeholder="e.g. New puppy, first marathon, moved to Denver" />
        </div>
      </div>

      <div className="card space-y-5">
        <fieldset>
          <legend className="label">Music style</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {STYLES.map((s, i) => (
              <label key={s.id} className="flex cursor-pointer items-center gap-3 rounded-xl border border-line px-4 py-3 has-[:checked]:border-pine has-[:checked]:bg-pine/5">
                <input type="radio" name="style" value={s.id} defaultChecked={i === 0} className="accent-pine" />
                {s.label}
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset>
          <legend className="label">Tone</legend>
          <div className="flex flex-wrap gap-2">
            {TONES.map((t) => (
              <label key={t} className="flex cursor-pointer items-center gap-2 rounded-full border border-line px-4 py-2 has-[:checked]:border-pine has-[:checked]:bg-pine/5">
                <input type="radio" name="tone" value={t} defaultChecked={t === "mix"} className="accent-pine" />
                {TONE_LABELS[t]}
              </label>
            ))}
          </div>
        </fieldset>
        <div>
          <label className="label" htmlFor="email">Your email <span className="font-normal text-muted">(we&apos;ll send the song here)</span></label>
          <input id="email" name="email" type="email" required className="field" placeholder="you@example.com" />
        </div>
      </div>

      {error && <p className="rounded-xl bg-berry/10 px-4 py-3 text-berry">{error}</p>}

      <button type="submit" disabled={submitting} className="btn-primary w-full py-4 text-lg">
        {submitting ? "Writing your lyrics… (about 30 seconds)" : "Write my lyrics, free preview →"}
      </button>
    </form>
  );
}
