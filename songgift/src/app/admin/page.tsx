import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, isAdminToken } from "@/lib/admin-auth";
import { attributionLabel } from "@/lib/attribution";
import { listOrders } from "@/lib/store";
import type { Order } from "@/lib/types";
import RetryButton from "./retry-button";

export const metadata: Metadata = { title: "Admin · SongGift", robots: { index: false } };

const GOAL_CENTS = 200_000_00;
const usd = (cents: number) => `$${(cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const isPaid = (o: Order) => o.status !== "preview";

export default async function AdminPage({ searchParams }: PageProps<"/admin">) {
  const jar = await cookies();
  if (!process.env.ADMIN_PASSWORD) {
    return <Notice>Set the <code>ADMIN_PASSWORD</code> environment variable to enable the dashboard.</Notice>;
  }
  if (!isAdminToken(jar.get(ADMIN_COOKIE)?.value)) {
    const { error } = await searchParams;
    return (
      <div className="mx-auto max-w-sm px-4 py-16">
        <h1 className="font-display text-3xl font-semibold text-pine-dark">Admin</h1>
        <form action="/api/admin/login" method="post" className="mt-6 space-y-3">
          <input name="password" type="password" required placeholder="Password" className="field" autoFocus />
          {error && <p className="text-berry">Wrong password</p>}
          <button className="btn-primary w-full">Sign in</button>
        </form>
      </div>
    );
  }

  const orders = await listOrders(1000);
  const paid = orders.filter(isPaid);
  const revenue = paid.reduce((sum, o) => sum + (o.amountPaidCents ?? 0), 0);
  const today = new Date().toISOString().slice(0, 10);
  const revenueToday = paid.filter((o) => o.paidAt?.startsWith(today)).reduce((s, o) => s + (o.amountPaidCents ?? 0), 0);
  const conversion = orders.length ? Math.round((paid.length / orders.length) * 100) : 0;
  const failed = orders.filter((o) => o.status === "failed");

  const bySource = new Map<string, { previews: number; sales: number; revenue: number }>();
  for (const o of orders) {
    const label = attributionLabel(o.attribution);
    const row = bySource.get(label) ?? { previews: 0, sales: 0, revenue: 0 };
    row.previews += 1;
    if (isPaid(o)) {
      row.sales += 1;
      row.revenue += o.amountPaidCents ?? 0;
    }
    bySource.set(label, row);
  }
  const sources = [...bySource.entries()].sort((a, b) => b[1].revenue - a[1].revenue);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-display text-3xl font-semibold text-pine-dark">Dashboard</h1>
      <p className="text-sm text-muted">Based on the latest {orders.length} orders</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        <Stat label="Revenue" value={usd(revenue)} sub={`${Math.round((revenue / GOAL_CENTS) * 100)}% of $200k goal`} />
        <Stat label="Today" value={usd(revenueToday)} />
        <Stat label="Paid orders" value={paid.length.toLocaleString()} sub={`of ${orders.length} previews`} />
        <Stat label="Preview → paid" value={`${conversion}%`} />
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-line">
        <div className="h-full bg-berry" style={{ width: `${Math.min(100, (revenue / GOAL_CENTS) * 100)}%` }} />
      </div>

      {failed.length > 0 && (
        <div className="card mt-6 border-berry/40 bg-berry/5">
          <p className="font-semibold text-berry">{failed.length} failed song{failed.length > 1 ? "s" : ""} need attention</p>
        </div>
      )}

      <h2 className="mt-10 font-display text-2xl font-semibold">Sales by source</h2>
      <Table head={["Source", "Previews", "Sales", "Conversion", "Revenue"]}>
        {sources.map(([label, r]) => (
          <tr key={label} className="border-t border-line">
            <td className="py-2 pr-4">{label}</td>
            <td className="pr-4">{r.previews}</td>
            <td className="pr-4">{r.sales}</td>
            <td className="pr-4">{Math.round((r.sales / r.previews) * 100)}%</td>
            <td>{usd(r.revenue)}</td>
          </tr>
        ))}
      </Table>

      <h2 className="mt-10 font-display text-2xl font-semibold">Recent orders</h2>
      <Table head={["Created", "Song", "Buyer", "Status", "Paid", "Source", ""]}>
        {orders.slice(0, 100).map((o) => (
          <tr key={o.id} className="border-t border-line align-top">
            <td className="py-2 pr-4 whitespace-nowrap">{new Date(o.createdAt).toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" })}</td>
            <td className="pr-4"><Link href={`/song/${o.id}`} className="underline">{o.lyrics.title}</Link><br /><span className="text-muted">for {o.quiz.recipientName}</span></td>
            <td className="pr-4">{o.quiz.email}</td>
            <td className="pr-4"><StatusBadge status={o.status} /></td>
            <td className="pr-4">{o.amountPaidCents ? usd(o.amountPaidCents) : "–"}</td>
            <td className="pr-4">{attributionLabel(o.attribution)}</td>
            <td>{o.status === "failed" && <RetryButton orderId={o.id} />}</td>
          </tr>
        ))}
      </Table>
    </div>
  );
}

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="card">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 font-display text-3xl font-semibold">{value}</p>
      {sub && <p className="text-sm text-muted">{sub}</p>}
    </div>
  );
}

function Table({ head, children }: { head: string[]; children: React.ReactNode }) {
  return (
    <div className="card mt-3 overflow-x-auto p-4">
      <table className="w-full text-left text-sm">
        <thead className="text-muted">
          <tr>{head.map((h) => <th key={h} className="pb-2 pr-4 font-semibold">{h}</th>)}</tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

const STATUS_STYLES: Record<Order["status"], string> = {
  preview: "bg-line text-muted",
  paid: "bg-gold/20 text-ink",
  generating: "bg-gold/20 text-ink",
  ready: "bg-pine/15 text-pine",
  failed: "bg-berry/15 text-berry",
};

function StatusBadge({ status }: { status: Order["status"] }) {
  return <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_STYLES[status]}`}>{status}</span>;
}

function Notice({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto max-w-xl px-4 py-16 text-center text-muted">{children}</div>;
}
