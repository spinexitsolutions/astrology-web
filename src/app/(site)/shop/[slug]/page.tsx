import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCart from "@/components/site/AddToCart";
import { ProductCard } from "@/components/site/home/ShopPreview";
import ProductArt from "@/components/site/ProductArt";
import { getDB } from "@/lib/db";
import { money } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getDB().products.find((x) => x.slug === slug);
  return { title: p?.name ?? "Product", description: p?.short };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const db = getDB();
  const p = db.products.find((x) => x.slug === slug && x.published);
  if (!p) notFound();
  const cur = db.settings.currency;
  const related = db.products.filter((x) => x.published && x.id !== p.id && (x.category === p.category || x.planet === p.planet)).slice(0, 4);
  return (
    <>
      <section className="container-x grid gap-10 pb-20 pt-28 md:pt-36 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-square overflow-hidden rounded-[32px] border border-paper/10 lg:sticky lg:top-28 lg:h-fit">
          {p.image ? <Image src={p.image} alt={p.name} fill priority sizes="50vw" className="object-cover" /> : <ProductArt category={p.category} hue={p.hue} className="h-full w-full" />}
        </div>
        <div className="lg:py-8">
          <p className="eyebrow"><Link href="/shop" className="hover:text-paper">Shop</Link> / {p.category}</p>
          <h1 className="display mt-4 text-[clamp(44px,6vw,88px)]">{p.name}</h1>
          <p className="mt-3 text-lg text-paper/60">{p.short}</p>
          <div className="mt-8 flex items-baseline gap-3">
            <span className="display text-5xl">{money(p.price, cur)}</span>
            {p.comparePrice > p.price && <span className="text-mist line-through">{money(p.comparePrice, cur)}</span>}
            {p.comparePrice > p.price && <span className="rounded-full bg-accent/15 px-2.5 py-1 text-xs text-accent">Save {money(p.comparePrice - p.price, cur)}</span>}
          </div>
          <p className={`mt-3 text-sm ${p.stock > 5 ? "text-emerald-300" : "text-amber-300"}`}>{p.stock > 5 ? "In stock · ships in 48 hours" : p.stock > 0 ? `Only ${p.stock} left` : "Sold out"}</p>
          <AddToCart p={{ productId: p.id, name: p.name, price: p.price, hue: p.hue, category: p.category, image: p.image }} disabled={p.stock === 0} />
          <dl className="mt-10 grid grid-cols-2 gap-3 text-sm">
            {[["Planet", p.planet], ["Category", p.category], ["Benefits", p.benefits], ["Certification", "Govt. approved lab"]].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-paper/10 p-4"><dt className="text-mist">{k}</dt><dd className="mt-1">{v}</dd></div>
            ))}
          </dl>
          <div className="prose-astro mt-10"><p>{p.description}</p></div>
          <div className="mt-6 rounded-3xl border border-accent/25 bg-accent/[0.05] p-5 text-sm text-paper/75">
            Not sure this suits your chart? <Link href={`/book?service=${encodeURIComponent("Gemstone Prescription")}`} className="text-accent underline-offset-4 hover:underline">Get a gemstone prescription</Link> before you buy.
          </div>
        </div>
      </section>
      {related.length > 0 && (
        <section className="container-x pb-24">
          <p className="eyebrow mb-8">You may also like</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
            {related.map((r) => <ProductCard key={r.id} p={r} currency={cur} />)}
          </div>
        </section>
      )}
    </>
  );
}
