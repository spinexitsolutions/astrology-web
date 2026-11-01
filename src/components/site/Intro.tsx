"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { IntroSettings } from "@/lib/types";
import { useLenis } from "./SmoothScroll";

const EASE = [0.83, 0, 0.17, 1] as const;
const KEY = "taarak-intro-seen";

function OrbitArt({ d }: { d: number }) {
  const orbits = [70, 120, 175, 235];
  return (
    <svg viewBox="-260 -260 520 520" className="absolute left-1/2 top-1/2 h-[min(120vw,760px)] w-[min(120vw,760px)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
      <defs>
        <radialGradient id="intro-sun">
          <stop offset="0%" stopColor="#fff6dc" />
          <stop offset="45%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <motion.circle r="26" fill="url(#intro-sun)" initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.4, 1], opacity: 1 }} transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }} />
      {orbits.map((r, i) => (
        <g key={r}>
          <motion.circle
            r={r}
            fill="none"
            stroke="rgba(243,238,229,.28)"
            strokeWidth="0.7"
            strokeDasharray={i % 2 ? "2 5" : undefined}
            initial={{ pathLength: 0, rotate: -90, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.15 * i, ease: EASE }}
          />
          <motion.g
            initial={{ rotate: i * 70, opacity: 0 }}
            animate={{ rotate: i * 70 + (i % 2 ? -1 : 1) * (360 / (i + 1.4)) * (d / 3000), opacity: 1 }}
            transition={{ rotate: { duration: d / 1000, ease: "linear" }, opacity: { delay: 0.5 + i * 0.15, duration: 0.6 } }}
          >
            <circle cx={r} cy="0" r={[4, 6, 3.5, 5][i]} fill={i === 1 ? "var(--accent)" : i === 3 ? "var(--accent-2)" : "#f3eee5"} />
            {i === 2 && <circle cx={r} cy="0" r="10" fill="none" stroke="rgba(243,238,229,.4)" strokeWidth="0.6" />}
          </motion.g>
        </g>
      ))}
    </svg>
  );
}

function MandalaArt() {
  return (
    <svg viewBox="-200 -200 400 400" className="absolute left-1/2 top-1/2 h-[min(110vw,680px)] w-[min(110vw,680px)] -translate-x-1/2 -translate-y-1/2" aria-hidden>
      <motion.g animate={{ rotate: 45 }} transition={{ duration: 6, ease: "linear" }}>
        {Array.from({ length: 12 }).map((_, i) => (
          <motion.path
            key={i}
            d="M0 0 C 40 -60, 40 -140, 0 -180 C -40 -140, -40 -60, 0 0"
            fill="none"
            stroke={i % 2 ? "var(--accent)" : "rgba(243,238,229,.5)"}
            strokeWidth="0.7"
            transform={`rotate(${i * 30})`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.6, delay: i * 0.07, ease: EASE }}
          />
        ))}
        {[40, 90, 140].map((r, i) => (
          <motion.circle key={r} r={r} fill="none" stroke="rgba(243,238,229,.25)" strokeWidth="0.6" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.4, delay: 0.3 + i * 0.2 }} />
        ))}
      </motion.g>
    </svg>
  );
}

export default function Intro({ settings, brand }: { settings: IntroSettings; brand: string }) {
  const [show, setShow] = useState(settings.enabled);
  const [count, setCount] = useState(0);
  const lenis = useLenis();
  const d = Math.max(1500, Math.min(8000, settings.durationMs || 3000));

  useEffect(() => {
    if (!settings.enabled) return;
    const force = new URLSearchParams(window.location.search).has("intro");
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {}
    if (settings.oncePerSession && seen && !force) {
      setShow(false);
      return;
    }
    try {
      sessionStorage.setItem(KEY, "1");
    } catch {}
    document.documentElement.classList.remove("intro-seen");
    document.documentElement.style.overflow = "hidden";
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / (d - 500));
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const to = setTimeout(() => setShow(false), d);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(to);
    };
  }, [settings.enabled, settings.oncePerSession, d]);

  useEffect(() => {
    if (!show) {
      document.documentElement.style.overflow = "";
      lenis?.start();
      window.dispatchEvent(new Event("taarak:intro-done"));
    } else lenis?.stop();
  }, [show, lenis]);

  const title = settings.title || brand;
  const minimal = settings.style === "minimal";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="intro"
          className="intro-overlay fixed inset-0 z-[200] flex items-center justify-center overflow-hidden bg-ink"
          initial={{ clipPath: "circle(150% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(168,155,255,.12),transparent_60%)]" />
          {!minimal && (settings.style === "mandala" ? <MandalaArt /> : <OrbitArt d={d} />)}

          <div className="relative z-10 px-6 text-center">
            <h1 className="display text-[clamp(64px,16vw,200px)] leading-none">
              {title.split("").map((ch, i) => (
                <motion.span
                  key={i}
                  className="inline-block"
                  initial={{ opacity: 0, y: 60, filter: "blur(16px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  transition={{ duration: 1.2, delay: 0.4 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {ch === " " ? " " : ch}
                </motion.span>
              ))}
            </h1>
            <motion.p
              className="mt-4 font-display text-xl italic text-paper/70 md:text-2xl"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.1 }}
            >
              {settings.tagline}
            </motion.p>
          </div>

          <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-between gap-6 p-5 md:p-10">
            <div className="max-w-[60%]">
              <p className="eyebrow">{settings.loadingText}</p>
              <div className="mt-3 h-px w-40 overflow-hidden bg-paper/15 md:w-64">
                <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${count}%` }} />
              </div>
            </div>
            <div className="font-mono text-5xl tabular-nums text-paper/90 md:text-7xl">
              {String(count).padStart(3, "0")}
            </div>
          </div>
          <div className="absolute left-5 top-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mist md:left-10 md:top-8">
            25.3176° N · 82.9739° E
          </div>
          <div className="absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.25em] text-mist md:right-10 md:top-8">
            Kashi · {new Date().getFullYear()}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
