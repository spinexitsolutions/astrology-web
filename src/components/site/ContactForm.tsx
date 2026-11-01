"use client";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { useState } from "react";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", email: "", subject: "General", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const r = await fetch("/api/public/inquiry", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...f, source: "Contact form" }) });
    if (r.ok) setState("done");
    else {
      setErr((await r.json()).error || "Please try again");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid place-items-center rounded-[32px] border border-accent/30 bg-ink-2 p-12 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-ink"><Check size={28} /></div>
        <p className="display mt-6 text-4xl">Message received.</p>
        <p className="mt-2 text-paper/60">We&apos;ll get back to you very soon. 🙏</p>
      </motion.div>
    );

  return (
    <form onSubmit={submit} className="grid gap-3 rounded-[32px] border border-paper/10 bg-ink-2 p-6 sm:grid-cols-2 md:p-8">
      <input required className="field" placeholder="Your name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="Name" />
      <input className="field" placeholder="Phone" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} aria-label="Phone" />
      <input className="field sm:col-span-2" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label="Email" />
      <select className="field sm:col-span-2" value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })} aria-label="Subject">
        {["General", "Consultation", "Order support", "Corporate Vastu", "Partnership", "Careers"].map((x) => <option key={x}>{x}</option>)}
      </select>
      <textarea required className="field min-h-40 sm:col-span-2" placeholder="How can we help?" value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })} aria-label="Message" />
      {state === "error" && <p className="text-sm text-red-300 sm:col-span-2">{err}</p>}
      <button disabled={state === "loading"} className="btn btn-accent sm:col-span-2">{state === "loading" ? "Sending…" : "Send message"} <ArrowUpRight size={16} /></button>
    </form>
  );
}
