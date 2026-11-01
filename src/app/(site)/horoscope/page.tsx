import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { list } from "@/lib/db";
import { getReading } from "@/lib/horoscope";
import { SIGNS } from "@/lib/zodiac";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Daily Horoscope", description: "Free daily, weekly and monthly horoscope for all 12 zodiac signs." };

export default function HoroscopeIndex() {
  const overrides = list("horoscopes");
  const first = getReading("aries", "daily", overrides);
  return (
    <>
      <PageHeader eyebrow={`Horoscope · ${first.periodLabel}`} title="What the sky says today." italic={["today."]} sub="Choose your sign for today's reading, plus weekly and monthly forecasts, lucky colour, numbers and the sign you'll vibe with most." />
      <section className="container-x pb-28">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SIGNS.map((s, i) => {
            const r = getReading(s.slug, "daily", overrides);
            return (
              <Reveal key={s.slug} delay={(i % 3) * 0.06}>
                <Link
                  href={`/horoscope/${s.slug}`}
                  className="group relative flex h-full flex-col overflow-hidden rounded-[28px] border border-paper/10 bg-ink-2 p-6 transition duration-700 hover:-translate-y-1 hover:border-paper/25"
                >
                  <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full opacity-40 blur-3xl transition duration-700 group-hover:opacity-80" style={{ background: `hsl(${s.hue} 80% 55% / .45)` }} />
                  <div className="relative flex items-start justify-between">
                    <div>
                      <p className="display text-4xl">{s.name}</p>
                      <p className="mt-1 text-sm text-mist">{s.dates}</p>
                    </div>
                    <span className="text-5xl transition duration-700 group-hover:rotate-[-15deg] group-hover:scale-110" style={{ color: `hsl(${s.hue} 80% 75%)` }}>{s.glyph}&#xFE0E;</span>
                  </div>
                  <p className="relative mt-6 line-clamp-3 text-paper/65">{r.text}</p>
                  <div className="relative mt-6 flex items-center justify-between border-t border-paper/10 pt-4 text-sm">
                    <span className="text-mist">Mood · <span className="text-paper">{r.mood}</span></span>
                    <span className="flex items-center gap-1 text-paper/70 group-hover:text-accent">Read <ArrowUpRight size={15} /></span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>
    </>
  );
}
