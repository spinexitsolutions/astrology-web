"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck, CircleHelp, ExternalLink, Gem, Inbox, LayoutDashboard, LogOut, Mail, Menu, PenLine, Quote, Settings, ShoppingBag, Sparkles, Sun, UserRound, Users, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { ToastProvider } from "./ui";

const GROUPS = [
  { label: "Overview", items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }] },
  {
    label: "CRM",
    items: [
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
      { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
      { href: "/admin/subscribers", label: "Subscribers", icon: Mail },
    ],
  },
  {
    label: "CMS",
    items: [
      { href: "/admin/services", label: "Services", icon: Sparkles },
      { href: "/admin/astrologers", label: "Astrologers", icon: UserRound },
      { href: "/admin/products", label: "Products", icon: Gem },
      { href: "/admin/posts", label: "Journal", icon: PenLine },
      { href: "/admin/horoscopes", label: "Horoscopes", icon: Sun },
      { href: "/admin/testimonials", label: "Testimonials", icon: Quote },
      { href: "/admin/faqs", label: "FAQs", icon: CircleHelp },
    ],
  },
  { label: "Settings", items: [{ href: "/admin/settings", label: "Site & Intro", icon: Settings }] },
];

function Nav({ brand, glyph, onNavigate }: { brand: string; glyph: string; onNavigate?: () => void }) {
  const path = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <div className="flex h-full flex-col">
      <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3 px-5 pb-6 pt-6">
        <span className="grid size-10 place-items-center rounded-2xl bg-neutral-900 text-lg text-[#FF5A1F] shadow-[0_8px_20px_-8px_rgba(0,0,0,0.5)]">{glyph}</span>
        <span>
          <span className="block font-display text-2xl leading-none tracking-tight">{brand}</span>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">Studio</span>
        </span>
      </Link>
      <nav className="flex-1 space-y-6 overflow-y-auto px-3 pb-4">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <div className="mb-1.5 px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-neutral-400">{g.label}</div>
            {g.items.map((it) => {
              const active = it.href === "/admin" ? path === "/admin" : path.startsWith(it.href);
              const Icon = it.icon;
              return (
                <Link key={it.href} href={it.href} onClick={onNavigate} className="relative flex items-center gap-3 rounded-xl px-3 py-2 text-[14px]">
                  {active && <motion.span layoutId="nav-active" className="absolute inset-0 rounded-xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]" transition={{ type: "spring", stiffness: 500, damping: 40 }} />}
                  <Icon className={cn("relative size-[17px]", active ? "text-[#C9963F]" : "text-neutral-400")} />
                  <span className={cn("relative", active ? "font-medium text-neutral-900" : "text-neutral-600")}>{it.label}</span>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="space-y-1 border-t border-black/[0.06] p-3">
        <a href="/" target="_blank" className="flex items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-neutral-600 hover:bg-black/[0.04]">
          <ExternalLink className="size-[17px] text-neutral-400" /> View website
        </a>
        <button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] text-neutral-600 hover:bg-black/[0.04]">
          <LogOut className="size-[17px] text-neutral-400" /> Log out
        </button>
      </div>
    </div>
  );
}

export function AdminShell({ children, brand, glyph }: { children: React.ReactNode; brand: string; glyph: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  useEffect(() => setOpen(false), [path]);

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 [color-scheme:light]">
        {/* desktop sidebar */}
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] border-r border-black/[0.06] bg-[#F0F0F3]/80 backdrop-blur-xl lg:block">
          <Nav brand={brand} glyph={glyph} />
        </aside>

        {/* mobile top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-black/[0.06] bg-[#F5F5F7]/80 px-4 py-3 backdrop-blur-xl lg:hidden">
          <Link href="/admin" className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-xl bg-neutral-900 text-[#FF5A1F]">{glyph}</span>
            <span className="font-display text-xl">{brand} Studio</span>
          </Link>
          <button onClick={() => setOpen(true)} className="grid size-10 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/5" aria-label="Open menu">
            <Menu className="size-5" />
          </button>
        </header>

        <AnimatePresence>
          {open && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
              <motion.aside
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 340, damping: 36 }}
                className="absolute inset-y-0 left-0 w-[82%] max-w-[300px] bg-[#F0F0F3] shadow-2xl"
              >
                <button onClick={() => setOpen(false)} className="absolute right-3 top-5 grid size-9 place-items-center rounded-full bg-black/5" aria-label="Close menu">
                  <X className="size-4" />
                </button>
                <Nav brand={brand} glyph={glyph} onNavigate={() => setOpen(false)} />
              </motion.aside>
            </div>
          )}
        </AnimatePresence>

        <main className="lg:pl-[264px]">
          <motion.div key={path} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="mx-auto max-w-[1240px] px-4 py-6 sm:px-8 sm:py-10">
            {children}
          </motion.div>
        </main>
      </div>
    </ToastProvider>
  );
}
