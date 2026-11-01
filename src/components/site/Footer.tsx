import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { SiteSettings } from "@/lib/types";
import NewsletterForm from "./NewsletterForm";

export default function Footer({ settings }: { settings: SiteSettings }) {
  const cols = [
    { title: "Explore", links: settings.nav.slice(0, 5) },
    { title: "Discover", links: settings.nav.slice(5) },
  ];
  const socials = Object.entries(settings.socials).filter(([, v]) => v);
  return (
    <footer className="night relative overflow-hidden pt-20">
      <div className="container-x grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <p className="display text-4xl">{settings.brandName}<span className="text-accent">{settings.logoGlyph}</span></p>
          <p className="mt-3 max-w-xs text-paper/60">{settings.brandTagline}</p>
          <div className="mt-8 max-w-sm">
            <p className="eyebrow mb-3">Weekly horoscope in your inbox</p>
            <NewsletterForm compact />
          </div>
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <p className="eyebrow mb-5">{c.title}</p>
            <ul className="space-y-3">
              {c.links.map((l) => (
                <li key={l.id}>
                  <Link href={l.href} className="group inline-flex items-center gap-1 text-paper/75 transition hover:text-paper">
                    {l.label}
                    <ArrowUpRight size={14} className="opacity-0 transition group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
              {c.title === "Discover" && (
                <li><Link href="/contact" className="text-paper/75 hover:text-paper">Contact</Link></li>
              )}
            </ul>
          </div>
        ))}
        <div>
          <p className="eyebrow mb-5">Visit · Call</p>
          <address className="space-y-3 not-italic text-paper/75">
            <p>{settings.contact.address}</p>
            <p><a href={`tel:${settings.contact.phone}`} className="hover:text-paper">{settings.contact.phone}</a></p>
            <p><a href={`mailto:${settings.contact.email}`} className="hover:text-paper">{settings.contact.email}</a></p>
            <p className="text-sm text-mist">{settings.contact.hours}</p>
          </address>
          <div className="mt-6 flex flex-wrap gap-2">
            {socials.map(([k, v]) => (
              <a key={k} href={v} target="_blank" rel="noreferrer" className="rounded-full border border-paper/15 px-3.5 py-1.5 text-xs capitalize text-paper/70 transition hover:border-paper/50 hover:text-paper">
                {k}
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="container-x mt-16 flex flex-col gap-3 border-t border-paper/10 py-6 text-xs text-mist md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} {settings.brandName}. {settings.footerNote}</p>
        <div className="flex gap-5">
          <Link href="/contact" className="hover:text-paper">Privacy</Link>
          <Link href="/contact" className="hover:text-paper">Terms</Link>
          <Link href="/admin" className="hover:text-paper">Admin</Link>
        </div>
      </div>

      <div aria-hidden className="pointer-events-none select-none overflow-hidden">
        <p className="display translate-y-[22%] whitespace-nowrap text-center text-[25vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(243,238,229,.14)]">
          {settings.brandName}
        </p>
      </div>
    </footer>
  );
}
