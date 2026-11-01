"use client";
import { motion, useMotionTemplate, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { panchang, RASHIS } from "@/lib/astro";
import type { HeroSettings } from "@/lib/types";
import Starfield from "../Starfield";
import Orrery from "./Orrery";

const EASE = [0.16, 1, 0.3, 1] as const;

function useLiveSky() {
  const [sky, setSky] = useState<{ when: string; moon: string; tithi: string } | null>(null);
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const p = panchang(now);
      setSky({
        when: now.toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit", timeZone: "Asia/Kolkata" }),
        moon: `Moon in ${p.nakshatra.name}, ${RASHIS[p.moonRashi]}`,
        tithi: `${p.tithi.paksha} ${p.tithi.name}`,
      });
    };
    tick();
    const t = setInterval(tick, 30000);
    return () => clearInterval(t);
  }, []);
  return sky;
}

export default function Hero({ hero }: { hero: HeroSettings }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [desk, setDesk] = useState(true);
  const [dob, setDob] = useState("");
  const sky = useLiveSky();
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Phase 1 → 2: headline lifts away, orrery glides to centre and flattens into a chart wheel
  const headY = useTransform(p, [0, 0.35], ["0%", "-30%"]);
  const headOpacity = useTransform(p, [0.05, 0.3], [1, 0]);
  const headBlurPx = useTransform(p, [0.05, 0.3], [0, 14]);
  const headBlur = useMotionTemplate`blur(${headBlurPx}px)`;
  const orrLeft = useTransform(p, [0, 0.55], desk ? ["66%", "50%"] : ["50%", "50%"]);
  const orrTop = useTransform(p, [0, 0.55], desk ? ["54%", "50%"] : ["40%", "50%"]);
  const orrScale = useTransform(p, [0, 0.55, 1], desk ? [1, 0.82, 0.9] : [1, 0.82, 0.86]);
  const finalOpacity = useTransform(p, [0.52, 0.68], [0, 1]);
  const finalY = useTransform(p, [0.52, 0.7], [40, 0]);
  const finalEvents = useTransform(p, (v) => (v > 0.55 ? "auto" : "none"));
  const glowShift = useTransform(p, [0, 1], ["0%", "-20%"]);

  useEffect(() => {
    const m = () => setDesk(window.innerWidth >= 1024);
    m();
    window.addEventListener("resize", m);
    if (document.documentElement.classList.contains("intro-seen") || !document.querySelector(".intro-overlay")) setReady(true);
    const on = () => setReady(true);
    window.addEventListener("taarak:intro-done", on);
    const fallback = setTimeout(on, 6500);
    return () => {
      window.removeEventListener("resize", m);
      window.removeEventListener("taarak:intro-done", on);
      clearTimeout(fallback);
    };
  }, []);

  const line = (text: string, delay: number, gradient = false) => (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className={`block ${gradient ? "text-gold" : ""}`}
        initial={{ y: "105%" }}
        animate={ready ? { y: "0%" } : {}}
        transition={{ duration: 1.4, ease: EASE, delay }}
      >
        {text}
      </motion.span>
    </span>
  );

  return (
    <section ref={ref} className="night relative h-[250vh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Starfield density={0.00016} className="opacity-70" />
        {/* drifting colour fields */}
        <motion.div style={{ y: glowShift }} className="pointer-events-none absolute inset-0">
          <div className="absolute -left-[15%] bottom-[-30%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent)_38%,transparent),transparent_62%)] opacity-60 blur-2xl" />
          <div className="absolute -right-[20%] -top-[30%] h-[70vmax] w-[70vmax] rounded-full bg-[radial-gradient(circle,color-mix(in_oklab,var(--accent-2)_42%,transparent),transparent_62%)] opacity-70 blur-2xl" />
        </motion.div>

        {/* The live orrery */}
        <motion.div
          style={{ left: orrLeft, top: orrTop, scale: orrScale }}
          className="absolute aspect-square w-[150vw] -translate-x-1/2 -translate-y-1/2 sm:w-[110vw] lg:w-[min(78vw,1180px)]"
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ duration: 2, ease: EASE, delay: 0.2 }}
        >
          <Orrery progress={p} className="h-full w-full" />
        </motion.div>

        {/* Live meta strip */}
        <motion.div
          style={{ opacity: headOpacity }}
          className="absolute inset-x-0 top-[92px] md:top-[108px]"
        >
          <motion.div className="container-x flex flex-wrap items-center gap-2" initial={{ opacity: 0, y: -10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.6, ease: EASE }}>
            <span className="inline-flex items-center gap-2 rounded-full bg-paper/[0.07] px-3.5 py-1.5 text-[13px] font-medium backdrop-blur-md">
              <span className="relative flex h-2 w-2"><span className="absolute inset-0 animate-ping rounded-full bg-accent" /><span className="relative h-2 w-2 rounded-full bg-accent" /></span>
              Live sky · {sky?.when ?? "…"}
            </span>
            <span className="hidden rounded-full bg-paper/[0.07] px-3.5 py-1.5 text-[13px] text-paper/70 backdrop-blur-md sm:inline-flex">{sky?.moon ?? "Reading the Moon…"}</span>
            <span className="hidden rounded-full bg-paper/[0.07] px-3.5 py-1.5 text-[13px] text-paper/70 backdrop-blur-md md:inline-flex">{sky?.tithi}</span>
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div style={{ y: headY, opacity: headOpacity, filter: headBlur }} className="pointer-events-none absolute inset-x-0 bottom-0 pb-8 md:pb-12">
          <div className="container-x">
            <motion.p className="mb-5 text-[15px] font-medium text-paper/70" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 0.3, duration: 1 }}>
              {hero.eyebrow}
            </motion.p>
            <h1 className="display display-xl max-w-[11ch] text-[clamp(52px,11.2vw,188px)] leading-[0.86]">
              {line(hero.titleTop, 0.1)}
              {line(hero.titleAccent, 0.22, true)}
              {line(hero.titleBottom, 0.34)}
            </h1>
            <div className="pointer-events-auto mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <motion.p className="hidden max-w-md text-[15px] leading-relaxed text-paper/65 sm:block md:text-[17px]" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 0.7 }}>
                {hero.subtitle}
              </motion.p>
              <motion.div className="flex flex-wrap items-center gap-3" initial={{ opacity: 0, y: 16 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 0.85 }}>
                <Link href={hero.primaryCta.href} className="btn btn-accent">{hero.primaryCta.label} <ArrowUpRight size={17} /></Link>
                <Link href={hero.secondaryCta.href} className="btn btn-ghost backdrop-blur-md">{hero.secondaryCta.label}</Link>
                <span className="ml-2 hidden items-center gap-2 text-[13px] text-paper/45 lg:flex"><ArrowDown size={14} className="animate-bounce" /> Scroll</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Phase 2 — the chart wheel asks for your moment */}
        <motion.div style={{ opacity: finalOpacity, y: finalY, pointerEvents: finalEvents }} className="absolute inset-0 grid place-items-center px-5">
          <div className="max-w-[560px] rounded-[36px] bg-ink/55 p-7 text-center backdrop-blur-xl md:p-10">
            <p className="eyebrow">This was the sky a moment ago</p>
            <h2 className="display mt-3 text-[clamp(36px,5vw,64px)]">Now show us <span className="text-gold">yours.</span></h2>
            <p className="mx-auto mt-4 max-w-sm text-paper/65">Every Kundli begins with one moment — the second you arrived. Enter it and we&apos;ll map your sky.</p>
            <form
              className="mt-7 flex flex-col gap-2 rounded-[28px] bg-paper/[0.07] p-2 sm:flex-row sm:rounded-full"
              onSubmit={(e) => {
                e.preventDefault();
                router.push(`/kundli${dob ? `?date=${dob}` : ""}`);
              }}
            >
              <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className="field !rounded-full !border-0 !bg-transparent" aria-label="Your date of birth" />
              <button className="btn btn-accent shrink-0">Map my sky <ArrowRight size={16} /></button>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
