"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { HeroSettings } from "@/lib/types";
import Starfield from "../Starfield";
import ZodiacWheel from "../ZodiacWheel";

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero({ hero }: { hero: HeroSettings }) {
  const ref = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // Phase 1: headline drifts back & dissolves
  const textOpacity = useTransform(scrollYProgress, [0, 0.28], [1, 0]);
  const textScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.86]);
  const textBlur = useTransform(scrollYProgress, [0, 0.3], ["blur(0px)", "blur(12px)"]);
  const wheelRotate = useTransform(scrollYProgress, [0, 1], [0, 140]);
  const wheelScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.6]);
  // Phase 2: the portal image rises and expands to full-bleed (Apple-style)
  const imgScale = useTransform(scrollYProgress, [0.08, 0.62], [0.42, 1]);
  const imgY = useTransform(scrollYProgress, [0, 0.62], ["78vh", "0vh"]);
  const imgRadius = useTransform(scrollYProgress, [0.08, 0.62], [48, 0]);
  const innerScale = useTransform(scrollYProgress, [0.08, 1], [1.5, 1]);
  // Phase 3: copy on top of the image
  const capOpacity = useTransform(scrollYProgress, [0.6, 0.75], [0, 1]);
  const capY = useTransform(scrollYProgress, [0.6, 0.78], [60, 0]);

  useEffect(() => {
    const seen = document.documentElement.classList.contains("intro-seen") || !document.querySelector(".intro-overlay");
    if (seen) setReady(true);
    const on = () => setReady(true);
    window.addEventListener("taarak:intro-done", on);
    const fallback = setTimeout(on, 6500);
    return () => {
      window.removeEventListener("taarak:intro-done", on);
      clearTimeout(fallback);
    };
  }, []);

  const words = (s: string, base: number, italic = false) =>
    s.split(" ").map((w, i) => (
      <span key={w + i} className="inline-block overflow-hidden pb-[0.14em] align-bottom">
        <motion.span
          className={`inline-block ${italic ? "italic text-gold" : ""}`}
          initial={{ y: "115%", rotate: 6 }}
          animate={ready ? { y: "0%", rotate: 0 } : {}}
          transition={{ duration: 1.3, ease: EASE, delay: base + i * 0.08 }}
        >
          {w}&nbsp;
        </motion.span>
      </span>
    ));

  return (
    <section ref={ref} className="relative h-[260vh] bg-ink">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <Starfield />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_0%,color-mix(in_oklab,var(--accent-2)_18%,transparent),transparent_70%)]" />

        <motion.div style={{ rotate: wheelRotate, scale: wheelScale }} className="pointer-events-none absolute left-1/2 top-1/2 h-[150vmin] w-[150vmin] -translate-x-1/2 -translate-y-1/2 text-paper/[0.09] md:h-[120vmin] md:w-[120vmin]">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={ready ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 2.4, ease: EASE }} className="h-full w-full">
            <ZodiacWheel className="h-full w-full" />
          </motion.div>
        </motion.div>

        {/* Headline */}
        <motion.div style={{ opacity: textOpacity, scale: textScale, filter: textBlur }} className="relative z-10 flex h-full flex-col items-center justify-center px-5 pb-16 text-center">
          <motion.p className="eyebrow mb-6 flex items-center gap-3" initial={{ opacity: 0, y: 10 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1, delay: 0.1 }}>
            <span className="h-px w-8 bg-accent/60" /> {hero.eyebrow} <span className="h-px w-8 bg-accent/60" />
          </motion.p>
          <h1 className="display text-[clamp(50px,8.4vw,132px)] leading-[0.92]">
            {words(hero.titleTop, 0.15)}
            <br />
            {words(hero.titleAccent, 0.35, true)}
            {words(hero.titleBottom, 0.45)}
          </h1>
          <motion.p
            className="mt-7 max-w-xl text-[15px] leading-relaxed text-paper/65 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={ready ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}
          >
            {hero.subtitle}
          </motion.p>
          <motion.div className="mt-9 flex flex-col gap-3 sm:flex-row" initial={{ opacity: 0, y: 20 }} animate={ready ? { opacity: 1, y: 0 } : {}} transition={{ duration: 1.2, ease: EASE, delay: 1 }}>
            <Link href={hero.primaryCta.href} className="btn btn-primary">
              {hero.primaryCta.label} <ArrowUpRight size={17} />
            </Link>
            <Link href={hero.secondaryCta.href} className="btn btn-ghost">
              {hero.secondaryCta.label}
            </Link>
          </motion.div>

          <motion.div className="absolute inset-x-0 bottom-5 flex items-center justify-between px-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mist md:bottom-8 md:px-10" initial={{ opacity: 0 }} animate={ready ? { opacity: 1 } : {}} transition={{ delay: 1.4, duration: 1 }}>
            <span className="flex items-center gap-2"><ArrowDown size={12} className="animate-bounce" /> Scroll</span>
            <span className="hidden sm:block">Lahiri · Sidereal · Since 1998</span>
          </motion.div>
        </motion.div>

        {/* Portal image */}
        <motion.div style={{ scale: imgScale, y: imgY, borderRadius: imgRadius }} className="absolute inset-0 z-20 overflow-hidden will-change-transform">
          <motion.div style={{ scale: innerScale }} className="absolute inset-0">
            <Image src={hero.image} alt="" fill priority sizes="100vw" className="object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-ink/10" />
          <motion.div style={{ opacity: capOpacity, y: capY }} className="absolute inset-x-0 bottom-0 p-6 pb-14 md:p-14">
            <div className="mx-auto flex max-w-[1240px] flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <p className="display max-w-3xl text-[clamp(40px,7vw,110px)]">
                Born under <em className="text-gold">which</em> sky?
              </p>
              <div className="max-w-sm">
                <p className="mb-5 text-paper/75">Enter your birth details and get your complete Vedic birth chart, nakshatra and dasha in seconds — free, forever.</p>
                <Link href="/kundli" className="btn btn-accent">
                  Reveal my Kundli <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
