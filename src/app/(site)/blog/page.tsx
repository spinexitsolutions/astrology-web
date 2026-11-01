import type { Metadata } from "next";
import { PostCard } from "@/components/site/home/BlogPreview";
import PageHeader from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { list } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Journal" };

export default function BlogPage() {
  const posts = list("posts").filter((p) => p.published).sort((a, b) => b.date.localeCompare(a.date));
  const [first, ...rest] = posts;
  return (
    <>
      <PageHeader eyebrow="The journal" title="Notes from the night sky." italic={["night"]} sub="Transits, traditions and practical wisdom — written by our astrologers, without the jargon." />
      <section className="container-x pb-28">
        {first && <Reveal className="mb-16"><PostCard p={first} big /></Reveal>}
        <div className="grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => <Reveal key={p.id} delay={(i % 3) * 0.07}><PostCard p={p} /></Reveal>)}
        </div>
      </section>
    </>
  );
}
