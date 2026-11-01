"use client";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import * as Icons from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import type { Service } from "@/lib/types";
import { money } from "@/lib/utils";

export function ServiceIcon({ name, size = 20 }: { name: string; size?: number }) {
  const I = (Icons as unknown as Record<string, React.ComponentType<{ size?: number; strokeWidth?: number }>>)[name] ?? Icons.Sparkles;
  return <I size={size} strokeWidth={1.5} />;
}

function StackCard({ s, i, n, progress, currency }: { s: Service; i: number; n: number; progress: MotionValue<number>; currency: string }) {
  const target = 1 - (n - i) * 0.035;
  const scale = useTransform(progress, [i / n, 1], [1, target]);
  const dim = useTransform(progress, [i / n, Math.min(1, (i + 1) / n)], [0, i === n - 1 ? 0 : 0.45]);
  return (
    <div className="sticky top-0 flex h-[100svh] items-center justify-center px-4" style={{ paddingTop: `${70 + i * 18}px` }}>
      <motion.div style={{ scale }} className="relative grid w-full max-w-[1180px] origin-top overflow-hidden rounded-[32px] border border-paper/10 bg-ink-2 md:grid-cols-2">
        <div className="relative order-2 flex flex-col p-7 md:order-1 md:p-12">
          <div className="flex items-center gap-3 text-accent">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-accent/30"><ServiceIcon name={s.icon} /></span>
            <span className="font-mono text-[11px] uppercase tracking-[0.22em] text-mist">{String(i + 1).padStart(2, "0")} — {s.duration}</span>
          </div>
          <h3 className="display mt-8 text-[clamp(36px,4.6vw,64px)]">{s.title}</h3>
          <p className="font-deva mt-1 text-xl text-paper/35">{s.hindi}</p>
          <p className="mt-6 max-w-md text-paper/65 md:text-lg">{s.short}</p>
          <div className="mt-auto flex flex-wrap items-center gap-4 pt-10">
            <Link href={`/book?service=${encodeURIComponent(s.title)}`} className="btn btn-primary">Book · {money(s.price, currency)}</Link>
            <Link href={`/services/${s.slug}`} className="group inline-flex items-center gap-1.5 text-paper/70 hover:text-paper">
              Learn more <ArrowUpRight size={16} className="transition group-hover:rotate-45" />
            </Link>
          </div>
        </div>
        <div className="relative order-1 h-56 md:order-2 md:h-auto md:min-h-[520px]">
          <Image src={s.image} alt={s.title} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-transparent md:bg-gradient-to-r" />
        </div>
        <motion.div style={{ opacity: dim }} className="pointer-events-none absolute inset-0 bg-ink" />
      </motion.div>
    </div>
  );
}

export default function ServicesStack({ services, currency }: { services: Service[]; currency: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const list = services.slice(0, 5);
  return (
    <section className="relative pt-24 md:pt-36">
      <div className="container-x flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4">Consultations</p>
          <h2 className="display text-[clamp(44px,7vw,104px)]">Guidance for <em className="text-gold">every</em> season.</h2>
        </div>
        <Link href="/services" className="btn btn-ghost self-start md:self-auto">All services <ArrowUpRight size={16} /></Link>
      </div>
      <div ref={ref} className="relative mt-4">
        {list.map((s, i) => (
          <StackCard key={s.id} s={s} i={i} n={list.length} progress={scrollYProgress} currency={currency} />
        ))}
      </div>
    </section>
  );
}
