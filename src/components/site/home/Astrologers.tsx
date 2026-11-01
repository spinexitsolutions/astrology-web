"use client";
import { ArrowUpRight, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Astrologer } from "@/lib/types";
import { money } from "@/lib/utils";
import { Reveal } from "../Reveal";

export function AstrologerCard({ a, currency }: { a: Astrologer; currency: string }) {
  return (
    <div className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-paper/10 bg-ink-2">
      <div className="relative aspect-[4/5] overflow-hidden">
        <Image src={a.image} alt={a.name} fill sizes="(min-width:1024px) 25vw, 80vw" className="object-cover grayscale-[35%] transition duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:grayscale-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-2 via-ink-2/10 to-transparent" />
        <span className={`absolute left-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium backdrop-blur-md ${a.online ? "bg-emerald-400/15 text-emerald-300" : "bg-paper/10 text-paper/60"}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${a.online ? "animate-pulse bg-emerald-400" : "bg-paper/40"}`} />
          {a.online ? "Online now" : "Next slot today"}
        </span>
        <span className="absolute right-4 top-4 flex items-center gap-1 rounded-full bg-ink/60 px-2.5 py-1 text-xs backdrop-blur-md">
          <Star size={12} className="fill-accent text-accent" /> {a.rating}
        </span>
      </div>
      <div className="-mt-16 relative flex flex-1 flex-col p-5">
        <h3 className="display text-3xl leading-tight">{a.name}</h3>
        <p className="mt-1 text-sm text-accent">{a.title}</p>
        <p className="mt-3 text-sm text-paper/55">{a.experience} yrs · {a.languages}</p>
        <p className="mt-1 text-sm text-paper/55">{a.expertise}</p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-sm"><span className="display text-2xl">{money(a.pricePerMin, currency)}</span><span className="text-mist">/min</span></p>
          <Link href={`/book?astrologer=${encodeURIComponent(a.name)}`} className="btn btn-primary !px-4 !py-2.5 text-sm">Consult</Link>
        </div>
      </div>
    </div>
  );
}

export default function Astrologers({ list, currency }: { list: Astrologer[]; currency: string }) {
  return (
    <section className="py-24 md:py-36">
      <Reveal className="container-x mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4">Our astrologers</p>
          <h2 className="display display-xl text-[clamp(44px,7vw,104px)]">Wise. Warm. <em className="text-gold">Verified.</em></h2>
        </div>
        <Link href="/astrologers" className="group inline-flex items-center gap-2 text-paper/70 hover:text-paper">
          Meet all astrologers <ArrowUpRight size={16} className="transition group-hover:rotate-45" />
        </Link>
      </Reveal>
      <div className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-10 lg:grid lg:grid-cols-4 lg:overflow-visible lg:px-[max(40px,calc((100vw-1320px)/2+40px))]">
        {list.slice(0, 4).map((a, i) => (
          <Reveal key={a.id} delay={i * 0.08} className="w-[78vw] shrink-0 snap-center sm:w-[340px] lg:w-auto">
            <AstrologerCard a={a} currency={currency} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
