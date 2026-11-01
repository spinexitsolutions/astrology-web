"use client";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

export type CartLine = { productId: string; name: string; price: number; qty: number; hue: number; category: string; image: string };
type Ctx = {
  lines: CartLine[];
  count: number;
  total: number;
  add: (l: Omit<CartLine, "qty">, qty?: number) => void;
  setQty: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
  open: boolean;
  setOpen: (v: boolean) => void;
};

const CartCtx = createContext<Ctx | null>(null);
export const useCart = () => useContext(CartCtx)!;
const KEY = "taarak-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(KEY, JSON.stringify(lines));
    } catch {}
  }, [lines, ready]);

  const add = useCallback((l: Omit<CartLine, "qty">, qty = 1) => {
    setLines((prev) => {
      const ex = prev.find((x) => x.productId === l.productId);
      if (ex) return prev.map((x) => (x.productId === l.productId ? { ...x, qty: x.qty + qty } : x));
      return [...prev, { ...l, qty }];
    });
    setOpen(true);
  }, []);
  const setQty = useCallback((id: string, qty: number) => setLines((p) => p.map((x) => (x.productId === id ? { ...x, qty: Math.max(1, qty) } : x))), []);
  const remove = useCallback((id: string) => setLines((p) => p.filter((x) => x.productId !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({ lines, add, setQty, remove, clear, open, setOpen, count: lines.reduce((a, x) => a + x.qty, 0), total: lines.reduce((a, x) => a + x.qty * x.price, 0) }),
    [lines, add, setQty, remove, clear, open]
  );
  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}
