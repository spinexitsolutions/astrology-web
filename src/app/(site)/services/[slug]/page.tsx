import { ArrowUpRight, Clock } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AstrologerCard } from "@/components/site/home/Astrologers";
import { Parallax, Reveal } from "@/components/site/Reveal";
import { getDB } from "@/lib/db";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getDB().services.find((x) => x.slug === slug);
  return { title: s?.title ?? "Service", description: s?.short };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDB();
  const s = db.services.find((x) => x.slug === slug && x.published);
  if (!s) notFound();
  const others = db.services.filter((x) => x.published && x.id !== s.id).slice(0, 3);
  return (
    <>
      <section className="relative h-[85svh] min-h-[560px]">
        <Parallax className="absolute inset-0" speed={0.15}>
          <Image src={s.image} alt="" fill priority sizes="100vw" className="object-cover" />
        </Parallax>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/30" />
        <div className="container-x relative flex h-full flex-col justify-end pb-14">
          <p className="eyebrow mb-4"><Link href="/services" className="hover:text-paper">Services</Link> / {s.title}</p>
          <h1 className="display max-w-5xl text-[clamp(52px,9vw,140px)]">{s.title}</h1>
          <p className="font-deva mt-2 text-2xl text-paper/50">{s.hindi}</p>
        </div>
      </section>
      <section className="container-x grid gap-14 py-20 lg:grid-cols-[1.5fr_1fr]">
        <Reveal className="prose-astro">
          <p className="display !text-[clamp(26px,2.6vw,36px)] !leading-tight !text-paper">{s.short}</p>
          {s.description.split("\n\n").map((p, i) => <p key={i}>{p}</p>)}
        </Reveal>
        <aside className="h-fit rounded-[28px] border border-paper/10 bg-ink-2 p-6 lg:sticky lg:top-28">
          <p className="display text-5xl">{money(s.price, db.settings.currency)}</p>
          <p className="mt-2 flex items-center gap-2 text-mist"><Clock size={15} /> {s.duration}</p>
          <ul className="mt-6 space-y-2 text-sm text-paper/70">
            <li>✦ Video, call, chat or in-person</li>
            <li>✦ Written summary after the session</li>
            <li>✦ Free follow-up question within 7 days</li>
          </ul>
          <Link href={`/book?service=${encodeURIComponent(s.title)}`} className="btn btn-accent mt-6 w-full">Book this session <ArrowUpRight size={16} /></Link>
          <a href={`https://wa.me/${db.settings.contact.whatsapp}?text=${encodeURIComponent(`Hi, I'd like to know more about ${s.title}`)}`} target="_blank" rel="noreferrer" className="btn btn-ghost mt-2 w-full">Ask on WhatsApp</a>
        </aside>
      </section>
      <section className="container-x pb-24">
        <p className="eyebrow mb-6">Recommended astrologers</p>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {db.astrologers.filter((a) => a.published).slice(0, 3).map((a) => <AstrologerCard key={a.id} a={a} currency={db.settings.currency} />)}
        </div>
        <p className="eyebrow mb-6 mt-20">Other services</p>
        <div className="grid gap-4 md:grid-cols-3">
          {others.map((o) => (
            <Link key={o.id} href={`/services/${o.slug}`} className="group rounded-3xl border border-paper/10 p-6 transition hover:border-paper/30">
              <p className="display text-3xl group-hover:text-accent">{o.title}</p>
              <p className="mt-2 text-paper/60">{o.short}</p>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
