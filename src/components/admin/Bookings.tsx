"use client";

import { CalendarCheck, MessageCircle, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import type { Booking } from "@/lib/types";
import { cn, money, shortDate } from "@/lib/utils";
import { waLink } from "./Customers";
import { api, Badge, Button, Card, Drawer, Empty, Input, Label, PageHeader, Segmented, Select, Textarea, Toggle, useToast } from "./ui";

const STATUSES: Booking["status"][] = ["pending", "confirmed", "completed", "cancelled"];

export function Bookings({ initial, services, astrologers, currency }: { initial: Booking[]; services: string[]; astrologers: string[]; currency: string }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<"all" | Booking["status"]>("all");
  const [q, setQ] = useState("");
  const [sel, setSel] = useState<Booking | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return rows
      .filter((b) => (status === "all" || b.status === status) && (!n || [b.name, b.phone, b.email, b.service, b.astrologer].join(" ").toLowerCase().includes(n)))
      .sort((a, b) => (b.date + b.time).localeCompare(a.date + a.time));
  }, [rows, q, status]);

  const patch = async (b: Booking, p: Partial<Booking>) => {
    setRows((r) => r.map((x) => (x.id === b.id ? { ...x, ...p } : x)));
    await api(`/api/admin/collections/bookings/${b.id}`, "PUT", p);
    toast("Booking updated");
  };

  const blank = (): Booking => ({
    id: "", name: "", phone: "", email: "", service: services[0] ?? "", astrologer: astrologers[0] ?? "", mode: "Call",
    date: new Date().toISOString().slice(0, 10), time: "11:00", dob: "", tob: "", pob: "", message: "", amount: 999, status: "confirmed", paid: false, createdAt: new Date().toISOString(),
  });

  const save = async () => {
    if (!sel) return;
    if (!sel.name || !sel.phone) return toast("Name & phone required", "err");
    setSaving(true);
    try {
      if (isNew) {
        const { id: _id, ...body } = sel;
        void _id;
        const b = await api<Booking>("/api/admin/collections/bookings", "POST", body);
        setRows((r) => [b, ...r]);
        toast("Booking created");
      } else {
        const b = await api<Booking>(`/api/admin/collections/bookings/${sel.id}`, "PUT", sel);
        setRows((r) => r.map((x) => (x.id === b.id ? b : x)));
        toast("Booking saved");
      }
      setSel(null);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (b: Booking) => {
    if (!confirm(`Delete booking for ${b.name}?`)) return;
    await api(`/api/admin/collections/bookings/${b.id}`, "DELETE");
    setRows((r) => r.filter((x) => x.id !== b.id));
    setSel(null);
    toast("Booking deleted");
  };

  const set = <K extends keyof Booking>(k: K, v: Booking[K]) => sel && setSel({ ...sel, [k]: v });

  return (
    <>
      <PageHeader
        eyebrow="CRM"
        title="Bookings"
        subtitle={`${rows.filter((b) => b.status === "pending").length} awaiting confirmation · ${money(rows.filter((b) => b.paid).reduce((a, b) => a + b.amount, 0), currency)} collected`}
        actions={<Button variant="gold" onClick={() => { setIsNew(true); setSel(blank()); }}><Plus className="size-4" /> New booking</Button>}
      />
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <div className="relative lg:w-72">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search bookings…" className="h-10 w-full rounded-full bg-white pl-10 pr-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-[#C9963F]/40" />
        </div>
        <Segmented value={status} onChange={setStatus} options={[{ value: "all", label: "All", count: rows.length }, ...STATUSES.map((s) => ({ value: s, label: s, count: rows.filter((r) => r.status === s).length }))]} />
      </div>

      {filtered.length === 0 ? <Empty text="No bookings here." /> : (
        <div className="space-y-2.5">
          {filtered.map((b) => (
            <Card key={b.id} className="p-4 transition hover:shadow-md">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <button onClick={() => { setIsNew(false); setSel(b); }} className="flex flex-1 items-center gap-4 text-left">
                  <div className={cn("grid w-14 shrink-0 place-items-center rounded-2xl py-2", b.status === "cancelled" ? "bg-neutral-100 text-neutral-400" : "bg-neutral-900 text-white")}>
                    <span className="text-[10px] uppercase tracking-wider opacity-60">{b.date ? new Date(b.date).toLocaleDateString("en-IN", { month: "short" }) : "—"}</span>
                    <span className="font-display text-2xl leading-none">{b.date ? new Date(b.date).getDate() : "?"}</span>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium">{b.name} <span className="text-[13px] font-normal text-neutral-400">· {b.time} · {b.mode}</span></div>
                    <div className="truncate text-[13px] text-neutral-500">{b.service} with {b.astrologer}</div>
                    {b.message && <div className="mt-0.5 truncate text-[12px] italic text-neutral-400">“{b.message}”</div>}
                  </div>
                </button>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <span className="mr-1 font-medium">{money(b.amount, currency)}</span>
                  <button onClick={() => patch(b, { paid: !b.paid })} title="Toggle paid"><Badge tone={b.paid ? "paid" : "unpaid"}>{b.paid ? "Paid" : "Unpaid"}</Badge></button>
                  <select value={b.status} onChange={(e) => patch(b, { status: e.target.value as Booking["status"] })} className="cursor-pointer rounded-full bg-neutral-100 px-2.5 py-1 text-[12px] capitalize outline-none">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <a href={waLink(b.phone)} target="_blank" className="grid size-8 place-items-center rounded-full text-[#25D366] hover:bg-[#25D366]/10" aria-label="WhatsApp"><MessageCircle className="size-4" /></a>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Drawer
        open={!!sel}
        onClose={() => setSel(null)}
        title={isNew ? "New booking" : "Booking details"}
        footer={<>
          {!isNew && sel && <Button variant="danger" className="mr-auto" onClick={() => remove(sel)}><Trash2 className="size-4" /></Button>}
          <Button variant="secondary" onClick={() => setSel(null)}>Cancel</Button>
          <Button onClick={save} loading={saving}><CalendarCheck className="size-4" /> Save</Button>
        </>}
      >
        {sel && (
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2"><Label>Client name</Label><Input value={sel.name} onChange={(e) => set("name", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Phone</Label><Input value={sel.phone} onChange={(e) => set("phone", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Email</Label><Input value={sel.email} onChange={(e) => set("email", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Service</Label><Select options={Array.from(new Set([sel.service, ...services]))} value={sel.service} onChange={(e) => set("service", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Astrologer</Label><Select options={Array.from(new Set([sel.astrologer, ...astrologers, "Any available"]))} value={sel.astrologer} onChange={(e) => set("astrologer", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Mode</Label><Select options={["Call", "Video", "Chat", "In-person"]} value={sel.mode} onChange={(e) => set("mode", e.target.value as Booking["mode"])} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Amount ({currency})</Label><Input type="number" value={sel.amount} onChange={(e) => set("amount", Number(e.target.value))} /></div>
            <div className="col-span-1"><Label>Date</Label><Input type="date" value={sel.date} onChange={(e) => set("date", e.target.value)} /></div>
            <div className="col-span-1"><Label>Time</Label><Input type="time" value={sel.time} onChange={(e) => set("time", e.target.value)} /></div>
            <div className="col-span-2 rounded-2xl bg-neutral-50 p-4">
              <div className="mb-3 text-[13px] font-medium text-neutral-700">Birth details</div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>DOB</Label><Input type="date" value={sel.dob} onChange={(e) => set("dob", e.target.value)} /></div>
                <div><Label>Time of birth</Label><Input type="time" value={sel.tob} onChange={(e) => set("tob", e.target.value)} /></div>
                <div className="col-span-2"><Label>Place of birth</Label><Input value={sel.pob} onChange={(e) => set("pob", e.target.value)} /></div>
              </div>
            </div>
            <div className="col-span-2"><Label>Message / concern</Label><Textarea value={sel.message} onChange={(e) => set("message", e.target.value)} /></div>
            <div className="col-span-2 sm:col-span-1"><Label>Status</Label><Select options={STATUSES} value={sel.status} onChange={(e) => set("status", e.target.value as Booking["status"])} /></div>
            <div className="col-span-2 flex items-end sm:col-span-1"><Toggle checked={sel.paid} onChange={(v) => set("paid", v)} label="Payment received" /></div>
            {!isNew && <p className="col-span-2 text-[12px] text-neutral-400">Booked {shortDate(sel.createdAt)}</p>}
          </div>
        )}
      </Drawer>
    </>
  );
}
