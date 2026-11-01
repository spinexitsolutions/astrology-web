"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Kanban, List, Mail, MessageCircle, Phone, Plus, Search, Trash2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import type { Booking, Customer, LeadStatus, Order } from "@/lib/types";
import { SIGNS } from "@/lib/zodiac";
import { cn, money, shortDate, timeAgo } from "@/lib/utils";
import { api, Badge, Button, Card, Drawer, Empty, Input, Label, PageHeader, Segmented, Select, Textarea, useToast } from "./ui";

const STAGES: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];
const STAGE_DOT: Record<LeadStatus, string> = { new: "bg-sky-500", contacted: "bg-violet-500", qualified: "bg-amber-500", converted: "bg-emerald-500", lost: "bg-neutral-400" };

const blank = (): Customer => ({ id: "", name: "", phone: "", email: "", city: "", sign: "", dob: "", status: "new", tags: "", notes: "", source: "Manual", value: 0, lastContact: new Date().toISOString(), createdAt: new Date().toISOString() });

export const waLink = (phone: string) => `https://wa.me/${phone.replace(/\D/g, "")}`;

export function Customers({ initial, bookings, orders, currency }: { initial: Customer[]; bookings: Booking[]; orders: Order[]; currency: string }) {
  const params = useSearchParams();
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [view, setView] = useState<"table" | "board">(params.get("view") === "board" ? "board" : "table");
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Customer | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragId, setDragId] = useState<string | null>(null);
  const [overStage, setOverStage] = useState<LeadStatus | null>(null);

  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return rows.filter((c) => (status === "all" || c.status === status) && (!n || [c.name, c.email, c.phone, c.city, c.tags].join(" ").toLowerCase().includes(n)));
  }, [rows, q, status]);

  const move = async (c: Customer, s: LeadStatus) => {
    if (c.status === s) return;
    setRows((r) => r.map((x) => (x.id === c.id ? { ...x, status: s } : x)));
    if (sel?.id === c.id) setSel({ ...c, status: s });
    await api(`/api/admin/collections/customers/${c.id}`, "PUT", { status: s, lastContact: new Date().toISOString() });
    toast(`${c.name} → ${s}`);
  };

  const save = async () => {
    if (!sel) return;
    if (!sel.name.trim()) return toast("Name is required", "err");
    setSaving(true);
    try {
      if (isNew) {
        const { id: _id, ...body } = sel;
        void _id;
        const c = await api<Customer>("/api/admin/collections/customers", "POST", body);
        setRows((r) => [c, ...r]);
        toast("Customer added");
      } else {
        const c = await api<Customer>(`/api/admin/collections/customers/${sel.id}`, "PUT", sel);
        setRows((r) => r.map((x) => (x.id === c.id ? c : x)));
        toast("Customer saved");
      }
      setSel(null);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (c: Customer) => {
    if (!confirm(`Delete ${c.name}?`)) return;
    await api(`/api/admin/collections/customers/${c.id}`, "DELETE");
    setRows((r) => r.filter((x) => x.id !== c.id));
    setSel(null);
    toast("Customer deleted");
  };

  const matches = (c: Customer, x: { email: string; phone: string }) =>
    (c.email && x.email && c.email.toLowerCase() === x.email.toLowerCase()) || (c.phone && x.phone && c.phone.replace(/\D/g, "") === x.phone.replace(/\D/g, ""));

  const related = sel && !isNew ? { b: bookings.filter((b) => matches(sel, b)), o: orders.filter((o) => matches(sel, o)) } : null;

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Customers"
        subtitle="Every lead from bookings, orders and inquiries — in one pipeline."
        actions={
          <Button variant="gold" onClick={() => { setIsNew(true); setSel(blank()); }}>
            <Plus className="size-4" /> Add customer
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search name, phone, tag…" className="h-10 w-full rounded-full bg-white pl-10 pr-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-[#C9963F]/40" />
        </div>
        {view === "table" && (
          <Segmented
            value={status}
            onChange={setStatus}
            options={[{ value: "all", label: "All", count: rows.length }, ...STAGES.map((s) => ({ value: s, label: s, count: rows.filter((r) => r.status === s).length }))]}
          />
        )}
        <div className="flex gap-1 rounded-full bg-black/[0.05] p-1 lg:ml-auto">
          {(["table", "board"] as const).map((v) => (
            <button key={v} onClick={() => setView(v)} className={cn("flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[13px] font-medium capitalize", view === v ? "bg-white shadow-sm" : "text-neutral-500")}>
              {v === "table" ? <List className="size-4" /> : <Kanban className="size-4" />} {v}
            </button>
          ))}
        </div>
      </div>

      {view === "table" ? (
        filtered.length === 0 ? (
          <Empty text="No customers match." />
        ) : (
          <Card className="overflow-hidden">
            {/* mobile cards */}
            <ul className="divide-y divide-black/[0.05] md:hidden">
              {filtered.map((c) => (
                <li key={c.id}>
                  <button onClick={() => { setIsNew(false); setSel(c); }} className="flex w-full items-center gap-3 p-4 text-left">
                    <Avatar name={c.name} />
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">{c.name}</div>
                      <div className="truncate text-[12px] text-neutral-500">{c.phone || c.email}</div>
                    </div>
                    <Badge tone={c.status} />
                  </button>
                </li>
              ))}
            </ul>
            <table className="hidden w-full text-sm md:table">
              <thead>
                <tr className="border-b border-black/[0.05] text-left text-[12px] text-neutral-400">
                  <th className="px-5 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Contact</th>
                  <th className="px-3 py-3 font-medium">Tags</th>
                  <th className="px-3 py-3 font-medium">Value</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Last contact</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} onClick={() => { setIsNew(false); setSel(c); }} className="cursor-pointer border-b border-black/[0.04] transition last:border-0 hover:bg-neutral-50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar name={c.name} />
                        <div>
                          <div className="font-medium">{c.name}</div>
                          <div className="text-[12px] text-neutral-400">{c.city || "—"} {c.sign && `· ${c.sign}`}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-[13px] text-neutral-600">
                      <div>{c.phone}</div>
                      <div className="text-neutral-400">{c.email}</div>
                    </td>
                    <td className="max-w-[180px] px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.tags.split(",").filter(Boolean).slice(0, 3).map((t) => (
                          <span key={t} className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-[11px] text-neutral-600">{t.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-3 py-3 font-medium">{money(c.value, currency)}</td>
                    <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                      <select value={c.status} onChange={(e) => move(c, e.target.value as LeadStatus)} className="cursor-pointer rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] capitalize outline-none">
                        {STAGES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3 text-right text-[13px] text-neutral-400">{timeAgo(c.lastContact)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )
      ) : (
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0">
          {STAGES.map((s) => {
            const items = filtered.filter((c) => c.status === s);
            return (
              <div
                key={s}
                onDragOver={(e) => { e.preventDefault(); setOverStage(s); }}
                onDragLeave={() => setOverStage(null)}
                onDrop={() => {
                  const c = rows.find((x) => x.id === dragId);
                  if (c) move(c, s);
                  setDragId(null);
                  setOverStage(null);
                }}
                className={cn("w-[260px] shrink-0 snap-start rounded-[22px] bg-black/[0.035] p-3 transition", overStage === s && "bg-[#C9963F]/15 ring-2 ring-[#C9963F]/40")}
              >
                <div className="mb-3 flex items-center justify-between px-1">
                  <span className="flex items-center gap-2 text-[13px] font-medium capitalize">
                    <span className={cn("size-2 rounded-full", STAGE_DOT[s])} /> {s}
                  </span>
                  <span className="text-[12px] text-neutral-400">{money(items.reduce((a, c) => a + c.value, 0), currency)}</span>
                </div>
                <div className="min-h-[120px] space-y-2">
                  <AnimatePresence>
                    {items.map((c) => (
                      <motion.div
                        key={c.id}
                        layout
                        layoutId={`card-${c.id}`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: dragId === c.id ? 0.4 : 1 }}
                        exit={{ opacity: 0 }}
                        draggable
                        onDragStart={() => setDragId(c.id)}
                        onDragEnd={() => setDragId(null)}
                        onClick={() => { setIsNew(false); setSel(c); }}
                        className="cursor-grab rounded-2xl bg-white p-3 shadow-[0_1px_2px_rgba(0,0,0,0.06)] active:cursor-grabbing"
                      >
                        <div className="flex items-center gap-2">
                          <Avatar name={c.name} small />
                          <div className="min-w-0 flex-1 truncate text-[13px] font-medium">{c.name}</div>
                        </div>
                        <div className="mt-2 truncate text-[12px] text-neutral-500">{c.tags || c.source}</div>
                        <div className="mt-2 flex items-center justify-between text-[11px] text-neutral-400">
                          <span>{money(c.value, currency)}</span>
                          <span>{timeAgo(c.lastContact)}</span>
                        </div>
                        {/* mobile: tap-to-move */}
                        <div className="mt-2 flex flex-wrap gap-1 sm:hidden" onClick={(e) => e.stopPropagation()}>
                          {STAGES.filter((x) => x !== s).map((x) => (
                            <button key={x} onClick={() => move(c, x)} className="rounded-full bg-neutral-100 px-2 py-0.5 text-[10px] capitalize text-neutral-600">{x}</button>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Drawer
        open={!!sel}
        onClose={() => setSel(null)}
        title={isNew ? "New customer" : sel?.name || "Customer"}
        wide
        footer={
          <>
            {!isNew && sel && (
              <Button variant="danger" className="mr-auto" onClick={() => remove(sel)}>
                <Trash2 className="size-4" />
              </Button>
            )}
            <Button variant="secondary" onClick={() => setSel(null)}>Cancel</Button>
            <Button onClick={save} loading={saving}>Save</Button>
          </>
        }
      >
        {sel && (
          <div className="space-y-6">
            {!isNew && (
              <div className="flex flex-wrap gap-2">
                {sel.phone && (
                  <>
                    <a href={`tel:${sel.phone}`} className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[13px] ring-1 ring-black/10"><Phone className="size-4" /> Call</a>
                    <a href={waLink(sel.phone)} target="_blank" className="inline-flex h-9 items-center gap-2 rounded-full bg-[#25D366] px-4 text-[13px] text-white"><MessageCircle className="size-4" /> WhatsApp</a>
                  </>
                )}
                {sel.email && <a href={`mailto:${sel.email}`} className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[13px] ring-1 ring-black/10"><Mail className="size-4" /> Email</a>}
              </div>
            )}

            <div>
              <Label>Pipeline stage</Label>
              <div className="grid grid-cols-5 gap-1 rounded-2xl bg-black/[0.04] p-1">
                {STAGES.map((s) => (
                  <button key={s} onClick={() => setSel({ ...sel, status: s })} className={cn("rounded-xl py-2 text-[12px] font-medium capitalize transition", sel.status === s ? "bg-white shadow-sm" : "text-neutral-500")}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {(["name", "phone", "email", "city"] as const).map((k) => (
                <div key={k} className="col-span-2 sm:col-span-1">
                  <Label>{k[0].toUpperCase() + k.slice(1)}</Label>
                  <Input value={sel[k]} onChange={(e) => setSel({ ...sel, [k]: e.target.value })} />
                </div>
              ))}
              <div className="col-span-2 sm:col-span-1">
                <Label>Sun sign</Label>
                <Select options={["", ...SIGNS.map((s) => s.name)]} value={sel.sign} onChange={(e) => setSel({ ...sel, sign: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label>Date of birth</Label>
                <Input type="date" value={sel.dob} onChange={(e) => setSel({ ...sel, dob: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label hint="Comma separated">Tags</Label>
                <Input value={sel.tags} onChange={(e) => setSel({ ...sel, tags: e.target.value })} />
              </div>
              <div className="col-span-2 sm:col-span-1">
                <Label>Lifetime value ({currency})</Label>
                <Input type="number" value={sel.value} onChange={(e) => setSel({ ...sel, value: Number(e.target.value) })} />
              </div>
              <div className="col-span-2">
                <Label>Notes</Label>
                <Textarea value={sel.notes} onChange={(e) => setSel({ ...sel, notes: e.target.value })} placeholder="Preferences, follow-ups, chart notes…" />
              </div>
            </div>

            {related && (
              <div className="space-y-4">
                <div>
                  <div className="mb-2 text-[13px] font-medium text-neutral-700">Bookings ({related.b.length})</div>
                  {related.b.length === 0 ? <p className="text-[13px] text-neutral-400">None yet.</p> : (
                    <ul className="space-y-2">
                      {related.b.map((b) => (
                        <li key={b.id} className="flex items-center justify-between rounded-2xl bg-white p-3 text-[13px] ring-1 ring-black/5">
                          <span><b className="font-medium">{b.service}</b><br /><span className="text-neutral-400">{shortDate(b.date)} · {b.astrologer}</span></span>
                          <Badge tone={b.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div>
                  <div className="mb-2 text-[13px] font-medium text-neutral-700">Orders ({related.o.length})</div>
                  {related.o.length === 0 ? <p className="text-[13px] text-neutral-400">None yet.</p> : (
                    <ul className="space-y-2">
                      {related.o.map((o) => (
                        <li key={o.id} className="flex items-center justify-between rounded-2xl bg-white p-3 text-[13px] ring-1 ring-black/5">
                          <span><b className="font-medium">{money(o.total, currency)}</b><br /><span className="text-neutral-400">{o.items.map((i) => i.name).join(", ")}</span></span>
                          <Badge tone={o.status} />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p className="text-[12px] text-neutral-400">Source: {sel.source} · Added {shortDate(sel.createdAt)}</p>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </>
  );
}

export function Avatar({ name, small }: { name: string; small?: boolean }) {
  const initials = name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
  const hue = [...name].reduce((a, c) => a + c.charCodeAt(0), 0) % 360;
  return (
    <span className={cn("grid shrink-0 place-items-center rounded-full font-medium text-white", small ? "size-7 text-[10px]" : "size-9 text-[12px]")} style={{ background: `linear-gradient(135deg, hsl(${hue} 55% 60%), hsl(${(hue + 40) % 360} 55% 42%))` }}>
      {initials}
    </span>
  );
}
