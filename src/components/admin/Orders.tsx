"use client";

import { MessageCircle, Package, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Order } from "@/lib/types";
import { money, shortDate } from "@/lib/utils";
import { waLink } from "./Customers";
import { api, Badge, Button, Card, Drawer, Empty, PageHeader, Segmented, useToast } from "./ui";

const STATUSES: Order["status"][] = ["placed", "processing", "shipped", "delivered", "cancelled"];

export function Orders({ initial, currency }: { initial: Order[]; currency: string }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<"all" | Order["status"]>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Order | null>(null);

  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return rows.filter((o) => (status === "all" || o.status === status) && (!n || [o.name, o.phone, o.email, o.id, ...o.items.map((i) => i.name)].join(" ").toLowerCase().includes(n)));
  }, [rows, q, status]);

  const setStatusOf = async (o: Order, s: Order["status"]) => {
    setRows((r) => r.map((x) => (x.id === o.id ? { ...x, status: s } : x)));
    if (sel?.id === o.id) setSel({ ...o, status: s });
    await api(`/api/admin/collections/orders/${o.id}`, "PUT", { status: s });
    toast(`Order marked ${s}`);
  };

  const remove = async (o: Order) => {
    if (!confirm("Delete this order?")) return;
    await api(`/api/admin/collections/orders/${o.id}`, "DELETE");
    setRows((r) => r.filter((x) => x.id !== o.id));
    setSel(null);
    toast("Order deleted");
  };

  const total = rows.filter((o) => o.status !== "cancelled").reduce((a, o) => a + o.total, 0);

  return (
    <>
      <PageHeader eyebrow="CRM" title="Orders" subtitle={`${rows.length} orders · ${money(total, currency)} gross`} />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders…" className="h-10 w-full rounded-full bg-white pl-10 pr-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-[#C9963F]/40" />
        </div>
        <Segmented value={status} onChange={setStatus} options={[{ value: "all", label: "All", count: rows.length }, ...STATUSES.map((s) => ({ value: s, label: s, count: rows.filter((r) => r.status === s).length }))]} />
      </div>

      {filtered.length === 0 ? <Empty text="No orders here." /> : (
        <Card className="divide-y divide-black/[0.05] overflow-hidden">
          {filtered.map((o) => (
            <div key={o.id} className="flex flex-col gap-3 p-4 transition hover:bg-neutral-50 sm:flex-row sm:items-center">
              <button onClick={() => setSel(o)} className="flex flex-1 items-center gap-4 text-left">
                <span className="grid size-11 shrink-0 place-items-center rounded-2xl bg-[#C9963F]/10 text-[#B8873A]"><Package className="size-5" /></span>
                <div className="min-w-0">
                  <div className="font-medium">{o.name} <span className="font-mono text-[11px] font-normal text-neutral-400">#{o.id.slice(-6).toUpperCase()}</span></div>
                  <div className="truncate text-[13px] text-neutral-500">{o.items.map((i) => `${i.name}${i.qty > 1 ? ` ×${i.qty}` : ""}`).join(", ")}</div>
                  <div className="text-[12px] text-neutral-400">{shortDate(o.createdAt)} · {o.payment}</div>
                </div>
              </button>
              <div className="flex items-center gap-2 sm:justify-end">
                <span className="mr-1 font-medium">{money(o.total, currency)}</span>
                <select value={o.status} onChange={(e) => setStatusOf(o, e.target.value as Order["status"])} className="cursor-pointer rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] capitalize outline-none">
                  {STATUSES.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
          ))}
        </Card>
      )}

      <Drawer open={!!sel} onClose={() => setSel(null)} title={sel ? `Order #${sel.id.slice(-6).toUpperCase()}` : "Order"} footer={sel && <>
        <Button variant="danger" className="mr-auto" onClick={() => remove(sel)}><Trash2 className="size-4" /></Button>
        <a href={waLink(sel.phone)} target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full bg-[#25D366] px-5 text-sm font-medium text-white"><MessageCircle className="size-4" /> WhatsApp</a>
      </>}>
        {sel && (
          <div className="space-y-6">
            <div>
              <div className="mb-2 text-[13px] font-medium text-neutral-700">Fulfilment</div>
              <div className="flex items-center gap-1">
                {STATUSES.filter((s) => s !== "cancelled").map((s, i, arr) => {
                  const reached = arr.indexOf(sel.status as typeof s) >= i && sel.status !== "cancelled";
                  return (
                    <button key={s} onClick={() => setStatusOf(sel, s)} className="flex-1">
                      <div className={`h-1.5 rounded-full ${reached ? "bg-[#C9963F]" : "bg-neutral-200"}`} />
                      <div className={`mt-1.5 text-[11px] capitalize ${reached ? "text-neutral-900" : "text-neutral-400"}`}>{s}</div>
                    </button>
                  );
                })}
              </div>
              {sel.status === "cancelled" ? <div className="mt-3"><Badge tone="cancelled" /></div> : (
                <button onClick={() => setStatusOf(sel, "cancelled")} className="mt-3 text-[12px] text-red-500 hover:underline">Cancel order</button>
              )}
            </div>
            <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
              {sel.items.map((i) => (
                <div key={i.productId} className="flex justify-between py-1.5 text-sm">
                  <span>{i.name} <span className="text-neutral-400">×{i.qty}</span></span>
                  <span>{money(i.price * i.qty, currency)}</span>
                </div>
              ))}
              <div className="mt-2 flex justify-between border-t border-black/5 pt-3 font-medium">
                <span>Total</span><span>{money(sel.total, currency)}</span>
              </div>
            </div>
            <dl className="grid grid-cols-[110px_1fr] gap-y-2 text-sm">
              <dt className="text-neutral-400">Customer</dt><dd>{sel.name}</dd>
              <dt className="text-neutral-400">Phone</dt><dd>{sel.phone}</dd>
              <dt className="text-neutral-400">Email</dt><dd>{sel.email || "—"}</dd>
              <dt className="text-neutral-400">Address</dt><dd>{sel.address || "—"}</dd>
              <dt className="text-neutral-400">Payment</dt><dd>{sel.payment}</dd>
              <dt className="text-neutral-400">Placed</dt><dd>{shortDate(sel.createdAt)}</dd>
            </dl>
          </div>
        )}
      </Drawer>
    </>
  );
}
