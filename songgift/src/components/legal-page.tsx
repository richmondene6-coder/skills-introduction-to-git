export default function LegalPage({ title, updated, children }: { title: string; updated: string; children: React.ReactNode }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 [&_h2]:mt-8 [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-semibold [&_li]:ml-5 [&_li]:list-disc [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:space-y-1">
      <h1 className="font-display text-4xl font-semibold text-pine-dark">{title}</h1>
      <p className="mt-2 text-sm text-muted">Last updated {updated}</p>
      {children}
    </article>
  );
}
