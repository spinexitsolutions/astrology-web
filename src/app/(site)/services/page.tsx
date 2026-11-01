import { ArrowUpRight } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ServiceIcon } from "@/components/site/home/ServicesStack";
import PageHeader from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getDB } from "@/lib/db";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Services & Consultations" };

export default function ServicesPage() {
  const db = getDB();
  const list = db.services.filter((s) => s.published).sort((a, b) => a.order - b.order);
  return (
    <>
      <PageHeader eyebrow="Readings & remedies" title="Every question has a house." italic={["house."]} sub="From Kundli analysis to Vastu, muhurat and tarot — choose the guidance that fits this season of your life." />
      <section className="container-x pb-28">
        <div className="divide-y divide-paper/10 border-y border-paper/10">
          {list.map((s, i) => (
            <Reveal key={s.id}>
              <Link href={`/services/${s.slug}`} className="group grid items-center gap-6 py-8 md:grid-cols-[80px_1.4fr_1fr_auto] md:py-10">
                <span className="font-mono text-sm text-mist">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h2 className="display text-[clamp(32px,4vw,56px)] transition duration-500 group-hover:translate-x-2 group-hover:italic group-hover:text-accent">{s.title}</h2>
                  <p className="font-deva mt-1 text-paper/35">{s.hindi}</p>
                </div>
                <p className="text-paper/60">{s.short}</p>
                <div className="flex items-center gap-4">
                  <div className="relative hidden h-20 w-28 overflow-hidden rounded-2xl md:block">
                    <Image src={s.image} alt="" fill sizes="112px" className="object-cover transition duration-700 group-hover:scale-110" />
                  </div>
                  <div className="text-right">
                    <p className="display text-2xl">{money(s.price, db.settings.currency)}</p>
                    <p className="text-xs text-mist">{s.duration}</p>
                  </div>
                  <span className="grid h-11 w-11 place-items-center rounded-full border border-paper/15 transition group-hover:rotate-45 group-hover:border-accent group-hover:bg-accent group-hover:text-ink"><ArrowUpRight size={18} /></span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-3">
          {[["Sparkles", "Classical rigour", "Parashari & KP systems, Lahiri ayanamsa, computed precisely."], ["Heart", "Compassion first", "No fear-selling. Remedies are simple, practical and optional."], ["ShieldCheck", "Private & secure", "Your birth data is never shared or sold."]].map(([icon, t, d]) => (
            <div key={t} className="rounded-3xl border border-paper/10 p-6">
              <span className="text-accent"><ServiceIcon name={icon} size={24} /></span>
              <p className="display mt-4 text-2xl">{t}</p>
              <p className="mt-2 text-paper/60">{d}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
