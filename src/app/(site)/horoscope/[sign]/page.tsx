import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import HoroscopeTabs from "@/components/site/tools/HoroscopeTabs";
import Starfield from "@/components/site/Starfield";
import { list } from "@/lib/db";
import { getReading } from "@/lib/horoscope";
import { SIGNS, signBySlug } from "@/lib/zodiac";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ sign: string }> }): Promise<Metadata> {
  const s = signBySlug((await params).sign);
  return { title: s ? `${s.name} Horoscope Today` : "Horoscope" };
}

export default async function SignPage({ params }: { params: Promise<{ sign: string }> }) {
  const { sign } = await params;
  const s = signBySlug(sign);
  if (!s) notFound();
  const ov = list("horoscopes");
  const readings = { daily: getReading(sign, "daily", ov), weekly: getReading(sign, "weekly", ov), monthly: getReading(sign, "monthly", ov) };
  const idx = SIGNS.findIndex((x) => x.slug === sign);
  const prev = SIGNS[(idx + 11) % 12], next = SIGNS[(idx + 1) % 12];

  return (
    <>
      <section className="relative overflow-hidden pb-10 pt-32 md:pt-44">
        <Starfield density={0.0001} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(60% 60% at 70% 20%, hsl(${s.hue} 70% 50% / .25), transparent 70%)` }} />
        <div className="container-x relative grid items-end gap-10 md:grid-cols-[1fr_auto]">
          <div>
            <p className="eyebrow mb-5"><Link href="/horoscope" className="hover:text-paper">Horoscope</Link> / {s.name}</p>
            <h1 className="display display-xl text-[clamp(64px,12vw,190px)] leading-[0.85]">{s.name}</h1>
            <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-paper/60">
              <span className="font-deva text-2xl text-paper/80">{s.hindi}</span>
              <span>{s.vedic} Rashi</span>·<span>{s.dates}</span>·<span>{s.element} · {s.modality}</span>
            </p>
          </div>
          <span className="hidden text-[220px] leading-none md:block" style={{ color: `hsl(${s.hue} 80% 75%)`, textShadow: `0 0 80px hsl(${s.hue} 80% 60% / .5)` }}>{s.glyph}&#xFE0E;</span>
        </div>
      </section>

      <section className="container-x grid gap-10 pb-24 lg:grid-cols-[1.6fr_1fr]">
        <HoroscopeTabs readings={readings} />
        <aside className="space-y-4">
          <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-6">
            <p className="eyebrow mb-4">Sign profile</p>
            <dl className="grid grid-cols-2 gap-y-4 text-sm">
              {[["Ruler", s.ruler], ["Element", s.element], ["Lucky gem", s.gem], ["Lucky day", s.day], ["Lucky number", String(s.number)], ["Colour", s.color]].map(([k, v]) => (
                <div key={k}><dt className="text-mist">{k}</dt><dd className="mt-0.5 text-paper">{v}</dd></div>
              ))}
            </dl>
            <div className="mt-6 border-t border-paper/10 pt-5 text-sm">
              <p className="text-mist">Strengths</p><p className="mt-1 text-paper/80">{s.strengths}</p>
              <p className="mt-4 text-mist">Shadow</p><p className="mt-1 text-paper/80">{s.shadow}</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-6">
            <p className="eyebrow mb-4">Best matches</p>
            <div className="flex gap-2">
              {s.compatible.map((c) => {
                const x = signBySlug(c)!;
                return (
                  <Link key={c} href={`/horoscope/${c}`} className="flex-1 rounded-2xl border border-paper/10 p-3 text-center transition hover:border-accent">
                    <span className="block text-3xl" style={{ color: `hsl(${x.hue} 80% 75%)` }}>{x.glyph}&#xFE0E;</span>
                    <span className="mt-1 block text-xs text-paper/70">{x.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <Link href={`/book?service=${encodeURIComponent("Complete Kundli Analysis")}`} className="block rounded-[28px] bg-accent p-6 text-ink transition hover:brightness-105">
            <p className="display text-3xl">Want a personal reading?</p>
            <p className="mt-2 text-ink/70">Sun-sign horoscopes are general. Your Kundli is yours alone.</p>
            <p className="mt-4 font-medium">Book an astrologer →</p>
          </Link>
        </aside>
      </section>

      <section className="container-x flex justify-between border-t border-paper/10 py-10">
        <Link href={`/horoscope/${prev.slug}`} className="group"><p className="eyebrow">Previous</p><p className="display mt-1 text-3xl group-hover:text-accent">← {prev.name}</p></Link>
        <Link href={`/horoscope/${next.slug}`} className="group text-right"><p className="eyebrow">Next</p><p className="display mt-1 text-3xl group-hover:text-accent">{next.name} →</p></Link>
      </section>
    </>
  );
}
