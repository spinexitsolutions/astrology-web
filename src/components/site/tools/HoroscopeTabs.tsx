"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, Heart, Leaf } from "lucide-react";
import { useState } from "react";
import type { Period, Reading } from "@/lib/horoscope";
import { signBySlug } from "@/lib/zodiac";

const TABS: Period[] = ["daily", "weekly", "monthly"];

export default function HoroscopeTabs({ readings }: { readings: Record<Period, Reading> }) {
  const [tab, setTab] = useState<Period>("daily");
  const r = readings[tab];
  const comp = signBySlug(r.compatibility);
  return (
    <div>
      <div className="relative mb-8 inline-flex rounded-full border border-paper/10 bg-ink-2 p-1">
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`relative z-10 rounded-full px-5 py-2.5 text-sm capitalize transition ${tab === t ? "text-ink" : "text-paper/70 hover:text-paper"}`}>
            {tab === t && <motion.span layoutId="htab" className="absolute inset-0 -z-10 rounded-full bg-paper" transition={{ type: "spring", stiffness: 400, damping: 34 }} />}
            {t === "daily" ? "Today" : t === "weekly" ? "This week" : "This month"}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 20, filter: "blur(6px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }} exit={{ opacity: 0, y: -10, filter: "blur(6px)" }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
          <p className="eyebrow">{r.periodLabel}</p>
          <p className="display mt-4 text-[clamp(28px,3.4vw,46px)] leading-[1.12]">{r.text}</p>

          <div className="mt-10 grid gap-3 sm:grid-cols-3">
            {[
              { k: "Love", v: r.love, I: Heart },
              { k: "Career", v: r.career, I: Briefcase },
              { k: "Health", v: r.health, I: Leaf },
            ].map(({ k, v, I }) => (
              <div key={k} className="rounded-3xl border border-paper/10 bg-ink-2 p-5">
                <p className="flex items-center gap-2 text-accent"><I size={16} /> <span className="eyebrow !text-accent">{k}</span></p>
                <p className="mt-3 text-paper/75">{v}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-3xl border border-paper/10 bg-ink-2 p-5">
              <p className="eyebrow mb-4">Energy meter</p>
              {Object.entries(r.scores).map(([k, v], i) => (
                <div key={k} className="mb-3 flex items-center gap-3 last:mb-0">
                  <span className="w-16 text-sm capitalize text-paper/70">{k}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-paper/10">
                    <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} animate={{ width: `${v * 20}%` }} transition={{ duration: 1.2, delay: 0.2 + i * 0.1, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                  <span className="w-8 text-right font-mono text-xs text-mist">{v}/5</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[["Lucky number", String(r.luckyNumber)], ["Lucky colour", r.luckyColor], ["Lucky time", r.luckyTime], ["Vibe with", comp ? `${comp.glyph}︎ ${comp.name}` : "—"]].map(([k, v]) => (
                <div key={k} className="rounded-3xl border border-paper/10 bg-ink-2 p-4">
                  <p className="text-xs text-mist">{k}</p>
                  <p className="display mt-2 text-2xl">{v}</p>
                </div>
              ))}
            </div>
          </div>
          <p className="mt-6 text-sm text-mist">Mood of the {tab === "daily" ? "day" : tab === "weekly" ? "week" : "month"}: <span className="text-paper">{r.mood}</span></p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
