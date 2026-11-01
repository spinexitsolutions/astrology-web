"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SIGNS, type Sign } from "@/lib/zodiac";

function Card({ s, i }: { s: Sign; i: number }) {
  return (
    <Link
      href={`/horoscope/${s.slug}`}
      className="group relative flex h-[62svh] max-h-[560px] min-h-[420px] w-[78vw] shrink-0 snap-center flex-col overflow-hidden rounded-[32px] border border-paper/10 p-6 sm:w-[360px] md:w-[400px] md:p-8"
      style={{ background: `radial-gradient(120% 80% at 80% 0%, hsl(${s.hue} 70% 55% / .28), transparent 60%), linear-gradient(180deg, #11111a, #0a0a10)` }}
    >
      <div className="flex items-start justify-between">
        <span className="font-mono text-[11px] text-mist">{String(i + 1).padStart(2, "0")} / 12</span>
        <span className="rounded-full border border-paper/15 px-3 py-1 text-[11px] uppercase tracking-widest text-paper/70">{s.element}</span>
      </div>
      <div className="relative my-auto grid place-items-center">
        <span
          className="select-none text-[150px] leading-none transition-transform duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:-rotate-12 group-hover:scale-110 md:text-[180px]"
          style={{ color: `hsl(${s.hue} 80% 75%)`, textShadow: `0 0 60px hsl(${s.hue} 80% 60% / .5)` }}
        >
          {s.glyph}&#xFE0E;
        </span>
        <span className="font-deva absolute -bottom-2 text-2xl text-paper/30">{s.hindi}</span>
      </div>
      <div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <h3 className="display text-5xl">{s.name}</h3>
            <p className="mt-1 text-sm text-mist">{s.dates} · {s.vedic}</p>
          </div>
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-paper text-ink transition duration-500 group-hover:rotate-45 group-hover:bg-accent">
            <ArrowUpRight size={20} />
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-1.5">
          {s.traits.map((t) => (
            <span key={t} className="rounded-full bg-paper/[0.06] px-3 py-1 text-xs text-paper/75">{t}</span>
          ))}
          <span className="rounded-full bg-paper/[0.06] px-3 py-1 text-xs text-paper/75">Ruled by {s.ruler}</span>
        </div>
      </div>
    </Link>
  );
}

export default function ZodiacScroller() {
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const bar = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  useEffect(() => {
    const m = () => track.current && setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 80));
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const Head = (
    <div className="container-x mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="eyebrow mb-4">The twelve rashis</p>
        <h2 className="display text-[clamp(44px,7vw,104px)]">Find your <em className="text-gold">sign.</em></h2>
      </div>
      <p className="max-w-sm text-paper/60">Each sign is a doorway — tap yours for today&apos;s horoscope, lucky colour, and who you click with.</p>
    </div>
  );

  return (
    <>
      {/* Mobile: native snap carousel */}
      <section className="py-20 md:hidden">
        {Head}
        <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4">
          {SIGNS.map((s, i) => <Card key={s.slug} s={s} i={i} />)}
        </div>
      </section>

      {/* Desktop: pinned horizontal scroll */}
      <section ref={ref} className="relative hidden md:block" style={{ height: `calc(100vh + ${dist}px)` }}>
        <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
          {Head}
          <motion.div ref={track} style={{ x }} className="flex gap-5 pl-10 will-change-transform lg:pl-[max(40px,calc((100vw-1320px)/2+40px))]">
            {SIGNS.map((s, i) => <Card key={s.slug} s={s} i={i} />)}
          </motion.div>
          <div className="container-x mt-10">
            <div className="h-px w-full bg-paper/10">
              <motion.div style={{ width: bar }} className="h-px bg-accent" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
