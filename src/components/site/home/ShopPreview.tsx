"use client";
import { ArrowUpRight, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { money } from "@/lib/utils";
import { useCart } from "../Cart";
import ProductArt from "../ProductArt";
import { Reveal } from "../Reveal";

export function ProductCard({ p, currency }: { p: Product; currency: string }) {
  const cart = useCart();
  const off = p.comparePrice > p.price ? Math.round((1 - p.price / p.comparePrice) * 100) : 0;
  return (
    <div className="group relative">
      <Link href={`/shop/${p.slug}`} className="relative block aspect-square overflow-hidden rounded-[28px] border border-paper/10">
        {p.image ? (
          <Image src={p.image} alt={p.name} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition duration-[1.2s] group-hover:scale-105" />
        ) : (
          <ProductArt category={p.category} hue={p.hue} className="h-full w-full transition duration-[1.2s] ease-[var(--ease-out-expo)] group-hover:scale-110" />
        )}
        {off > 0 && <span className="absolute left-3 top-3 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-ink">−{off}%</span>}
        <span className="absolute right-3 top-3 rounded-full bg-ink/60 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-paper/80 backdrop-blur">{p.planet}</span>
      </Link>
      <button
        onClick={() => cart.add({ productId: p.id, name: p.name, price: p.price, hue: p.hue, category: p.category, image: p.image })}
        className="absolute bottom-[88px] right-3 grid h-11 w-11 translate-y-2 place-items-center rounded-full bg-paper text-ink opacity-0 shadow-xl transition duration-500 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-100 max-md:translate-y-0 max-md:opacity-100"
        aria-label={`Add ${p.name} to bag`}
      >
        <Plus size={18} />
      </button>
      <div className="mt-4 flex items-start justify-between gap-3 px-1">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-mist">{p.category}</p>
          <Link href={`/shop/${p.slug}`} className="mt-1 block truncate text-[16px] hover:text-accent">{p.name}</Link>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[16px]">{money(p.price, currency)}</p>
          {off > 0 && <p className="text-xs text-mist line-through">{money(p.comparePrice, currency)}</p>}
        </div>
      </div>
    </div>
  );
}

export default function ShopPreview({ products, currency }: { products: Product[]; currency: string }) {
  return (
    <section className="container-x py-24 md:py-36">
      <Reveal className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="eyebrow mb-4">The remedy shop</p>
          <h2 className="display text-[clamp(44px,7vw,104px)]">Energised <em className="text-gold">in Kashi.</em></h2>
        </div>
        <Link href="/shop" className="btn btn-ghost self-start md:self-auto">Shop all <ArrowUpRight size={16} /></Link>
      </Reveal>
      <div className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {products.slice(0, 4).map((p, i) => (
          <Reveal key={p.id} delay={i * 0.07}><ProductCard p={p} currency={currency} /></Reveal>
        ))}
      </div>
    </section>
  );
}
