"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { panchang, RASHIS, type Panchang } from "@/lib/astro";
import { Reveal } from "../Reveal";

export function MoonPhase({ phase, size = 64 }: { phase: number; size?: number }) {
  // phase 0 = new, .5 = full
  const r = size / 2;
  const k = Math.cos(phase * 2 * Math.PI); // 1 → new, -1 → full
  const waxing = phase < 0.5;
  const rx = Math.abs(k) * r;
  const sweepOuter = waxing ? 1 : 0;
  const lit = `M ${r} 0 A ${r} ${r} 0 0 ${sweepOuter} ${r} ${size} A ${rx} ${r} 0 0 ${k > 0 ? 1 - sweepOuter : sweepOuter} ${r} 0`;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden>
      <defs>
        <radialGradient id="moonlit" cx="40%" cy="35%">
          <stop offset="0%" stopColor="#fffaf0" />
          <stop offset="100%" stopColor="#d9cfb8" />
        </radialGradient>
      </defs>
      <circle cx={r} cy={r} r={r} fill="#1b1b26" />
      <path d={lit} fill="url(#moonlit)" />
    </svg>
  );
}

export default function PanchangStrip() {
  const [p, setP] = useState<Panchang | null>(null);
  useEffect(() => setP(panchang(new Date())), []);

  const items = p
    ? [
        { k: "Tithi", v: `${p.tithi.paksha} ${p.tithi.name}`, s: `${Math.round(p.tithi.percent)}% elapsed` },
        { k: "Nakshatra", v: p.nakshatra.name, s: `Moon in ${RASHIS[p.moonRashi]}` },
        { k: "Yoga", v: p.yoga, s: `Karana · ${p.karana}` },
        { k: "Sunrise · Sunset", v: `${p.sunrise}`, s: p.sunset },
        { k: "Rahu Kaal", v: p.rahuKaal.split(" – ")[0], s: `until ${p.rahuKaal.split(" – ")[1]}` },
        { k: "Abhijit Muhurat", v: p.abhijit.split(" – ")[0], s: `until ${p.abhijit.split(" – ")[1]}` },
      ]
    : [];

  return (
    <section className="container-x py-20 md:py-28">
      <Reveal className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div className="flex items-center gap-5">
          {p ? <MoonPhase phase={p.moonPhase} size={72} /> : <div className="h-[72px] w-[72px] rounded-full bg-ink-3" />}
          <div>
            <p className="eyebrow">Today&apos;s Panchang · New Delhi</p>
            <h2 className="display mt-2 text-4xl md:text-6xl">{p ? p.vara : "…"}<span className="text-paper/40">, {p ? p.date.toLocaleDateString("en-IN", { day: "numeric", month: "long" }) : ""}</span></h2>
          </div>
        </div>
        <Link href="/panchang" className="group inline-flex items-center gap-2 text-paper/70 hover:text-paper">
          Full panchang & muhurat <ArrowUpRight size={16} className="transition group-hover:rotate-45" />
        </Link>
      </Reveal>
      <div className="no-scrollbar -mx-5 flex snap-x gap-3 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:px-0 lg:grid-cols-6">
        {(p ? items : Array.from({ length: 6 }).map((_, i) => ({ k: String(i), v: "", s: "" }))).map((it, i) => (
          <Reveal key={it.k} delay={i * 0.06} className="min-w-[70%] snap-start sm:min-w-[45%] md:min-w-0">
            <div className="group h-full rounded-3xl border border-paper/10 bg-ink-2 p-5 transition duration-500 hover:-translate-y-1 hover:border-accent/40">
              <p className="eyebrow">{p ? it.k : " "}</p>
              <p className="display mt-6 text-[28px] leading-tight">{it.v || " "}</p>
              <p className="mt-1 text-sm text-mist">{it.s || " "}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
