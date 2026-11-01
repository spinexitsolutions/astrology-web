"use client";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { panchang } from "@/lib/astro";
import type { NavItem, SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useCart } from "./Cart";
import { useLenis } from "./SmoothScroll";
import ZodiacWheel from "./ZodiacWheel";

const EASE = [0.16, 1, 0.3, 1] as const;

function Logo({ glyph, brand, progress }: { glyph: string; brand: string; progress: ReturnType<typeof useSpring> }) {
  return (
    <Link href="/" className="group relative flex items-center gap-2.5 pl-1.5" aria-label={`${brand} home`}>
      <span className="relative grid h-9 w-9 place-items-center">
        <svg viewBox="0 0 40 40" className="absolute inset-0 -rotate-90">
          <circle cx="20" cy="20" r="18" fill="none" stroke="rgba(243,238,229,.12)" strokeWidth="1.5" />
          <motion.circle cx="20" cy="20" r="18" fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" style={{ pathLength: progress }} />
        </svg>
        <span className="text-[15px] text-accent transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[180deg]">{glyph}</span>
        <span className="absolute inset-0 animate-[spin_6s_linear_infinite]">
          <span className="absolute -top-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-paper" />
        </span>
      </span>
      <span className="font-display text-[22px] leading-none tracking-tight">{brand}</span>
    </Link>
  );
}

function MenuButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="relative grid h-10 w-10 place-items-center rounded-full bg-paper text-ink transition-transform duration-500 hover:scale-105 active:scale-95"
    >
      <motion.span className="absolute h-[1.5px] w-4 rounded bg-ink" animate={open ? { rotate: 45, y: 0 } : { rotate: 0, y: -3.5 }} transition={{ duration: 0.5, ease: EASE }} />
      <motion.span className="absolute h-[1.5px] w-4 rounded bg-ink" animate={open ? { rotate: -45, y: 0, width: 16 } : { rotate: 0, y: 3.5, width: 10 }} transition={{ duration: 0.5, ease: EASE }} />
    </button>
  );
}

