"use client";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus, X } from "lucide-react";
import Link from "next/link";
import { money } from "@/lib/utils";
import { useCart } from "./Cart";
import ProductArt from "./ProductArt";

export default function CartDrawer({ currency }: { currency: string }) {
  const c = useCart();
  return (
    <AnimatePresence>
      {c.open && (
        <>
          <motion.div className="fixed inset-0 z-[150] bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => c.setOpen(false)} />
          <motion.aside
            className="fixed bottom-0 right-0 top-0 z-[151] flex w-full max-w-md flex-col border-l border-paper/10 bg-ink-2"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            data-lenis-prevent
          >
            <div className="flex items-center justify-between border-b border-paper/10 p-5">
              <p className="display text-3xl">Your bag</p>
              <button onClick={() => c.setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-paper/10" aria-label="Close cart">
                <X size={18} />
              </button>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-5">
              {c.lines.length === 0 && (
                <div className="py-20 text-center">
                  <p className="display text-2xl italic text-paper/60">Your bag is as empty as Amavasya.</p>
                  <Link href="/shop" onClick={() => c.setOpen(false)} className="btn btn-ghost mt-6">Explore the shop</Link>
                </div>
              )}
              {c.lines.map((l) => (
                <motion.div layout key={l.productId} className="flex gap-4 rounded-2xl border border-paper/10 p-3">
                  <ProductArt category={l.category} hue={l.hue} className="h-20 w-20 shrink-0 rounded-xl" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="truncate text-[15px]">{l.name}</p>
                    <p className="text-sm text-mist">{money(l.price, currency)}</p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex items-center gap-1 rounded-full border border-paper/15 p-1">
                        <button className="grid h-7 w-7 place-items-center rounded-full hover:bg-paper/10" onClick={() => c.setQty(l.productId, l.qty - 1)} aria-label="Decrease"><Minus size={14} /></button>
                        <span className="w-6 text-center text-sm tabular-nums">{l.qty}</span>
                        <button className="grid h-7 w-7 place-items-center rounded-full hover:bg-paper/10" onClick={() => c.setQty(l.productId, l.qty + 1)} aria-label="Increase"><Plus size={14} /></button>
                      </div>
                      <button className="text-xs text-mist underline-offset-4 hover:text-paper hover:underline" onClick={() => c.remove(l.productId)}>Remove</button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            {c.lines.length > 0 && (
              <div className="border-t border-paper/10 p-5">
                <div className="mb-4 flex items-baseline justify-between">
                  <span className="text-mist">Subtotal</span>
                  <span className="display text-3xl">{money(c.total, currency)}</span>
                </div>
                <Link href="/checkout" onClick={() => c.setOpen(false)} className="btn btn-accent w-full">Checkout</Link>
                <p className="mt-3 text-center text-xs text-mist">Free energisation & insured shipping across India</p>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
