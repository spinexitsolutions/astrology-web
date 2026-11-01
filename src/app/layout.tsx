import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Instrument_Sans, Mukta } from "next/font/google";
import Script from "next/script";
import { getSettings } from "@/lib/db";
import "./globals.css";

// Display: characterful grotesque with optical sizing. Body: clean, Apple-like neo-grotesque.
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-face-display", display: "swap", axes: ["opsz", "wdth"] });
const sans = Instrument_Sans({ subsets: ["latin"], variable: "--font-face-body", display: "swap", axes: ["wdth"] });
const deva = Mukta({ subsets: ["devanagari"], weight: ["400", "600"], variable: "--font-face-deva", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const s = getSettings();
  return {
    title: { default: s.seo.title, template: `%s · ${s.brandName}` },
    description: s.seo.description,
    openGraph: { title: s.seo.title, description: s.seo.description, images: [s.hero.image] },
  };
}

export const viewport: Viewport = {
  themeColor: "#0d0b14",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const once = getSettings().intro.oncePerSession;
  // Hide the intro instantly for visitors who've already seen it this session (prevents a flash)
  const introGate = `try{var q=location.search.indexOf('intro')>-1;if(${once}&&!q&&sessionStorage.getItem('taarak-intro-seen')==='1'){document.documentElement.classList.add('intro-seen')}}catch(e){}`;
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${deva.variable}`} suppressHydrationWarning>
      <body>
        <Script id="intro-gate" strategy="beforeInteractive">{introGate}</Script>
        {children}
      </body>
    </html>
  );
}
