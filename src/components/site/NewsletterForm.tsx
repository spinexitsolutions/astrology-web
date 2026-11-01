"use client";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";
import { SIGNS } from "@/lib/zodiac";

export default function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [sign, setSign] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const r = await fetch("/api/public/subscribe", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, sign }) });
    if (r.ok) setState("done");
    else {
      setErr((await r.json()).error || "Something went wrong");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <p className="flex items-center gap-2 text-accent">
        <Check size={18} /> You&apos;re on the list. See you under the stars.
      </p>
    );

  return (
    <form onSubmit={submit} className={compact ? "space-y-2" : "flex flex-col gap-3 sm:flex-row"}>
      {!compact && (
        <select value={sign} onChange={(e) => setSign(e.target.value)} className="field sm:max-w-[180px]" aria-label="Your sign">
          <option value="">Your sign</option>
          {SIGNS.map((s) => <option key={s.slug} value={s.slug}>{s.glyph} {s.name}</option>)}
        </select>
      )}
      <div className="relative flex-1">
        <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className="field !rounded-full pr-14" aria-label="Email" />
        <button disabled={state === "loading"} className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-accent text-ink transition hover:scale-105 disabled:opacity-50" aria-label="Subscribe">
          <ArrowRight size={18} />
        </button>
      </div>
      {state === "error" && <p className="text-sm text-red-300">{err}</p>}
    </form>
  );
}
