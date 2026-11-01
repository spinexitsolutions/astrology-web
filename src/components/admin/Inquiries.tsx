"use client";

import { Mail, MessageCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import type { Inquiry, LeadStatus, Subscriber } from "@/lib/types";
import { cn, shortDate, timeAgo } from "@/lib/utils";
import { Avatar, waLink } from "./Customers";
import { api, Badge, Button, Card, Empty, PageHeader, Segmented, useToast } from "./ui";

const STAGES: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export function Inquiries({ initial }: { initial: Inquiry[] }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [status, setStatus] = useState<"all" | LeadStatus>("all");
  const [open, setOpen] = useState<string | null>(initial[0]?.id ?? null);
  const filtered = rows.filter((r) => status === "all" || r.status === status);

  const setSt = async (i: Inquiry, s: LeadStatus) => {
    setRows((r) => r.map((x) => (x.id === i.id ? { ...x, status: s } : x)));
    await api(`/api/admin/collections/inquiries/${i.id}`, "PUT", { status: s });
    toast(`Marked ${s}`);
  };
  const remove = async (i: Inquiry) => {
    if (!confirm("Delete inquiry?")) return;
    await api(`/api/admin/collections/inquiries/${i.id}`, "DELETE");
    setRows((r) => r.filter((x) => x.id !== i.id));
    toast("Deleted");
  };

  return (
    <>
      <PageHeader eyebrow="CRM" title="Inquiries" subtitle="Messages from the contact form, WhatsApp and campaigns." />
      <div className="mb-4">
        <Segmented value={status} onChange={setStatus} options={[{ value: "all", label: "All", count: rows.length }, ...STAGES.map((s) => ({ value: s, label: s, count: rows.filter((r) => r.status === s).length }))]} />
      </div>
      {filtered.length === 0 ? <Empty text="Inbox zero ✨" /> : (
        <div className="space-y-2.5">
          {filtered.map((i) => {
            const isOpen = open === i.id;
            const reply = `Namaste ${i.name.split(" ")[0]}, thank you for reaching out about "${i.subject}". `;
            return (
              <Card key={i.id} className={cn("overflow-hidden transition", isOpen && "shadow-lg")}>
                <button onClick={() => setOpen(isOpen ? null : i.id)} className="flex w-full items-center gap-3 p-4 text-left">
                  <Avatar name={i.name} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate font-medium">{i.name}</span>
                      {i.status === "new" && <span className="size-2 rounded-full bg-sky-500" />}
                    </div>
                    <div className="truncate text-[13px] text-neutral-500"><b className="font-medium text-neutral-700">{i.subject}</b> — {i.message}</div>
                  </div>
                  <div className="hidden shrink-0 text-right sm:block">
                    <Badge tone={i.status} />
                    <div className="mt-1 text-[11px] text-neutral-400">{timeAgo(i.createdAt)}</div>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-black/[0.05] bg-neutral-50/60 p-4 sm:px-6">
                    <p className="whitespace-pre-line text-sm leading-relaxed text-neutral-700">{i.message}</p>
                    <div className="mt-3 text-[12px] text-neutral-400">{i.phone} · {i.email} · via {i.source} · {shortDate(i.createdAt)}</div>
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      {i.phone && <a href={`${waLink(i.phone)}?text=${encodeURIComponent(reply)}`} target="_blank" onClick={() => i.status === "new" && setSt(i, "contacted")} className="inline-flex h-9 items-center gap-2 rounded-full bg-[#25D366] px-4 text-[13px] font-medium text-white"><MessageCircle className="size-4" /> Reply on WhatsApp</a>}
                      {i.email && <a href={`mailto:${i.email}?subject=${encodeURIComponent("Re: " + i.subject)}&body=${encodeURIComponent(reply)}`} onClick={() => i.status === "new" && setSt(i, "contacted")} className="inline-flex h-9 items-center gap-2 rounded-full bg-white px-4 text-[13px] font-medium ring-1 ring-black/10"><Mail className="size-4" /> Email</a>}
                      <select value={i.status} onChange={(e) => setSt(i, e.target.value as LeadStatus)} className="h-9 cursor-pointer rounded-full bg-white px-3 text-[13px] capitalize outline-none ring-1 ring-black/10">
                        {STAGES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <Button variant="ghost" size="sm" className="ml-auto text-red-500" onClick={() => remove(i)}><Trash2 className="size-4" /></Button>
                    </div>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </>
  );
}

export function Subscribers({ initial }: { initial: Subscriber[] }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const exportCsv = () => {
    const csv = ["email,sign,subscribed_at", ...rows.map((r) => `${r.email},${r.sign},${r.createdAt}`)].join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };
  const remove = async (s: Subscriber) => {
    if (!confirm(`Remove ${s.email}?`)) return;
    await api(`/api/admin/collections/subscribers/${s.id}`, "DELETE");
    setRows((r) => r.filter((x) => x.id !== s.id));
    toast("Subscriber removed");
  };
  return (
    <>
      <PageHeader eyebrow="CRM" title="Subscribers" subtitle={`${rows.length} people receive your daily horoscope.`} actions={<Button variant="secondary" onClick={exportCsv}>Export CSV</Button>} />
      {rows.length === 0 ? <Empty text="No subscribers yet." /> : (
        <Card className="divide-y divide-black/[0.05]">
          {rows.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <Avatar name={s.email} small />
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium">{s.email}</div>
                <div className="text-[12px] capitalize text-neutral-400">{s.sign || "No sign"} · {shortDate(s.createdAt)}</div>
              </div>
              <button onClick={() => remove(s)} className="grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove"><Trash2 className="size-4" /></button>
            </div>
          ))}
        </Card>
      )}
    </>
  );
}
