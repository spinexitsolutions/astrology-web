"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { birthChart, gunMilan, NAKSHATRAS, RASHIS, toUTC, type Koota } from "@/lib/astro";
import { cn } from "@/lib/utils";
import BirthFields, { emptyBirth, type BirthInput } from "./BirthForm";

type Result = { total: number; verdict: string; kootas: Koota[]; boy: { rashi: number; nak: number; manglik: boolean }; girl: { rashi: number; nak: number; manglik: boolean } };

export default function MatchingTool() {
  const [boy, setBoy] = useState<BirthInput>({ ...emptyBirth(""), date: "1993-03-12", time: "07:20" });
  const [girl, setGirl] = useState<BirthInput>({ ...emptyBirth(""), date: "1995-11-02", time: "18:45", place: "Mumbai, India", lat: 19.076, lon: 72.8777 });
  const [res, setRes] = useState<Result | null>(null);

  function run(e: React.FormEvent) {
    e.preventDefault();
    const b = birthChart(toUTC(boy.date, boy.time, boy.tz), boy.lat, boy.lon);
    const g = birthChart(toUTC(girl.date, girl.time, girl.tz), girl.lat, girl.lon);
    const m = gunMilan({ rashi: b.moonRashi, nak: b.moonNakshatra }, { rashi: g.moonRashi, nak: g.moonNakshatra });
    setRes({ ...m, boy: { rashi: b.moonRashi, nak: b.moonNakshatra, manglik: b.manglik.isManglik }, girl: { rashi: g.moonRashi, nak: g.moonNakshatra, manglik: g.manglik.isManglik } });
    setTimeout(() => document.getElementById("match-result")?.scrollIntoView({ behavior: "smooth" }), 60);
  }

  const C = 2 * Math.PI * 90;

  return (
    <div>
      <form onSubmit={run} className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-6"><BirthFields value={boy} onChange={setBoy} label="Groom / Partner 1" /></div>
        <div className="flex justify-center">
          <button className="group relative grid h-28 w-28 place-items-center rounded-full bg-accent text-ink transition hover:scale-105" aria-label="Match kundlis">
            <span className="absolute inset-0 animate-ping rounded-full bg-accent/30" />
            <span className="relative flex flex-col items-center text-sm font-medium"><Heart className="mb-1 fill-ink" size={22} />Match</span>
          </button>
        </div>
        <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-6"><BirthFields value={girl} onChange={setGirl} label="Bride / Partner 2" /></div>
      </form>

      <AnimatePresence>
        {res && (
          <motion.div id="match-result" key={res.total + res.kootas.map((k) => k.score).join()} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} className="mt-16 scroll-mt-28 grid gap-8 lg:grid-cols-[380px_1fr]">
            <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-8 text-center">
              <div className="relative mx-auto grid w-fit place-items-center">
                <svg viewBox="0 0 200 200" className="h-56 w-56 -rotate-90">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(243,238,229,.08)" strokeWidth="10" />
                  <motion.circle cx="100" cy="100" r="90" fill="none" stroke="var(--accent)" strokeWidth="10" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} animate={{ strokeDashoffset: C * (1 - res.total / 36) }} transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }} />
                </svg>
                <div className="absolute">
                  <p className="display text-7xl">{res.total}</p>
                  <p className="font-mono text-xs text-mist">OUT OF 36</p>
                </div>
              </div>
              <p className="display mt-6 text-2xl">{res.verdict}</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-left text-sm">
                {[["Partner 1", boy.name, res.boy], ["Partner 2", girl.name, res.girl]].map(([l, n, x]) => {
                  const p = x as Result["boy"];
                  return (
                    <div key={l as string} className="rounded-2xl border border-paper/10 p-3">
                      <p className="text-xs text-mist">{(n as string) || (l as string)}</p>
                      <p className="mt-1">{RASHIS[p.rashi]}</p>
                      <p className="text-paper/60">{NAKSHATRAS[p.nak]}</p>
                      <p className={cn("mt-1 text-xs", p.manglik ? "text-red-300" : "text-emerald-300")}>{p.manglik ? "Manglik" : "Non-Manglik"}</p>
                    </div>
                  );
                })}
              </div>
              {res.boy.manglik !== res.girl.manglik && <p className="mt-4 text-xs text-red-300/80">Manglik mismatch — remedies or cancellation checks recommended.</p>}
            </div>
            <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-6">
              <p className="eyebrow mb-4">Ashtakoota breakdown</p>
              <div className="divide-y divide-paper/5">
                {res.kootas.map((k, i) => (
                  <div key={k.name} className="grid grid-cols-[1fr_auto] items-center gap-x-6 gap-y-2 py-4 md:grid-cols-[180px_1fr_auto]">
                    <div>
                      <p className="text-paper">{k.name}</p>
                      <p className="text-xs text-mist">{k.meaning}</p>
                    </div>
                    <div className="col-span-2 row-start-2 md:col-span-1 md:row-start-auto">
                      <div className="h-1.5 overflow-hidden rounded-full bg-paper/10">
                        <motion.div className={cn("h-full rounded-full", k.score === 0 ? "bg-red-400" : "bg-accent")} initial={{ width: 0 }} animate={{ width: `${(k.score / k.max) * 100}%` }} transition={{ delay: 0.3 + i * 0.08, duration: 1 }} />
                      </div>
                      <p className="mt-1.5 text-xs text-paper/50">{k.boy} × {k.girl}</p>
                    </div>
                    <p className="font-mono text-sm"><span className="text-paper">{k.score}</span><span className="text-mist">/{k.max}</span></p>
                  </div>
                ))}
              </div>
              <Link href={`/book?service=${encodeURIComponent("Love & Marriage")}`} className="btn btn-primary mt-6">Get a detailed matching consultation <ArrowUpRight size={16} /></Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
