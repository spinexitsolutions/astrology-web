"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Loader2, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/* ───────── Toasts ───────── */

type Toast = { id: number; text: string; tone: "ok" | "err" };
const ToastCtx = createContext<(text: string, tone?: "ok" | "err") => void>(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = useCallback((text: string, tone: "ok" | "err" = "ok") => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[100] flex flex-col items-center gap-2 px-4">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={cn(
                "pointer-events-auto flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium shadow-xl",
                t.tone === "ok" ? "bg-neutral-900 text-white" : "bg-red-600 text-white"
              )}
            >
              {t.tone === "ok" ? <Check className="size-4 text-emerald-400" /> : <X className="size-4" />}
              {t.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
}

/* ───────── Primitives ───────── */

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("rounded-[22px] border border-black/[0.05] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(0,0,0,0.08)]", className)}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions, eyebrow }: { title: string; subtitle?: string; actions?: React.ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
      <div>
        {eyebrow && <div className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-[#B8873A]">{eyebrow}</div>}
        <h1 className="font-display text-4xl leading-none tracking-tight text-neutral-900 sm:text-5xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-neutral-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "danger" | "gold"; size?: "sm" | "md"; loading?: boolean };
export function Button({ variant = "primary", size = "md", loading, className, children, disabled, ...rest }: BtnProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none",
        size === "sm" ? "h-8 px-3.5 text-[13px]" : "h-10 px-5 text-sm",
        variant === "primary" && "bg-neutral-900 text-white hover:bg-neutral-700",
        variant === "gold" && "bg-[#C9963F] text-white hover:bg-[#B8873A] shadow-[0_6px_20px_-8px_#C9963F]",
        variant === "secondary" && "bg-white text-neutral-900 ring-1 ring-black/10 hover:bg-neutral-50",
        variant === "ghost" && "text-neutral-600 hover:bg-black/[0.05] hover:text-neutral-900",
        variant === "danger" && "bg-red-50 text-red-600 hover:bg-red-100",
        className
      )}
    >
      {loading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  );
}

const TONES: Record<string, string> = {
  new: "bg-sky-50 text-sky-700 ring-sky-200",
  contacted: "bg-violet-50 text-violet-700 ring-violet-200",
  qualified: "bg-amber-50 text-amber-700 ring-amber-200",
  converted: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  lost: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  pending: "bg-amber-50 text-amber-700 ring-amber-200",
  confirmed: "bg-sky-50 text-sky-700 ring-sky-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  cancelled: "bg-red-50 text-red-600 ring-red-200",
  placed: "bg-sky-50 text-sky-700 ring-sky-200",
  processing: "bg-amber-50 text-amber-700 ring-amber-200",
  shipped: "bg-violet-50 text-violet-700 ring-violet-200",
  delivered: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  paid: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  unpaid: "bg-neutral-100 text-neutral-500 ring-neutral-200",
  published: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  draft: "bg-neutral-100 text-neutral-500 ring-neutral-200",
};
export function Badge({ tone, children }: { tone: string; children?: React.ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[11px] font-medium capitalize ring-1 ring-inset", TONES[tone] ?? "bg-neutral-100 text-neutral-600 ring-neutral-200")}>
      {children ?? tone}
    </span>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="inline-flex items-center gap-2.5" aria-pressed={checked}>
      <span className={cn("relative h-[26px] w-[44px] shrink-0 rounded-full transition-colors duration-300", checked ? "bg-[#34C759]" : "bg-neutral-200")}>
        <motion.span layout transition={{ type: "spring", stiffness: 600, damping: 35 }} className={cn("absolute top-[2px] size-[22px] rounded-full bg-white shadow-md", checked ? "right-[2px]" : "left-[2px]")} />
      </span>
      {label && <span className="text-sm text-neutral-700">{label}</span>}
    </button>
  );
}

export const inputCls =
  "w-full rounded-xl border border-black/10 bg-white px-3.5 py-2.5 text-sm text-neutral-900 outline-none transition placeholder:text-neutral-400 focus:border-[#C9963F] focus:ring-4 focus:ring-[#C9963F]/15";

export function Label({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-2">
      <span className="text-[13px] font-medium text-neutral-700">{children}</span>
      {hint && <span className="text-[11px] text-neutral-400">{hint}</span>}
    </div>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn(inputCls, props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea rows={4} {...props} className={cn(inputCls, "resize-y leading-relaxed", props.className)} />;
}
export function Select({ options, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { options: (string | { value: string; label: string })[] }) {
  return (
    <select {...props} className={cn(inputCls, "appearance-none bg-[url('data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20fill=%22none%22%20stroke=%22%23999%22%20stroke-width=%221.5%22%3E%3Cpath%20d=%22M2%204l4%204%204-4%22/%3E%3C/svg%3E')] bg-[length:12px] bg-[right_14px_center] bg-no-repeat pr-9", props.className)}>
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return (
          <option key={v} value={v}>
            {l}
          </option>
        );
      })}
    </select>
  );
}

/* ───────── Drawer (slide-over) ───────── */

export function Drawer({ open, onClose, title, children, footer, wide }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; footer?: React.ReactNode; wide?: boolean }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 36 }}
            className={cn("absolute inset-y-0 right-0 flex w-full flex-col bg-[#FBFBFD] shadow-2xl", wide ? "max-w-2xl" : "max-w-xl")}
          >
            <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4 sm:px-7">
              <h2 className="font-display text-2xl tracking-tight">{title}</h2>
              <button onClick={onClose} className="grid size-9 place-items-center rounded-full bg-black/[0.05] text-neutral-600 hover:bg-black/10" aria-label="Close">
                <X className="size-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-6 sm:px-7">{children}</div>
            {footer && <div className="flex items-center justify-end gap-2 border-t border-black/[0.06] bg-white px-5 py-4 sm:px-7">{footer}</div>}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}

export function Empty({ text }: { text: string }) {
  return <div className="rounded-2xl border border-dashed border-black/10 p-10 text-center text-sm text-neutral-400">{text}</div>;
}

export function Segmented<T extends string>({ value, onChange, options }: { value: T; onChange: (v: T) => void; options: { value: T; label: string; count?: number }[] }) {
  return (
    <div className="no-scrollbar flex max-w-full gap-1 overflow-x-auto rounded-full bg-black/[0.05] p-1">
      {options.map((o) => (
        <button key={o.value} onClick={() => onChange(o.value)} className="relative shrink-0 rounded-full px-3.5 py-1.5 text-[13px] font-medium">
          {value === o.value && <motion.span layoutId={`seg-${options.map((x) => x.value).join("")}`} className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
          <span className={cn("relative capitalize", value === o.value ? "text-neutral-900" : "text-neutral-500")}>
            {o.label}
            {o.count !== undefined && <span className="ml-1.5 text-neutral-400">{o.count}</span>}
          </span>
        </button>
      ))}
    </div>
  );
}

/* ───────── fetch helper ───────── */

export async function api<T = unknown>(url: string, method = "GET", body?: unknown): Promise<T> {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined });
  if (res.status === 401) {
    window.location.href = "/admin/login";
    throw new Error("Unauthorized");
  }
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || "Request failed");
  return res.json();
}
