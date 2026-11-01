"use client";

import { getReading, periodKey, type Period } from "@/lib/horoscope";
import { SIGNS } from "@/lib/zodiac";

export type FieldType = "text" | "textarea" | "longtext" | "number" | "boolean" | "select" | "image" | "date" | "color" | "slug";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: (string | { value: string; label: string })[];
  hint?: string;
  half?: boolean;
  from?: string; // for slug
  min?: number;
  max?: number;
  step?: number;
};

type Row = Record<string, unknown>;

export type Schema = {
  label: string;
  singular: string;
  description: string;
  titleKey: string;
  title?: (r: Row) => string;
  subtitle: (r: Row) => string;
  imageKey?: string;
  publishKey?: string;
  sort?: (a: Row, b: Row) => number;
  fields: Field[];
  defaults: () => Row;
  extra?: (draft: Row) => React.ReactNode;
  cardHue?: (r: Row) => number | undefined;
};

const ICONS = ["Sparkles", "Heart", "Briefcase", "Leaf", "Home", "Gem", "CalendarClock", "Layers", "Star", "Moon", "Sun", "Compass"];
const byOrder = (a: Row, b: Row) => Number(a.order ?? 0) - Number(b.order ?? 0);

function HoroscopeHint({ draft }: { draft: Row }) {
  const sign = String(draft.sign || "aries");
  const period = (String(draft.period || "daily") as Period);
  const date = draft.date ? new Date(String(draft.date) + "T12:00:00Z") : new Date();
  const r = getReading(sign, period, [], date);
  const expected = periodKey(period, date);
  return (
    <div className="rounded-2xl bg-[#C9963F]/[0.08] p-4 text-[13px] leading-relaxed text-neutral-700">
      <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#B8873A]">Auto-generated text for this slot</div>
      <p>{r.text}</p>
      <p className="mt-2 text-neutral-500">Love: {r.love}</p>
      {Boolean(draft.date) && draft.date !== expected && (
        <p className="mt-2 rounded-lg bg-amber-100 px-2 py-1 text-amber-800">
          Note: {period} periods start on <b>{expected}</b> — set the date to that value for the override to apply.
        </p>
      )}
      <p className="mt-2 text-neutral-400">Leave any field empty to keep the generated version.</p>
    </div>
  );
}

