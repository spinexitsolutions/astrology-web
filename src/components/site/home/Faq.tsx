"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { useState } from "react";
import type { Faq as F } from "@/lib/types";
import { Reveal } from "../Reveal";

export default function Faq({ faqs }: { faqs: F[] }) {
  const [open, setOpen] = useState<string | null>(faqs[0]?.id ?? null);
  return (
    <section className="container-x grid gap-12 py-24 md:py-36 lg:grid-cols-[1fr_1.4fr]">
      <Reveal>
        <p className="eyebrow mb-4">Questions</p>
        <h2 className="display text-[clamp(44px,6vw,88px)]">Asked & <em className="text-gold">answered.</em></h2>
        <p className="mt-5 max-w-sm text-paper/60">Still curious? Our team replies on WhatsApp within the hour.</p>
      </Reveal>
      <div className="border-t border-paper/10">
        {faqs.map((f) => {
          const o = open === f.id;
          return (
            <div key={f.id} className="border-b border-paper/10">
              <button onClick={() => setOpen(o ? null : f.id)} className="flex w-full items-center justify-between gap-6 py-6 text-left" aria-expanded={o}>
                <span className={`text-lg transition md:text-xl ${o ? "text-paper" : "text-paper/75"}`}>{f.question}</span>
                <motion.span animate={{ rotate: o ? 45 : 0 }} className={`grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${o ? "border-accent bg-accent text-ink" : "border-paper/20"}`}>
                  <Plus size={16} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {o && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden">
                    <p className="max-w-2xl pb-7 leading-relaxed text-paper/60">{f.answer}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
