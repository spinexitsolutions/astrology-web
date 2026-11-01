import Link from "next/link";
import { CartProvider } from "@/components/site/Cart";
import CartDrawer from "@/components/site/CartDrawer";
import Footer from "@/components/site/Footer";
import Intro from "@/components/site/Intro";
import Navbar from "@/components/site/Navbar";
import SmoothScroll from "@/components/site/SmoothScroll";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  const vars = `:root{--accent:${s.accent};--accent-2:${s.accentSecondary};}`;
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: vars }} />
      <SmoothScroll>
        <CartProvider>
          <Intro settings={s.intro} brand={s.brandName} />
          {s.announcement.enabled && (
            <Link href={s.announcement.href || "#"} className="relative z-[50] block bg-accent px-4 py-2 text-center text-[13px] font-medium text-ink">
              <span className="mr-2">✦</span>
              {s.announcement.text}
              <span className="ml-2 underline underline-offset-2">→</span>
            </Link>
          )}
          <Navbar settings={s} />
          <main className="relative">{children}</main>
          <Footer settings={s} />
          <CartDrawer currency={s.currency} />
        </CartProvider>
      </SmoothScroll>
    </>
  );
}
