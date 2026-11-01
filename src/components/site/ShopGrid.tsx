"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ProductCard } from "./home/ShopPreview";

export default function ShopGrid({ products, currency }: { products: Product[]; currency: string }) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(products.map((p) => p.category)))], [products]);
  const [cat, setCat] = useState("All");
  const [sort, setSort] = useState("featured");
  const list = useMemo(() => {
    const l = products.filter((p) => cat === "All" || p.category === cat);
    if (sort === "low") l.sort((a, b) => a.price - b.price);
    else if (sort === "high") l.sort((a, b) => b.price - a.price);
    else l.sort((a, b) => Number(b.featured) - Number(a.featured));
    return l;
  }, [products, cat, sort]);

  return (
    <>
      <div className="mb-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div className="no-scrollbar -mx-5 flex gap-2 overflow-x-auto px-5 md:mx-0 md:px-0">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} className={cn("relative shrink-0 rounded-full px-4 py-2 text-sm transition", cat === c ? "text-ink" : "text-paper/70 hover:text-paper")}>
              {cat === c && <motion.span layoutId="shopcat" className="absolute inset-0 -z-0 rounded-full bg-paper" />}
              <span className="relative">{c}</span>
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="field !w-auto !rounded-full !py-2.5" aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <motion.div layout className="grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 xl:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((p) => (
            <motion.div key={p.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.4 }}>
              <ProductCard p={p} currency={currency} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
