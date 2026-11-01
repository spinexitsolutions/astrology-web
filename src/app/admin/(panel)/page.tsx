import { ArrowUpRight, CalendarCheck, IndianRupee, Mail, ShoppingBag, Sparkles, Users } from "lucide-react";
import Link from "next/link";
import { Badge, Card, PageHeader } from "@/components/admin/ui";
import { RevenueChart } from "@/components/admin/RevenueChart";
import { getDB } from "@/lib/db";
import { money, shortDate, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default function Dashboard() {
  const db = getDB();
  const cur = db.settings.currency;
  const paidBookings = db.bookings.filter((b) => b.paid && b.status !== "cancelled");
  const liveOrders = db.orders.filter((o) => o.status !== "cancelled");
  const revenue = paidBookings.reduce((s, b) => s + b.amount, 0) + liveOrders.reduce((s, o) => s + o.total, 0);
  const newLeads = db.customers.filter((c) => c.status === "new").length + db.inquiries.filter((i) => i.status === "new").length;

  // last 14 days series
  const days: { label: string; key: string; revenue: number; bookings: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    days.push({ key, label: d.toLocaleDateString("en-IN", { day: "numeric", month: "short" }), revenue: 0, bookings: 0 });
  }
  const idx = (iso: string) => days.findIndex((x) => x.key === iso.slice(0, 10));
  for (const b of db.bookings) {
    const i = idx(b.createdAt);
    if (i >= 0) {
      days[i].bookings++;
      if (b.paid && b.status !== "cancelled") days[i].revenue += b.amount;
    }
  }
  for (const o of liveOrders) {
    const i = idx(o.createdAt);
    if (i >= 0) days[i].revenue += o.total;
  }

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = db.bookings
    .filter((b) => b.date >= today && b.status !== "cancelled" && b.status !== "completed")
    .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
    .slice(0, 5);

  const stages = ["new", "contacted", "qualified", "converted", "lost"] as const;
  const pipeline = stages.map((s) => ({ s, n: db.customers.filter((c) => c.status === s).length }));
  const maxStage = Math.max(1, ...pipeline.map((p) => p.n));

  const kpis = [
    { label: "Revenue", value: money(revenue, cur), icon: IndianRupee, sub: `${paidBookings.length} paid sessions · ${liveOrders.length} orders`, href: "/admin/orders" },
    { label: "Bookings", value: db.bookings.length, icon: CalendarCheck, sub: `${db.bookings.filter((b) => b.status === "pending").length} pending`, href: "/admin/bookings" },
    { label: "Orders", value: db.orders.length, icon: ShoppingBag, sub: `${db.orders.filter((o) => o.status === "placed" || o.status === "processing").length} to fulfil`, href: "/admin/orders" },
    { label: "New leads", value: newLeads, icon: Users, sub: `${db.customers.length} customers total`, href: "/admin/customers" },
    { label: "Subscribers", value: db.subscribers.length, icon: Mail, sub: "Daily horoscope list", href: "/admin/subscribers" },
  ];

  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <>
      <PageHeader
        eyebrow={new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
        title={`${greet}.`}
        subtitle="Here’s what the stars brought in today."
        actions={
          <>
            <Link href="/admin/settings" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium ring-1 ring-black/10 hover:bg-neutral-50">
              Edit site
            </Link>
            <Link href="/admin/bookings" className="inline-flex h-10 items-center gap-2 rounded-full bg-neutral-900 px-5 text-sm font-medium text-white hover:bg-neutral-700">
              New booking <ArrowUpRight className="size-4" />
            </Link>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-5">
        {kpis.map((k, i) => (
          <Link key={k.label} href={k.href} className={i === 0 ? "col-span-2 lg:col-span-1" : ""}>
            <Card className="group h-full p-5 transition hover:-translate-y-0.5 hover:shadow-lg">
              <div className="flex items-center justify-between">
                <span className="text-[13px] text-neutral-500">{k.label}</span>
                <span className="grid size-8 place-items-center rounded-full bg-[#C9963F]/10 text-[#B8873A]">
                  <k.icon className="size-4" />
                </span>
              </div>
              <div className="mt-3 font-display text-4xl tracking-tight">{k.value}</div>
              <div className="mt-1 text-[12px] text-neutral-400">{k.sub}</div>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
            <div>
              <div className="text-[13px] text-neutral-500">Last 14 days</div>
              <div className="font-display text-3xl">{money(days.reduce((s, d) => s + d.revenue, 0), cur)}</div>
            </div>
            <div className="flex gap-4 text-[12px] text-neutral-500">
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-[#C9963F]" /> Revenue</span>
              <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-neutral-900" /> Bookings</span>
            </div>
          </div>
          <RevenueChart data={days} currency={cur} />
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-medium">CRM pipeline</h3>
            <Link href="/admin/customers?view=board" className="text-[13px] text-[#B8873A] hover:underline">Open board</Link>
          </div>
          <div className="space-y-3">
            {pipeline.map((p) => (
              <div key={p.s}>
                <div className="mb-1 flex justify-between text-[13px]">
                  <span className="capitalize text-neutral-600">{p.s}</span>
                  <span className="font-medium">{p.n}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-[#E8B86D] to-[#C9963F]" style={{ width: `${(p.n / maxStage) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-2xl bg-neutral-50 p-4 text-[13px] text-neutral-600">
            Conversion rate{" "}
            <span className="font-semibold text-neutral-900">
              {db.customers.length ? Math.round((pipeline[3].n / db.customers.length) * 100) : 0}%
            </span>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 sm:p-6 lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">Upcoming consultations</h3>
            <Link href="/admin/bookings" className="text-[13px] text-[#B8873A] hover:underline">All bookings</Link>
          </div>
          {upcoming.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No upcoming sessions.</p>
          ) : (
            <ul className="divide-y divide-black/[0.05]">
              {upcoming.map((b) => (
                <li key={b.id} className="flex items-center gap-4 py-3">
                  <div className="grid w-14 shrink-0 place-items-center rounded-2xl bg-neutral-900 py-2 text-white">
                    <span className="text-[10px] uppercase tracking-wider text-white/60">{new Date(b.date).toLocaleDateString("en-IN", { month: "short" })}</span>
                    <span className="font-display text-2xl leading-none">{new Date(b.date).getDate()}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate font-medium">{b.name}</div>
                    <div className="truncate text-[13px] text-neutral-500">
                      {b.service} · {b.astrologer} · {b.mode} · {b.time}
                    </div>
                  </div>
                  <Badge tone={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card className="p-5 sm:p-6">
          <h3 className="mb-3 font-medium">Activity</h3>
          <ul className="space-y-3">
            {db.activity.slice(0, 8).map((a) => (
              <li key={a.id} className="flex gap-3">
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-[#C9963F]" />
                <div className="min-w-0">
                  <div className="text-[13px] leading-snug text-neutral-700">{a.text}</div>
                  <div className="text-[11px] text-neutral-400">{timeAgo(a.createdAt)}</div>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="mt-4 p-5 sm:p-6">
        <h3 className="mb-4 font-medium">Quick actions</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { href: "/admin/settings", label: "Edit intro animation", icon: Sparkles },
            { href: "/admin/posts", label: "Write a journal post", icon: ArrowUpRight },
            { href: "/admin/horoscopes", label: "Override a horoscope", icon: ArrowUpRight },
            { href: "/admin/products", label: "Add a product", icon: ArrowUpRight },
          ].map((q) => (
            <Link key={q.href + q.label} href={q.href} className="group flex items-center justify-between rounded-2xl bg-neutral-50 p-4 text-sm font-medium transition hover:bg-neutral-100">
              {q.label}
              <q.icon className="size-4 text-neutral-400 transition group-hover:text-[#C9963F]" />
            </Link>
          ))}
        </div>
        <p className="mt-4 text-[12px] text-neutral-400">Last order {db.orders[0] ? shortDate(db.orders[0].createdAt) : "—"}</p>
      </Card>
    </>
  );
}
