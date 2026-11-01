// ───────────────────────── CMS ─────────────────────────

export type NavItem = { id: string; label: string; href: string; hint?: string };

export type IntroSettings = {
  enabled: boolean;
  style: "orbit" | "minimal" | "mandala";
  title: string;
  tagline: string;
  loadingText: string;
  durationMs: number;
  oncePerSession: boolean;
};

export type HeroSettings = {
  eyebrow: string;
  titleTop: string;
  titleAccent: string;
  titleBottom: string;
  subtitle: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  image: string;
};

export type HomeSectionKey =
  | "marquee"
  | "panchang"
  | "manifesto"
  | "zodiac"
  | "services"
  | "tools"
  | "astrologers"
  | "stats"
  | "testimonials"
  | "shop"
  | "blog"
  | "faq"
  | "cta";

export type HomeSection = { key: HomeSectionKey; label: string; enabled: boolean };

export type SiteSettings = {
  brandName: string;
  brandTagline: string;
  logoGlyph: string;
  accent: string;
  accentSecondary: string;
  announcement: { enabled: boolean; text: string; href: string };
  contact: { phone: string; whatsapp: string; email: string; address: string; hours: string };
  socials: { instagram: string; youtube: string; facebook: string; x: string };
  seo: { title: string; description: string };
  intro: IntroSettings;
  hero: HeroSettings;
  nav: NavItem[];
  navCta: { label: string; href: string };
  homeSections: HomeSection[];
  manifesto: string;
  stats: { label: string; value: number; suffix: string }[];
  marquee: string[];
  footerNote: string;
  currency: string;
};

export type Service = {
  id: string;
  slug: string;
  title: string;
  hindi: string;
  short: string;
  description: string;
  image: string;
  price: number;
  duration: string;
  icon: string;
  featured: boolean;
  published: boolean;
  order: number;
};

export type Astrologer = {
  id: string;
  name: string;
  title: string;
  image: string;
  experience: number;
  languages: string;
  expertise: string;
  rating: number;
  consultations: number;
  pricePerMin: number;
  bio: string;
  online: boolean;
  published: boolean;
  order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category: "Gemstone" | "Rudraksha" | "Yantra" | "Bracelet" | "Report" | "Puja";
  price: number;
  comparePrice: number;
  image: string;
  hue: number;
  short: string;
  description: string;
  benefits: string;
  planet: string;
  stock: number;
  featured: boolean;
  published: boolean;
};

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  author: string;
  readMinutes: number;
  date: string;
  published: boolean;
};

export type Testimonial = {
  id: string;
  name: string;
  city: string;
  image: string;
  quote: string;
  rating: number;
  service: string;
  published: boolean;
};

export type Faq = { id: string; question: string; answer: string; order: number; published: boolean };

export type HoroscopeOverride = {
  id: string;
  sign: string;
  period: "daily" | "weekly" | "monthly";
  date: string; // yyyy-mm-dd (start of period)
  text: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
};

// ───────────────────────── CRM ─────────────────────────

export type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

export type Booking = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  astrologer: string;
  mode: "Call" | "Video" | "Chat" | "In-person";
  date: string;
  time: string;
  dob: string;
  tob: string;
  pob: string;
  message: string;
  amount: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
  paid: boolean;
  createdAt: string;
};

export type OrderItem = { productId: string; name: string; price: number; qty: number };

export type Order = {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  items: OrderItem[];
  total: number;
  status: "placed" | "processing" | "shipped" | "delivered" | "cancelled";
  payment: "COD" | "UPI" | "Card";
  createdAt: string;
};

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
  source: string;
  status: LeadStatus;
  createdAt: string;
};

export type Customer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  city: string;
  sign: string;
  dob: string;
  status: LeadStatus;
  tags: string;
  notes: string;
  source: string;
  value: number;
  lastContact: string;
  createdAt: string;
};

export type Subscriber = { id: string; email: string; sign: string; createdAt: string };

export type Activity = { id: string; type: string; text: string; createdAt: string };

export type DB = {
  settings: SiteSettings;
  services: Service[];
  astrologers: Astrologer[];
  products: Product[];
  posts: Post[];
  testimonials: Testimonial[];
  faqs: Faq[];
  horoscopes: HoroscopeOverride[];
  bookings: Booking[];
  orders: Order[];
  inquiries: Inquiry[];
  customers: Customer[];
  subscribers: Subscriber[];
  activity: Activity[];
};

export type CollectionName = Exclude<keyof DB, "settings">;
