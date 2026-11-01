import Astrologers from "@/components/site/home/Astrologers";
import BlogPreview from "@/components/site/home/BlogPreview";
import Faq from "@/components/site/home/Faq";
import FinalCta from "@/components/site/home/FinalCta";
import Hero from "@/components/site/home/Hero";
import Manifesto from "@/components/site/home/Manifesto";
import Marquee from "@/components/site/home/Marquee";
import PanchangStrip from "@/components/site/home/PanchangStrip";
import ServicesStack from "@/components/site/home/ServicesStack";
import ShopPreview from "@/components/site/home/ShopPreview";
import Stats from "@/components/site/home/Stats";
import Testimonials from "@/components/site/home/Testimonials";
import ToolsBento from "@/components/site/home/ToolsBento";
import ZodiacScroller from "@/components/site/home/ZodiacScroller";
import { getDB } from "@/lib/db";
import { IMG } from "@/lib/seed";
import type { HomeSectionKey } from "@/lib/types";

export const dynamic = "force-dynamic";

// Sections rendered in the dark "night" palette — creates a day/night rhythm down the page
const NIGHT: HomeSectionKey[] = ["marquee", "zodiac", "tools", "cta"];

export default function Home() {
  const db = getDB();
  const s = db.settings;
  const pub = <T extends { published: boolean }>(a: T[]) => a.filter((x) => x.published);
  const services = pub(db.services).sort((a, b) => a.order - b.order);
  const astrologers = pub(db.astrologers).sort((a, b) => a.order - b.order);
  const products = pub(db.products).sort((a, b) => Number(b.featured) - Number(a.featured));
  const posts = pub(db.posts).sort((a, b) => b.date.localeCompare(a.date));
  const faqs = pub(db.faqs).sort((a, b) => a.order - b.order);

  const render: Record<HomeSectionKey, React.ReactNode> = {
    marquee: <Marquee words={s.marquee} />,
    panchang: <PanchangStrip />,
    manifesto: <Manifesto text={s.manifesto} />,
    zodiac: <ZodiacScroller />,
    services: <ServicesStack services={services} currency={s.currency} />,
    tools: <ToolsBento />,
    astrologers: <Astrologers list={astrologers} currency={s.currency} />,
    stats: <Stats stats={s.stats} />,
    testimonials: <Testimonials list={pub(db.testimonials)} />,
    shop: <ShopPreview products={products} currency={s.currency} />,
    blog: <BlogPreview posts={posts} />,
    faq: <Faq faqs={faqs} />,
    cta: <FinalCta image={IMG.peakSky} whatsapp={s.contact.whatsapp} />,
  };

  return (
    <>
      <Hero hero={s.hero} />
      {s.homeSections.filter((x) => x.enabled).map((x) => (
        <div key={x.key} className={NIGHT.includes(x.key) ? "night" : undefined}>{render[x.key]}</div>
      ))}
    </>
  );
}