export const SCHEMAS: Record<string, Schema> = {
  services: {
    label: "Services",
    singular: "Service",
    description: "Readings, remedies & consultations shown on the site.",
    titleKey: "title",
    subtitle: (r) => `${r.duration} · ₹${Number(r.price).toLocaleString("en-IN")}${r.featured ? " · Featured" : ""}`,
    imageKey: "image",
    publishKey: "published",
    sort: byOrder,
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "slug", from: "title" },
      { key: "hindi", label: "Hindi title", type: "text", half: true },
      { key: "icon", label: "Icon", type: "select", options: ICONS, half: true },
      { key: "short", label: "Short description", type: "textarea" },
      { key: "description", label: "Full description", type: "longtext", hint: "Blank line = new paragraph" },
      { key: "image", label: "Image", type: "image" },
      { key: "price", label: "Price (₹)", type: "number", half: true },
      { key: "duration", label: "Duration", type: "text", half: true },
      { key: "order", label: "Order", type: "number", half: true },
      { key: "featured", label: "Featured on home", type: "boolean", half: true },
      { key: "published", label: "Published", type: "boolean" },
    ],
    defaults: () => ({ title: "", slug: "", hindi: "", short: "", description: "", image: "", price: 999, duration: "30 min", icon: "Sparkles", featured: false, published: true, order: 99 }),
  },
  astrologers: {
    label: "Astrologers",
    singular: "Astrologer",
    description: "Your panel of experts — profiles, pricing and availability.",
    titleKey: "name",
    subtitle: (r) => `${r.title} · ${r.experience} yrs · ₹${r.pricePerMin}/min${r.online ? " · Online" : ""}`,
    imageKey: "image",
    publishKey: "published",
    sort: byOrder,
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "title", label: "Title / specialty", type: "text" },
      { key: "image", label: "Photo", type: "image" },
      { key: "experience", label: "Experience (yrs)", type: "number", half: true },
      { key: "pricePerMin", label: "Price per minute (₹)", type: "number", half: true },
      { key: "rating", label: "Rating", type: "number", step: 0.1, min: 0, max: 5, half: true },
      { key: "consultations", label: "Consultations", type: "number", half: true },
      { key: "languages", label: "Languages", type: "text" },
      { key: "expertise", label: "Expertise", type: "text", hint: "Comma separated" },
      { key: "bio", label: "Bio", type: "textarea" },
      { key: "order", label: "Order", type: "number", half: true },
      { key: "online", label: "Online now", type: "boolean", half: true },
      { key: "published", label: "Published", type: "boolean" },
    ],
    defaults: () => ({ name: "", title: "", image: "", experience: 5, languages: "Hindi, English", expertise: "", rating: 4.8, consultations: 0, pricePerMin: 25, bio: "", online: true, published: true, order: 99 }),
  },
  products: {
    label: "Products",
    singular: "Product",
    description: "Gemstones, rudraksha, yantras, reports and pujas in your shop.",
    titleKey: "name",
    subtitle: (r) => `${r.category} · ₹${Number(r.price).toLocaleString("en-IN")} · ${r.stock} in stock`,
    imageKey: "image",
    publishKey: "published",
    cardHue: (r) => Number(r.hue),
    fields: [
      { key: "name", label: "Name", type: "text" },
      { key: "slug", label: "Slug", type: "slug", from: "name" },
      { key: "category", label: "Category", type: "select", options: ["Gemstone", "Rudraksha", "Yantra", "Bracelet", "Report", "Puja"], half: true },
      { key: "planet", label: "Planet", type: "text", half: true },
      { key: "price", label: "Price (₹)", type: "number", half: true },
      { key: "comparePrice", label: "Compare-at price (₹)", type: "number", half: true },
      { key: "stock", label: "Stock", type: "number", half: true },
      { key: "hue", label: "Artwork hue (0–360)", type: "number", min: 0, max: 360, half: true, hint: "Used when no image" },
      { key: "image", label: "Image (optional)", type: "image" },
      { key: "short", label: "Short line", type: "text" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "benefits", label: "Benefits", type: "text" },
      { key: "featured", label: "Featured", type: "boolean", half: true },
      { key: "published", label: "Published", type: "boolean", half: true },
    ],
    defaults: () => ({ name: "", slug: "", category: "Gemstone", price: 999, comparePrice: 0, image: "", hue: 40, short: "", description: "", benefits: "", planet: "", stock: 10, featured: false, published: true }),
  },
  posts: {
    label: "Journal",
    singular: "Post",
    description: "Blog articles — astrology insights, transits and guides.",
    titleKey: "title",
    subtitle: (r) => `${r.category} · ${r.author} · ${r.date}`,
    imageKey: "image",
    publishKey: "published",
    sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    fields: [
      { key: "title", label: "Title", type: "text" },
      { key: "slug", label: "Slug", type: "slug", from: "title" },
      { key: "excerpt", label: "Excerpt", type: "textarea" },
      { key: "content", label: "Content", type: "longtext", hint: "Blank line = paragraph · “## ” = heading" },
      { key: "image", label: "Cover image", type: "image" },
      { key: "category", label: "Category", type: "select", options: ["Basics", "Transits", "Marriage", "Vastu", "Tarot", "Numerology", "Remedies", "Festivals"], half: true },
      { key: "author", label: "Author", type: "text", half: true },
      { key: "date", label: "Date", type: "date", half: true },
      { key: "readMinutes", label: "Read time (min)", type: "number", half: true },
      { key: "published", label: "Published", type: "boolean" },
    ],
    defaults: () => ({ title: "", slug: "", excerpt: "", content: "", image: "", category: "Basics", author: "", readMinutes: 4, date: new Date().toISOString().slice(0, 10), published: false }),
  },
  testimonials: {
    label: "Testimonials",
    singular: "Testimonial",
    description: "Client stories shown on the home page.",
    titleKey: "name",
    subtitle: (r) => `${r.city} · ${r.service} · ${"★".repeat(Number(r.rating) || 0)}`,
    imageKey: "image",
    publishKey: "published",
    fields: [
      { key: "name", label: "Name", type: "text", half: true },
      { key: "city", label: "City", type: "text", half: true },
      { key: "image", label: "Photo", type: "image" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "service", label: "Service", type: "text", half: true },
      { key: "rating", label: "Rating", type: "number", min: 1, max: 5, half: true },
      { key: "published", label: "Published", type: "boolean" },
    ],
    defaults: () => ({ name: "", city: "", image: "", quote: "", rating: 5, service: "", published: true }),
  },
  faqs: {
    label: "FAQs",
    singular: "FAQ",
    description: "Questions answered on the home page.",
    titleKey: "question",
    subtitle: (r) => String(r.answer).slice(0, 90) + "…",
    publishKey: "published",
    sort: byOrder,
    fields: [
      { key: "question", label: "Question", type: "text" },
      { key: "answer", label: "Answer", type: "textarea" },
      { key: "order", label: "Order", type: "number", half: true },
      { key: "published", label: "Published", type: "boolean", half: true },
    ],
    defaults: () => ({ question: "", answer: "", order: 99, published: true }),
  },
  horoscopes: {
    label: "Horoscopes",
    singular: "Override",
    description: "Horoscopes are auto-generated every day. Add an override to publish your own text for any sign & period.",
    titleKey: "sign",
    title: (r) => { const s = SIGNS.find((x) => x.slug === r.sign); return s ? `${s.glyph}  ${s.name}` : String(r.sign); },
    subtitle: (r) => `${r.period} · from ${r.date}`,
    sort: (a, b) => String(b.date).localeCompare(String(a.date)),
    fields: [
      { key: "sign", label: "Sign", type: "select", options: SIGNS.map((s) => ({ value: s.slug, label: `${s.glyph} ${s.name}` })), half: true },
      { key: "period", label: "Period", type: "select", options: ["daily", "weekly", "monthly"], half: true },
      { key: "date", label: "Period start date", type: "date", hint: "Daily: the day · Weekly: Monday · Monthly: the 1st" },
      { key: "text", label: "Main reading", type: "longtext" },
      { key: "love", label: "Love", type: "textarea" },
      { key: "career", label: "Career", type: "textarea" },
      { key: "health", label: "Health", type: "textarea" },
      { key: "luckyNumber", label: "Lucky number", type: "number", half: true },
      { key: "luckyColor", label: "Lucky colour", type: "text", half: true },
    ],
    defaults: () => ({ sign: "aries", period: "daily", date: periodKey("daily"), text: "", love: "", career: "", health: "", luckyNumber: 0, luckyColor: "" }),
    extra: (draft) => <HoroscopeHint draft={draft} />,
  },
};
