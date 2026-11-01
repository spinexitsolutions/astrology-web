import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PostCard } from "@/components/site/home/BlogPreview";
import ReadingProgress from "@/components/site/ReadingProgress";
import { Parallax } from "@/components/site/Reveal";
import { list } from "@/lib/db";
import { shortDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = list("posts").find((x) => x.slug === slug);
  return { title: p?.title ?? "Journal", description: p?.excerpt, openGraph: p ? { images: [p.image] } : undefined };
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts = list("posts").filter((p) => p.published);
  const p = posts.find((x) => x.slug === slug);
  if (!p) notFound();
  const more = posts.filter((x) => x.id !== p.id).slice(0, 3);
  return (
    <article>
      <ReadingProgress />
      <header className="container-x pb-12 pt-32 md:pt-44">
        <p className="eyebrow"><Link href="/blog" className="hover:text-paper">Journal</Link> / {p.category}</p>
        <h1 className="display mt-5 max-w-5xl text-[clamp(44px,7vw,108px)]">{p.title}</h1>
        <p className="mt-6 max-w-2xl text-lg text-paper/60">{p.excerpt}</p>
        <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] text-mist">{p.author} · {shortDate(p.date)} · {p.readMinutes} min read</p>
      </header>
      <Parallax className="container-x !px-0 md:!px-10" speed={0.1}>
        <div className="relative aspect-[16/9] overflow-hidden md:rounded-[32px]">
          <Image src={p.image} alt="" fill priority sizes="100vw" className="object-cover" />
        </div>
      </Parallax>
      <div className="container-x prose-astro mx-auto max-w-[720px] py-16">
        {p.content.split("\n\n").map((block, i) => (block.startsWith("## ") ? <h2 key={i}>{block.slice(3)}</h2> : <p key={i}>{block}</p>))}
        <div className="mt-12 rounded-[28px] border border-accent/25 bg-accent/[0.05] p-6">
          <p className="display !text-3xl !text-paper">How does this affect your chart?</p>
          <p className="!mb-4 !text-base">General transits touch everyone differently. Get a personal reading.</p>
          <Link href="/book" className="btn btn-accent">Book a consultation</Link>
        </div>
      </div>
      <section className="container-x border-t border-paper/10 py-20">
        <p className="eyebrow mb-8">Keep reading</p>
        <div className="grid gap-8 md:grid-cols-3">{more.map((m) => <PostCard key={m.id} p={m} />)}</div>
      </section>
    </article>
  );
}