function FullMenu({ items, settings, onClose }: { items: NavItem[]; settings: SiteSettings; onClose: () => void }) {
  const [hover, setHover] = useState(0);
  const pathname = usePathname();
  const today = useMemo(() => {
    const p = panchang(new Date());
    return `${p.tithi.paksha} ${p.tithi.name} · ${p.nakshatra.name}`;
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[90] overflow-hidden bg-ink"
      initial={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
      animate={{ clipPath: "inset(0 0 0% 0 round 0 0 0px 0px)" }}
      exit={{ clipPath: "inset(0 0 100% 0 round 0 0 40px 40px)" }}
      transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1] }}
      data-lenis-prevent
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_80%_60%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_55%)]" />
      <motion.div
        className="pointer-events-none absolute -bottom-[30vmax] -right-[30vmax] h-[90vmax] w-[90vmax] text-paper/25 md:-right-[20vmax]"
        animate={{ rotate: -hover * 30 }}
        transition={{ type: "spring", stiffness: 40, damping: 16 }}
      >
        <ZodiacWheel className="h-full w-full" />
      </motion.div>

      <div className="container-x relative flex h-full flex-col pb-8 pt-28 md:pt-32">
        <nav className="no-scrollbar -mx-2 flex-1 overflow-y-auto px-2">
          <ul className="grid gap-x-16 md:grid-cols-2">
            {items.map((it, i) => {
              const active = pathname === it.href || (it.href !== "/" && pathname.startsWith(it.href));
              return (
                <li key={it.id} className="overflow-hidden border-b border-paper/10">
                  <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.04 }}>
                    <Link
                      href={it.href}
                      onClick={onClose}
                      onMouseEnter={() => setHover(i)}
                      className="group flex items-baseline gap-4 py-3.5 md:py-4"
                    >
                      <span className="w-7 font-mono text-[11px] text-mist">{String(i + 1).padStart(2, "0")}</span>
                      <span className={cn("display text-[clamp(34px,6.5vw,64px)] transition-all duration-500 group-hover:translate-x-3 group-hover:italic", active ? "text-accent" : "text-paper")}>
                        {it.label}
                      </span>
                      <span className="ml-auto hidden translate-x-2 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-mist opacity-0 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100 sm:block">
                        {it.hint}
                      </span>
                    </Link>
                  </motion.div>
                </li>
              );
            })}
          </ul>
        </nav>
        <motion.div
          className="mt-8 grid gap-6 text-sm text-paper/70 sm:grid-cols-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ delay: 0.6, duration: 0.8, ease: EASE }}
        >
          <div>
            <p className="eyebrow mb-2">Today</p>
            <p>{today}</p>
          </div>
          <div>
            <p className="eyebrow mb-2">Talk to us</p>
            <a href={`tel:${settings.contact.phone}`} className="block hover:text-paper">{settings.contact.phone}</a>
            <a href={`mailto:${settings.contact.email}`} className="block hover:text-paper">{settings.contact.email}</a>
          </div>
          <div className="flex items-end sm:justify-end">
            <Link href={settings.navCta.href} onClick={onClose} className="btn btn-accent">
              {settings.navCta.label} <ArrowUpRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Navbar({ settings }: { settings: SiteSettings }) {
  const pathname = usePathname();
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [hoverLink, setHoverLink] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const cart = useCart();
  const lenis = useLenis();

  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 80);
    setHidden(y > 600 && y > prev + 4 && !open);
    if (y < prev - 4) setHidden(false);
  });

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (open) lenis?.stop();
    else lenis?.start();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, lenis]);

  const compact = scrolled && !hovered && !open;
  const inline = settings.nav.slice(0, 5);
  const current = settings.nav.find((n) => pathname.startsWith(n.href))?.label ?? (pathname === "/" ? "Home" : pathname.split("/")[1]?.replace(/-/g, " "));

  return (
    <>
      <motion.header
        className="pointer-events-none fixed inset-x-0 top-0 z-[100] flex justify-center px-3 pt-3 md:pt-4"
        animate={{ y: hidden ? -110 : !scrolled && settings.announcement.enabled ? 36 : 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <motion.div
          layout
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          transition={{ layout: { type: "spring", stiffness: 260, damping: 30 } }}
          className={cn(
            "pointer-events-auto relative flex h-14 items-center gap-2 rounded-full p-2 pr-2",
            open ? "bg-transparent" : "glass shadow-[0_20px_60px_-20px_rgba(0,0,0,.8)]",
            compact ? "w-[min(100%,460px)]" : "w-[min(100%,1180px)]"
          )}
          style={{ borderRadius: 999 }}
        >
          <Logo glyph={settings.logoGlyph} brand={settings.brandName} progress={progress} />

          {/* Center: links (expanded) or live label (compact) */}
          <div className="relative mx-auto hidden h-full min-w-0 flex-1 items-center justify-center lg:flex">
            <AnimatePresence mode="popLayout" initial={false}>
              {compact ? (
                <motion.div
                  key="label"
                  initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                  className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-mist"
                >
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent" />
                  {current}
                </motion.div>
              ) : (
                !open && (
                  <motion.ul
                    key="links"
                    className="flex items-center"
                    initial={{ opacity: 0, filter: "blur(6px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(6px)" }}
                    transition={{ duration: 0.4 }}
                    onMouseLeave={() => setHoverLink(null)}
                  >
                    {inline.map((it) => {
                      const active = pathname.startsWith(it.href);
                      return (
                        <li key={it.id} className="relative">
                          <Link href={it.href} onMouseEnter={() => setHoverLink(it.id)} className={cn("relative z-10 block px-4 py-2 text-[14px] transition-colors", active ? "text-paper" : "text-paper/65 hover:text-paper")}>
                            {it.label}
                            {active && <motion.span layoutId="nav-active" className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-accent" />}
                          </Link>
                          {hoverLink === it.id && <motion.span layoutId="nav-hover" className="absolute inset-0 rounded-full bg-paper/[0.08]" transition={{ type: "spring", stiffness: 400, damping: 32 }} />}
                        </li>
                      );
                    })}
                  </motion.ul>
                )
              )}
            </AnimatePresence>
          </div>

          <div className="ml-auto flex items-center gap-1.5 lg:ml-0">
            <button
              onClick={() => cart.setOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full text-paper/80 transition hover:bg-paper/10 hover:text-paper"
              aria-label="Open cart"
            >
              <ShoppingBag size={18} strokeWidth={1.6} />
              <AnimatePresence>
                {cart.count > 0 && (
                  <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-accent px-1 text-[10px] font-semibold text-ink">
                    {cart.count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <AnimatePresence initial={false}>
              {!compact && !open && (
                <motion.div initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} transition={{ duration: 0.5, ease: EASE }} className="hidden overflow-hidden sm:block">
                  <Link href={settings.navCta.href} className="btn btn-accent whitespace-nowrap !px-5 !py-2.5 text-[14px]">
                    {settings.navCta.label}
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
            <MenuButton open={open} onClick={() => setOpen((v) => !v)} />
          </div>
        </motion.div>
      </motion.header>

      <AnimatePresence>{open && <FullMenu items={settings.nav} settings={settings} onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}
