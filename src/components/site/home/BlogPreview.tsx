import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/types";
import { shortDate } from "@/lib/utils";
import { Reveal } from "../Reveal";

export function PostCard({ p, big = false }: { p: Post; big?: boolean }) {
  return (
    <Link href={`/blog/${p.slug}`} className="group block">
      <div className={`relative overflow-hidden rounded-[28px] ${big ? "aspect-[4/3] lg:aspect-[5/4]" : "aspect-[4/3]"}`}>
        <Image src={p.image} alt={p.title} fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover transition duration-[1.4s] ease-[var(--ease-out-expo)] group-hover:scale-105" />
        <span className="absolute left-4 top-4 rounded-full bg-ink/60 px-3 py-1 text-xs backdrop-blur">{p.category}</span>
      </div>
      <div className="mt-5 flex items-center gap-3 font-medium text-[11px] text-mist">
        <span>{shortDate(p.date)}</span> · <span>{p.readMinutes} min read</span>
      </div>
      <h3 className={`display mt-2 transition group-hover:text-accent ${big ? "text-[clamp(32px,3.6vw,52px)]" : "text-3xl"}`}>{p.title}</h3>
      <p className="mt-2 line-clamp-2 text-paper/60">{p.excerpt}</p>
    </Link>
  );
}

export default function BlogPreview({ posts }: { posts: Post[] }) {
  const [first, ...rest] = posts;
  if (!first) return null;
  return (
    <section className="container-x py-24 md:py-36">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4">The journal</p>
          <h2 className="display display-xl text-[clamp(44px,7vw,104px)]">Stories <em className="text-gold">from the sky.</em></h2>
        </div>
        <Link href="/blog" className="group inline-flex items-center gap-2 text-paper/70 hover:text-paper">All articles <ArrowUpRight size={16} className="transition group-hover:rotate-45" /></Link>
      </Reveal>
      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal><PostCard p={first} big /></Reveal>
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-1 lg:gap-8">
          {rest.slice(0, 2).map((p, i) => (
            <Reveal key={p.id} delay={0.1 + i * 0.08}>
              <Link href={`/blog/${p.slug}`} className="group grid gap-5 sm:block lg:grid lg:grid-cols-[220px_1fr]">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image src={p.image} alt={p.title} fill sizes="400px" className="object-cover transition duration-[1.4s] group-hover:scale-105" />
                </div>
                <div className="sm:mt-4 lg:mt-0">
                  <p className="font-medium text-[11px] text-mist">{p.category} · {p.readMinutes} min</p>
                  <h3 className="display mt-2 text-3xl transition group-hover:text-accent">{p.title}</h3>
                  <p className="mt-2 line-clamp-2 text-paper/60">{p.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
