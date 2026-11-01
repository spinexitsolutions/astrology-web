"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, MessageCircle, Phone, Video, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PLACES } from "@/lib/astro";
import { cn, money } from "@/lib/utils";

type S = { title: string; price: number; duration: string };
type A = { name: string; title: string; image: string; online: boolean };

const MODES = [
  { k: "Video", I: Video },
  { k: "Call", I: Phone },
  { k: "Chat", I: MessageCircle },
  { k: "In-person", I: Users },
] as const;
const TIMES = ["09:00", "10:30", "12:00", "14:00", "15:30", "17:00", "18:30", "20:00"];

export default function BookingForm({ services, astrologers, currency }: { services: S[]; astrologers: A[]; currency: string }) {
  const q = useSearchParams();
  const [step, setStep] = useState(0);
  const [days, setDays] = useState<{ iso: string; d: Date }[]>([]);
  const [f, setF] = useState({
    service: q.get("service") || services[0]?.title || "",
    astrologer: q.get("astrologer") || "Any available",
    mode: "Video",
    date: "",
    time: "",
    name: q.get("name") || "",
    phone: "",
    email: "",
    dob: q.get("dob") || "",
    tob: q.get("tob") || "",
    pob: q.get("pob") || PLACES[0].name,
    message: "",
  });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");
  const set = (p: Partial<typeof f>) => setF((x) => ({ ...x, ...p }));

  useEffect(() => {
    const out = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() + i + 1);
      return { iso: d.toISOString().slice(0, 10), d };
    });
    setDays(out);
    setF((x) => ({ ...x, date: x.date || out[0].iso }));
  }, []);

  const svc = services.find((s) => s.title === f.service);
  const steps = ["Service", "Astrologer", "Time", "Details"];
  const can = [!!f.service, !!f.astrologer, !!f.date && !!f.time, !!f.name && !!f.phone];

  async function submit() {
    setState("loading");
    const r = await fetch("/api/public/booking", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(f) });
    if (r.ok) setState("done");
    else {
      setErr((await r.json()).error || "Please try again");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-xl rounded-[32px] border border-accent/30 bg-ink-2 p-10 text-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-accent text-ink"><Check size={36} /></motion.div>
        <p className="display mt-6 text-5xl">Booked, {f.name.split(" ")[0]}.</p>
        <p className="mt-3 text-paper/65">{f.service} with {f.astrologer} on {new Date(f.date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} at {f.time}. We&apos;ll confirm on WhatsApp shortly.</p>
        <Link href="/" className="btn btn-ghost mt-8">Back to home</Link>
      </motion.div>
    );

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <div>
        <div className="mb-8 flex gap-2">
          {steps.map((s, i) => (
            <button key={s} onClick={() => i <= step && setStep(i)} className="flex-1 text-left">
              <div className="h-1 overflow-hidden rounded-full bg-paper/10"><motion.div className="h-full bg-accent" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.6 }} /></div>
              <p className={cn("mt-2 text-xs", i === step ? "text-paper" : "text-mist")}>{String(i + 1).padStart(2, "0")} · {s}</p>
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}>
            {step === 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {services.map((s) => (
                  <button key={s.title} onClick={() => set({ service: s.title })} className={cn("rounded-3xl border p-5 text-left transition", f.service === s.title ? "border-accent bg-accent/[0.06]" : "border-paper/10 hover:border-paper/30")}>
                    <p className="display text-2xl">{s.title}</p>
                    <p className="mt-2 text-sm text-mist">{s.duration} · {money(s.price, currency)}</p>
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <button onClick={() => set({ astrologer: "Any available" })} className={cn("flex items-center gap-4 rounded-3xl border p-4 text-left transition", f.astrologer === "Any available" ? "border-accent bg-accent/[0.06]" : "border-paper/10 hover:border-paper/30")}>
                  <span className="grid h-14 w-14 place-items-center rounded-full bg-paper/10 text-2xl text-accent">✦</span>
                  <span><span className="display block text-2xl">Any available</span><span className="text-sm text-mist">Fastest slot</span></span>
                </button>
                {astrologers.map((a) => (
                  <button key={a.name} onClick={() => set({ astrologer: a.name })} className={cn("flex items-center gap-4 rounded-3xl border p-4 text-left transition", f.astrologer === a.name ? "border-accent bg-accent/[0.06]" : "border-paper/10 hover:border-paper/30")}>
                    <Image src={a.image} alt="" width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                    <span className="min-w-0"><span className="display block truncate text-2xl">{a.name}</span><span className="text-sm text-mist">{a.title}{a.online && <span className="ml-2 text-emerald-300">● online</span>}</span></span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div>
                <p className="eyebrow mb-3">Mode</p>
                <div className="mb-8 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {MODES.map(({ k, I }) => (
                    <button key={k} onClick={() => set({ mode: k })} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition", f.mode === k ? "border-accent bg-accent/[0.06] text-paper" : "border-paper/10 text-paper/70 hover:border-paper/30")}>
                      <I size={20} /> {k}
                    </button>
                  ))}
                </div>
                <p className="eyebrow mb-3">Date</p>
                <div className="no-scrollbar -mx-1 mb-8 flex gap-2 overflow-x-auto px-1 pb-1" data-lenis-prevent>
                  {days.map(({ iso, d }) => (
                    <button key={iso} onClick={() => set({ date: iso })} className={cn("flex w-16 shrink-0 flex-col items-center rounded-2xl border py-3 transition", f.date === iso ? "border-accent bg-accent text-ink" : "border-paper/10 hover:border-paper/30")}>
                      <span className="text-[11px] uppercase opacity-70">{d.toLocaleDateString("en-IN", { weekday: "short" })}</span>
                      <span className="display text-2xl">{d.getDate()}</span>
                      <span className="text-[10px] opacity-60">{d.toLocaleDateString("en-IN", { month: "short" })}</span>
                    </button>
                  ))}
                </div>
                <p className="eyebrow mb-3">Time (IST)</p>
                <div className="grid grid-cols-4 gap-2">
                  {TIMES.map((t) => (
                    <button key={t} onClick={() => set({ time: t })} className={cn("rounded-full border py-2.5 text-sm transition", f.time === t ? "border-accent bg-accent text-ink" : "border-paper/10 hover:border-paper/30")}>{t}</button>
                  ))}
                </div>
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-3 sm:grid-cols-2">
                <input className="field" placeholder="Full name *" value={f.name} onChange={(e) => set({ name: e.target.value })} aria-label="Full name" />
                <input className="field" placeholder="WhatsApp number *" value={f.phone} onChange={(e) => set({ phone: e.target.value })} aria-label="Phone" />
                <input className="field sm:col-span-2" type="email" placeholder="Email" value={f.email} onChange={(e) => set({ email: e.target.value })} aria-label="Email" />
                <label className="grid gap-1.5 text-xs text-mist">Date of birth<input type="date" className="field" value={f.dob} onChange={(e) => set({ dob: e.target.value })} /></label>
                <label className="grid gap-1.5 text-xs text-mist">Time of birth<input type="time" className="field" value={f.tob} onChange={(e) => set({ tob: e.target.value })} /></label>
                <label className="grid gap-1.5 text-xs text-mist sm:col-span-2">Place of birth
                  <select className="field" value={f.pob} onChange={(e) => set({ pob: e.target.value })}>{PLACES.map((p) => <option key={p.name}>{p.name}</option>)}</select>
                </label>
                <textarea className="field min-h-28 sm:col-span-2" placeholder="What would you like to ask?" value={f.message} onChange={(e) => set({ message: e.target.value })} aria-label="Message" />
                {state === "error" && <p className="text-sm text-red-300 sm:col-span-2">{err}</p>}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-10 flex justify-between">
          <button onClick={() => setStep((s) => Math.max(0, s - 1))} className={cn("btn btn-ghost", step === 0 && "invisible")}><ArrowLeft size={16} /> Back</button>
          {step < 3 ? (
            <button disabled={!can[step]} onClick={() => setStep((s) => s + 1)} className="btn btn-primary disabled:opacity-40">Continue <ArrowRight size={16} /></button>
          ) : (
            <button disabled={!can[3] || state === "loading"} onClick={submit} className="btn btn-accent disabled:opacity-40">{state === "loading" ? "Booking…" : "Confirm booking"} <Check size={16} /></button>
          )}
        </div>
      </div>

      <aside className="h-fit rounded-[28px] border border-paper/10 bg-ink-2 p-6 lg:sticky lg:top-28">
        <p className="eyebrow mb-5">Summary</p>
        <dl className="space-y-4 text-sm">
          {[["Service", f.service], ["Astrologer", f.astrologer], ["Mode", f.mode], ["When", f.date && f.time ? `${new Date(f.date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })} · ${f.time}` : "—"]].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 border-b border-paper/5 pb-3"><dt className="text-mist">{k}</dt><dd className="text-right">{v}</dd></div>
          ))}
        </dl>
        <div className="mt-6 flex items-baseline justify-between">
          <span className="text-mist">Total</span>
          <span className="display text-4xl">{money(svc?.price ?? 0, currency)}</span>
        </div>
        <p className="mt-4 text-xs text-mist">Pay after confirmation via UPI / card. Free reschedule up to 4 hours before.</p>
      </aside>
    </div>
  );
}
