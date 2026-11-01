# Taarak — Vedic Astrology Website + Admin (CMS & CRM)

A premium, mobile-first astrology website built with **Next.js 16 (App Router)**, **Tailwind CSS v4**, **Framer Motion** and **Lenis** smooth scroll, plus an admin panel that controls the whole site.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Admin: **http://localhost:3000/admin**. Default login is `admin@taarak.in` / `taarak@123`.
Change it with the `ADMIN_EMAIL`, `ADMIN_PASSWORD` and `ADMIN_SECRET` env vars.

## Website features

- **Intro animation** in orbit, mandala or minimal style, configured from admin. Open `/?intro=1` to preview it.
- **"Orbit Island" navbar**: a floating pill that shrinks into a compact dynamic-island on scroll, with a scroll-progress ring. It hides when you scroll down and opens a full-screen menu with a rotating zodiac wheel.
- **Home page**: Apple-style hero (the headline fades out and an image expands to full-bleed), velocity marquee, live Panchang strip, scroll-revealed manifesto, pinned horizontal zodiac scroller, sticky stacked service cards, spotlight bento of tools, astrologers, counters, testimonials, shop, journal, FAQ and a parallax CTA. Admin can turn each section on or off and reorder it.
- **Free Kundli** from real astronomy (Sun, Moon, planets, Lagna, Lahiri ayanamsa): North-Indian chart, Moon chart, planet table, nakshatra and pada, Manglik check and the Vimshottari dasha timeline.
- **Kundli Matching**: full Ashtakoota 36-guna milan with all 8 kootas, plus a Manglik check for both people.
- **Horoscope**: daily, weekly and monthly for all 12 signs. The text is auto-generated and can be overridden in admin.
- **Panchang** for any date and city: tithi, nakshatra, yoga, karana, sunrise/sunset, Rahu Kaal, Yamaganda, Gulika, Abhijit, Choghadiya and moon phase.
- **Numerology** and interactive **Tarot** (shuffle, pick, 3D flip).
- **Astrologers**, a 4-step **booking flow**, **services**, a **shop** with cart and checkout, **journal** and **contact** pages.
- Page transitions, smooth scroll, reduced-motion support and SEO metadata.

## Admin panel

- **Dashboard**: revenue, bookings, orders, leads, a 14-day chart, the pipeline and recent activity.
- **CRM**: customers (table plus a drag-and-drop kanban pipeline, with notes, tags and lifetime value), bookings, orders, inquiries and subscribers (CSV export). Every booking, order or inquiry creates or updates a customer automatically.
- **CMS**: services, astrologers, products, journal posts, testimonials, FAQs and horoscope overrides.
- **Site & Intro**: brand, SEO, theme colours, intro animation, hero, navigation, home section order, marquee, stats, announcement bar, contact and socials, and a reset for the demo data.

## Data

Data is stored in `data/db.json`, created automatically from `src/lib/seed.ts`. To host on a serverless platform in production, replace `src/lib/db.ts` with Postgres, Mongo or Supabase.
