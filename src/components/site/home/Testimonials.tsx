"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import type { Testimonial } from "@/lib/types";

export default function Testimonials({ list }: { list: Testimonial[] }) {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = list.length;
  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 6000);
    return () => clearInterval(t);
  }, [paused, n]);
  if (!n) return null;
  const t = list[i];

  return (
    <section className="grain relative overflow-hidden bg-paper text-ink" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="container-x relative py-24 md:py-36">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-ink/50">Kind words · {String(i + 1).padStart(2, "0")}/{String(n).padStart(2, "0")}</p>
          <div className="flex gap-2">
            <button onClick={() => setI((i - 1 + n) % n)} className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 transition hover:bg-ink hover:text-paper" aria-label="Previous"><ArrowLeft size={18} /></button>
            <button onClick={() => setI((i + 1) % n)} className="grid h-11 w-11 place-items-center rounded-full border border-ink/15 transition hover:bg-ink hover:text-paper" aria-label="Next"><ArrowRight size={18} /></button>
          </div>
        </div>
        <div className="relative mt-12 min-h-[340px] md:min-h-[300px]">
          <AnimatePresence mode="wait">
            <motion.figure key={t.id} initial="h" animate="s" exit="x" className="absolute inset-0">
              <blockquote className="display text-[clamp(30px,4.6vw,68px)] leading-[1.05]">
                {t.quote.split(" ").map((w, k) => (
                  <motion.span
                    key={k}
                    className="inline-block"
                    variants={{ h: { opacity: 0, y: 24, filter: "blur(8px)" }, s: { opacity: 1, y: 0, filter: "blur(0px)" }, x: { opacity: 0, y: -16, filter: "blur(8px)" } }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: k * 0.02 }}
                  >
                    {k === 0 ? "“" : ""}{w}{k === t.quote.split(" ").length - 1 ? "”" : ""}&nbsp;
                  </motion.span>
                ))}
              </blockquote>
              <motion.figcaption className="mt-10 flex items-center gap-4" variants={{ h: { opacity: 0 }, s: { opacity: 1 }, x: { opacity: 0 } }} transition={{ delay: 0.3 }}>
                <Image src={t.image} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" />
                <div>
                  <p className="font-medium">{t.name}</p>
                  <p className="text-sm text-ink/55">{t.city} · {t.service}</p>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, k) => <Star key={k} size={16} className="fill-ink text-ink" />)}
                </div>
              </motion.figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>
        <div className="mt-10 flex gap-2">
          {list.map((x, k) => (
            <button key={x.id} onClick={() => setI(k)} className="h-1 flex-1 overflow-hidden rounded-full bg-ink/10" aria-label={`Show testimonial ${k + 1}`}>
              {k === i && <motion.span key={`${i}-${paused}`} className="block h-full bg-ink" initial={{ width: "0%" }} animate={{ width: paused ? "100%" : "100%" }} transition={{ duration: paused ? 0 : 6, ease: "linear" }} />}
              {k < i && <span className="block h-full w-full bg-ink/40" />}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
