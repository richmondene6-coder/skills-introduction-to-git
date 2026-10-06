import { SAMPLES } from "@/lib/samples";
import { STYLES } from "@/lib/types";

export default function Samples() {
  if (SAMPLES.length === 0) return null;
  return (
    <section className="mx-auto max-w-5xl px-4 pb-16">
      <h2 className="text-center font-display text-3xl font-semibold text-pine-dark sm:text-4xl">Hear real SongGift songs</h2>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {SAMPLES.map((s) => (
          <div key={s.audioUrl} className="card flex flex-col">
            <p className="text-xs font-bold uppercase tracking-wider text-gold">{STYLES.find((x) => x.id === s.styleId)?.label}</p>
            <h3 className="mt-1 font-display text-xl font-semibold">&ldquo;{s.title}&rdquo;</h3>
            <p className="text-sm text-muted">for {s.recipient}</p>
            <p className="mt-3 flex-1 font-display italic">&ldquo;{s.lyric}&rdquo;</p>
            <audio controls preload="none" src={s.audioUrl} className="mt-4 w-full" />
          </div>
        ))}
      </div>
    </section>
  );
}
