"use client";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { SIGNS } from "@/lib/zodiac";
import { Reveal } from "../Reveal";

function Spot({ href, className, children, title, desc, tag }: { href: string; className?: string; children: React.ReactNode; title: string; desc: string; tag: string }) {
  return (
    <Link
      href={href}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
        e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
      }}
      className={cn(
        "group relative flex min-h-[300px] flex-col overflow-hidden rounded-[28px] border border-paper/10 bg-ink-2 p-6 transition-[border-color,transform] duration-700 hover:border-paper/25 md:p-8",
        className
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: "radial-gradient(420px circle at var(--mx) var(--my), color-mix(in oklab, var(--accent) 16%, transparent), transparent 60%)" }} />
      <div className="relative flex items-center justify-between">
        <span className="rounded-full border border-paper/15 px-3 py-1 font-medium text-[10px] text-mist">{tag}</span>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-paper/15 transition duration-500 group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink">
          <ArrowUpRight size={18} />
        </span>
      </div>
      <div className="relative flex flex-1 items-center justify-center py-6">{children}</div>
      <div className="relative">
        <h3 className="display text-4xl">{title}</h3>
        <p className="mt-2 max-w-sm text-paper/60">{desc}</p>
      </div>
    </Link>
  );
}

function MiniChart() {
  const lines = ["M10 10 L190 190", "M190 10 L10 190", "M100 10 L190 100 L100 190 L10 100 Z"];
  const planets = [["Su", 100, 52], ["Mo", 52, 30], ["Ju", 148, 100], ["Ve", 100, 150], ["Sa", 30, 100], ["Ma", 152, 170]];
  return (
    <svg viewBox="0 0 200 200" className="h-52 w-52 md:h-72 md:w-72">
      <motion.rect x="10" y="10" width="180" height="180" fill="none" stroke="var(--accent)" strokeWidth="1" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
      {lines.map((d, i) => (
        <motion.path key={d} d={d} fill="none" stroke="rgba(243,238,229,.45)" strokeWidth="0.8" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.4, delay: 0.3 + i * 0.25 }} />
      ))}
      {planets.map(([t, x, y], i) => (
        <motion.text key={t as string} x={x as number} y={y as number} textAnchor="middle" fontSize="11" fill={i === 0 ? "var(--accent)" : "#f3eee5"} fontFamily="var(--font-sans)" initial={{ opacity: 0, y: (y as number) + 6 }} whileInView={{ opacity: 1, y: y as number }} viewport={{ once: true }} transition={{ delay: 1.2 + i * 0.12 }}>
          {t}
        </motion.text>
      ))}
    </svg>
  );
}

function ScoreRing({ score = 28 }: { score?: number }) {
  const C = 2 * Math.PI * 52;
  return (
    <div className="relative grid place-items-center">
      <svg viewBox="0 0 120 120" className="h-40 w-40 -rotate-90">
        <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(243,238,229,.1)" strokeWidth="6" />
        <motion.circle cx="60" cy="60" r="52" fill="none" stroke="var(--accent)" strokeWidth="6" strokeLinecap="round" strokeDasharray={C} initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - score / 36) }} viewport={{ once: true }} transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }} />
      </svg>
      <div className="absolute text-center">
        <p className="display text-5xl">{score}<span className="text-xl text-paper/40">/36</span></p>
        <p className="font-medium text-[10px] text-mist">Gunas</p>
      </div>
    </div>
  );
}

function TarotFan() {
  return (
    <div className="relative h-44 w-56">
      {[-14, 0, 14].map((r, i) => (
        <div
          key={r}
          className="absolute left-1/2 top-1/2 h-40 w-[104px] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-accent/40 bg-[linear-gradient(160deg,#1c1830,#0d0c16)] shadow-2xl transition-transform duration-700 ease-[var(--ease-out-expo)]"
          style={{ transform: `translate(-50%,-50%) rotate(${r}deg) translateX(${r * 1.2}px)`, zIndex: i === 1 ? 2 : 1 }}
        >
          <div className="absolute inset-2 grid place-items-center rounded-lg border border-accent/20 text-3xl text-accent">{["☾", "✦", "☉"][i]}</div>
        </div>
      ))}
    </div>
  );
}

export default function ToolsBento() {
  return (
    <section className="container-x py-24 md:py-36">
      <Reveal className="mb-12 max-w-3xl">
        <p className="eyebrow mb-4">Free tools · Computed live</p>
        <h2 className="display display-xl text-[clamp(44px,7vw,104px)]">The sky, <em className="text-gold">on demand.</em></h2>
        <p className="mt-5 max-w-xl text-paper/60">Real astronomical calculations — Lahiri ayanamsa, true planetary positions — running right in your browser. No sign-up. No paywall.</p>
      </Reveal>
      <div className="grid gap-4 md:grid-cols-6 lg:grid-cols-12">
        <Reveal className="md:col-span-6 lg:col-span-7 lg:row-span-2">
          <Spot href="/kundli" tag="Most loved" title="Free Kundli" desc="North-Indian birth chart, planets, nakshatras, Manglik check and your Vimshottari dasha timeline." className="h-full lg:min-h-[640px]">
            <MiniChart />
          </Spot>
        </Reveal>
        <Reveal className="md:col-span-3 lg:col-span-5" delay={0.08}>
          <Spot href="/matching" tag="Marriage" title="Kundli Matching" desc="Ashtakoota 36-guna milan with all eight kootas explained.">
            <ScoreRing />
          </Spot>
        </Reveal>
        <Reveal className="md:col-span-3 lg:col-span-5" delay={0.12}>
          <Spot href="/tarot" tag="Interactive" title="Tarot Pull" desc="Shuffle the deck, draw three cards — past, present, future.">
            <TarotFan />
          </Spot>
        </Reveal>
        <Reveal className="md:col-span-2 lg:col-span-4" delay={0.05}>
          <Spot href="/numerology" tag="Numbers" title="Numerology" desc="Life path, destiny & soul urge.">
            <p className="display text-[120px] leading-none text-gold">7</p>
          </Spot>
        </Reveal>
        <Reveal className="md:col-span-2 lg:col-span-4" delay={0.1}>
          <Spot href="/horoscope" tag="Updated daily" title="Horoscope" desc="Daily, weekly & monthly readings.">
            <div className="grid grid-cols-6 gap-2 text-xl text-paper/50">
              {SIGNS.map((s, i) => (
                <motion.span key={s.slug} className="grid h-9 w-9 place-items-center rounded-full border border-paper/10" initial={{ opacity: 0, scale: 0.5 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  {s.glyph}&#xFE0E;
                </motion.span>
              ))}
            </div>
          </Spot>
        </Reveal>
        <Reveal className="md:col-span-2 lg:col-span-4" delay={0.15}>
          <Spot href="/panchang" tag="Daily" title="Panchang" desc="Tithi, nakshatra, Rahu Kaal & muhurat.">
            <div className="relative h-28 w-28 rounded-full bg-[radial-gradient(circle_at_35%_35%,#fffaf0,#cfc4aa_60%,#8f866f)] shadow-[0_0_80px_rgba(255,240,200,.25)]">
              <div className="absolute inset-0 translate-x-6 rounded-full bg-ink-2 transition-transform duration-1000 group-hover:translate-x-16" />
            </div>
          </Spot>
        </Reveal>
      </div>
    </section>
  );
}
