"use client";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { cn, money } from "@/lib/utils";
import { useCart } from "./Cart";
import ProductArt from "./ProductArt";

export default function Checkout({ currency }: { currency: string }) {
  const cart = useCart();
  const [f, setF] = useState({ name: "", phone: "", email: "", address: "", payment: "UPI" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [orderId, setOrderId] = useState("");
  const [err, setErr] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    const r = await fetch("/api/public/order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...f, items: cart.lines.map((l) => ({ productId: l.productId, qty: l.qty })) }),
    });
    const j = await r.json();
    if (r.ok) {
      setOrderId(j.id);
      cart.clear();
      setState("done");
    } else {
      setErr(j.error || "Something went wrong");
      setState("error");
    }
  }

  if (state === "done")
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl rounded-[32px] border border-accent/30 bg-ink-2 p-10">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-accent text-ink"><Check size={30} /></div>
        <p className="display mt-6 text-5xl">Order placed.</p>
        <p className="mt-3 text-paper/65">Order <span className="font-mono text-paper">#{orderId.slice(-6).toUpperCase()}</span> is confirmed. Your items will be energised on the next auspicious muhurat and shipped with tracking on WhatsApp.</p>
        <Link href="/shop" className="btn btn-ghost mt-8">Continue shopping</Link>
      </motion.div>
    );

  if (!cart.lines.length)
    return (
      <div className="rounded-[32px] border border-dashed border-paper/15 p-12 text-center">
        <p className="display text-3xl italic text-paper/60">Your bag is empty.</p>
        <Link href="/shop" className="btn btn-primary mt-6">Visit the shop</Link>
      </div>
    );

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1.3fr_1fr]">
      <div className="grid gap-3 sm:grid-cols-2">
        <p className="eyebrow sm:col-span-2">Shipping details</p>
        <input required className="field" placeholder="Full name" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} aria-label="Full name" />
        <input required className="field" placeholder="Phone / WhatsApp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} aria-label="Phone" />
        <input className="field sm:col-span-2" type="email" placeholder="Email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} aria-label="Email" />
        <textarea required className="field min-h-28 sm:col-span-2" placeholder="Full address with PIN code" value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} aria-label="Address" />
        <p className="eyebrow mt-6 sm:col-span-2">Payment</p>
        <div className="grid grid-cols-3 gap-2 sm:col-span-2">
          {["UPI", "Card", "COD"].map((m) => (
            <button type="button" key={m} onClick={() => setF({ ...f, payment: m })} className={cn("rounded-2xl border py-4 text-sm transition", f.payment === m ? "border-accent bg-accent/[0.08]" : "border-paper/10 hover:border-paper/30")}>
              {m === "COD" ? "Cash on delivery" : m}
            </button>
          ))}
        </div>
        {state === "error" && <p className="text-sm text-red-300 sm:col-span-2">{err}</p>}
      </div>
      <aside className="h-fit rounded-[28px] border border-paper/10 bg-ink-2 p-6 lg:sticky lg:top-28">
        <p className="eyebrow mb-5">Order summary</p>
        <div className="space-y-4">
          {cart.lines.map((l) => (
            <div key={l.productId} className="flex items-center gap-3">
              <ProductArt category={l.category} hue={l.hue} className="h-14 w-14 rounded-xl" />
              <div className="min-w-0 flex-1"><p className="truncate text-sm">{l.name}</p><p className="text-xs text-mist">Qty {l.qty}</p></div>
              <p className="text-sm">{money(l.price * l.qty, currency)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 border-t border-paper/10 pt-4 text-sm">
          <p className="flex justify-between"><span className="text-mist">Subtotal</span><span>{money(cart.total, currency)}</span></p>
          <p className="flex justify-between"><span className="text-mist">Shipping & energisation</span><span className="text-emerald-300">Free</span></p>
        </div>
        <div className="mt-4 flex items-baseline justify-between"><span>Total</span><span className="display text-4xl">{money(cart.total, currency)}</span></div>
        <button disabled={state === "loading"} className="btn btn-accent mt-6 w-full">{state === "loading" ? "Placing order…" : "Place order"}</button>
      </aside>
    </form>
  );
}
