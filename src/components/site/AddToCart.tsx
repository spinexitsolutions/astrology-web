"use client";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { useCart, type CartLine } from "./Cart";

export default function AddToCart({ p, disabled }: { p: Omit<CartLine, "qty">; disabled?: boolean }) {
  const [qty, setQty] = useState(1);
  const cart = useCart();
  return (
    <div className="mt-8 flex gap-3">
      <div className="flex items-center gap-1 rounded-full border border-paper/15 p-1.5">
        <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="grid h-10 w-10 place-items-center rounded-full hover:bg-paper/10" aria-label="Decrease"><Minus size={16} /></button>
        <span className="w-8 text-center tabular-nums">{qty}</span>
        <button onClick={() => setQty((q) => q + 1)} className="grid h-10 w-10 place-items-center rounded-full hover:bg-paper/10" aria-label="Increase"><Plus size={16} /></button>
      </div>
      <button disabled={disabled} onClick={() => cart.add(p, qty)} className="btn btn-accent flex-1 disabled:opacity-40">
        <ShoppingBag size={17} /> Add to bag
      </button>
    </div>
  );
}
