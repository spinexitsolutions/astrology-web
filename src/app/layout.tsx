import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif, Tiro_Devanagari_Hindi } from "next/font/google";
import Script from "next/script";
import { getSettings } from "@/lib/db";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const deva = Tiro_Devanagari_Hindi({ subsets: ["devanagari"], weight: "400", variable: "--font-deva", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = getSettings();
  return {
    title: { default: s.seo.title, template: `%s · ${s.brandName}` },
    description: s.seo.description,
    openGraph: { title: s.seo.title, description: s.seo.description, images: [s.hero.image] },
  };
}

export const viewport: Viewport = {
  themeColor: "#07070c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const once = getSettings().intro.oncePerSession;
  // Hide the intro instantly for visitors who've already seen it this session (prevents a flash)
  const introGate = `try{var q=location.search.indexOf('intro')>-1;if(${once}&&!q&&sessionStorage.getItem('taarak-intro-seen')==='1'){document.documentElement.classList.add('intro-seen')}}catch(e){}`;
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable} ${deva.variable}`} suppressHydrationWarning>
      <body>
        <Script id="intro-gate" strategy="beforeInteractive">{introGate}</Script>
        {children}
      </body>
    </html>
  );
}
