"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { numerology, NUMBER_MEANINGS } from "@/lib/astro";

const LABELS: { key: "lifePath" | "destiny" | "soulUrge" | "personality" | "birthday" | "personalYear"; title: string; desc: string }[] = [
  { key: "lifePath", title: "Life Path", desc: "The road you walk — from your full birth date." },
  { key: "destiny", title: "Destiny", desc: "What you're here to express — from your full name." },
  { key: "soulUrge", title: "Soul Urge", desc: "What your heart craves — from the vowels." },
  { key: "personality", title: "Personality", desc: "How the world sees you — from the consonants." },
  { key: "birthday", title: "Birthday", desc: "A special gift — from your day of birth." },
  { key: "personalYear", title: "Personal Year", desc: "The theme of your current year." },
];

export default function NumerologyTool() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("1996-07-21");
  const [res, setRes] = useState<ReturnType<typeof numerology> | null>(null);

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setRes(numerology(name || "Your Name", dob));
        }}
        className="flex flex-col gap-3 rounded-[28px] border border-paper/10 bg-ink-2 p-3 md:flex-row md:rounded-full"
      >
        <input className="field !rounded-full md:flex-1" required placeholder="Full name at birth" value={name} onChange={(e) => setName(e.target.value)} aria-label="Full name" />
        <input className="field !rounded-full md:w-56" type="date" required value={dob} onChange={(e) => setDob(e.target.value)} aria-label="Date of birth" />
        <button className="btn btn-accent">Reveal my numbers <ArrowUpRight size={16} /></button>
      </form>

      <AnimatePresence mode="wait">
        {res && (
          <motion.div key={name + dob} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mt-12">
            <div className="grid gap-4 lg:grid-cols-[1.2fr_1fr]">
              <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="relative overflow-hidden rounded-[32px] border border-accent/30 bg-[radial-gradient(circle_at_80%_10%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_60%)] p-8 md:p-10">
                <p className="eyebrow">Your Life Path</p>
                <motion.p className="display mt-2 text-[160px] leading-none text-gold md:text-[220px]" initial={{ scale: 0.6, opacity: 0, filter: "blur(20px)" }} animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }} transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}>
                  {res.lifePath}
                </motion.p>
                <p className="display text-4xl">{NUMBER_MEANINGS[res.lifePath]?.title}</p>
                <p className="mt-3 max-w-lg text-paper/70">{NUMBER_MEANINGS[res.lifePath]?.text}</p>
                <p className="mt-4 text-sm text-mist">Ruling planet · {NUMBER_MEANINGS[res.lifePath]?.planet}</p>
              </motion.div>
              <div className="grid grid-cols-2 gap-4">
                {LABELS.slice(1).map((l, i) => (
                  <motion.div key={l.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="rounded-3xl border border-paper/10 bg-ink-2 p-5">
                    <p className="text-xs text-mist">{l.title}</p>
                    <p className="display mt-1 text-6xl">{res[l.key]}</p>
                    <p className="mt-1 text-sm text-paper/70">{NUMBER_MEANINGS[res[l.key]]?.title}</p>
                  </motion.div>
                ))}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="rounded-3xl bg-paper p-5 text-ink">
                  <p className="text-xs text-ink/60">Lucky numbers</p>
                  <p className="display mt-1 text-5xl">{Array.from(new Set(res.lucky.numbers)).join(" · ")}</p>
                </motion.div>
              </div>
            </div>
            <div className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-2">
              {LABELS.map((l) => (
                <div key={l.key} className="border-t border-paper/10 pt-5">
                  <p className="flex items-baseline justify-between"><span className="display text-2xl">{l.title}</span><span className="display text-3xl text-accent">{res[l.key]}</span></p>
                  <p className="mt-1 text-sm text-mist">{l.desc}</p>
                  <p className="mt-2 text-paper/70">{NUMBER_MEANINGS[res[l.key]]?.text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
