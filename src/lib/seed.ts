import type { DB } from "./types";

export const img = (id: string, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;

export const IMG = {
  hero: img("1444703686981-a3abbc4d4fe3", 2400),
  duskSky: img("1419242902214-272b3f66ee7a"),
  nebulaBubble: img("1462331940025-496dfbfc7564"),
  milkyBlue: img("1464802686167-b939a6910659"),
  milkyMountain: img("1515705576963-95cad62945b6"),
  milkyColor: img("1502134249126-9f3755a50d78"),
  darkStars: img("1506318137071-a8e063b4bec0"),
  zodiacClock: img("1515942661900-94b3d1972591"),
  globe: img("1532968961962-8a0cb3a2d4f5"),
  andromeda: img("1543722530-d2c3201371e7"),
  yoga: img("1545389336-cf090694435e"),
  meditate: img("1600618528240-fb9fc964b853"),
  moon: img("1532693322450-2cb5c511067d"),
  mars: img("1630694093867-4b947d812bf0"),
  orion: img("1504333638930-c8787321eee0"),
  ritual: img("1551269901-5c5e14c25df7"),
  peakSky: img("1519681393784-d120267933ba"),
  pendant: img("1599643478518-a784e5dc4c8f"),
  stones: img("1612817288484-6f916006741a"),
  nebula: img("1610296669228-602fa827fc1f"),
  canyon: img("1470813740244-df37b8c1edcb"),
};

const P = {
  w1: img("1544005313-94ddf0286df2", 800),
  w2: img("1573496359142-b8d87734a5a2", 800),
  w3: img("1494790108377-be9c29b29330", 800),
  w4: img("1438761681033-6461ffad8d80", 800),
  m1: img("1507003211169-0a1dd7228f2d", 800),
  m2: img("1500648767791-00dcc994a43e", 800),
};

const daysAgo = (n: number, h = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(h, 12, 0, 0);
  return d.toISOString();
};
const dateIn = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

export const seed: DB = {
  settings: {
    brandName: "Taarak",
    brandTagline: "Vedic astrology, beautifully decoded.",
    logoGlyph: "✦",
    accent: "#FF5A1F",
    accentSecondary: "#6E56FF",
    announcement: { enabled: true, text: "Kartik Purnima special — 20% off every Kundli report this week", href: "/shop" },
    contact: {
      phone: "+91 98765 43210",
      whatsapp: "919876543210",
      email: "namaste@taarak.in",
      address: "12, Ghat Road, Assi, Varanasi, Uttar Pradesh 221005",
      hours: "Every day · 7:00 AM – 10:00 PM IST",
    },
    socials: { instagram: "https://instagram.com", youtube: "https://youtube.com", facebook: "https://facebook.com", x: "https://x.com" },
    seo: {
      title: "Taarak — Vedic Astrology, Kundli & Horoscopes",
      description: "Free Kundli, daily horoscope, Kundli matching, panchang, numerology and 1:1 consultations with India's most trusted Vedic astrologers.",
    },
    intro: {
      enabled: true,
      style: "orbit",
      title: "Taarak",
      tagline: "The sky has been waiting for you",
      loadingText: "Aligning the nine grahas",
      durationMs: 3200,
      oncePerSession: true,
    },
    hero: {
      eyebrow: "Vedic Astrology · Since 1998",
      titleTop: "Your stars,",
      titleAccent: "finally",
      titleBottom: "in plain sight.",
      subtitle: "Ancient Jyotish, computed with precision and explained like a friend would. Kundli, matching, muhurat and guidance — all in one calm place.",
      primaryCta: { label: "Generate free Kundli", href: "/kundli" },
      secondaryCta: { label: "Talk to an astrologer", href: "/astrologers" },
      image: IMG.hero,
    },
    nav: [
      { id: "n1", label: "Horoscope", href: "/horoscope", hint: "Daily · Weekly · Monthly" },
      { id: "n2", label: "Kundli", href: "/kundli", hint: "Free birth chart" },
      { id: "n3", label: "Matching", href: "/matching", hint: "36 Guna Milan" },
      { id: "n4", label: "Panchang", href: "/panchang", hint: "Today's tithi & muhurat" },
      { id: "n5", label: "Astrologers", href: "/astrologers", hint: "Consult live" },
      { id: "n6", label: "Services", href: "/services", hint: "Remedies & readings" },
      { id: "n7", label: "Tarot", href: "/tarot", hint: "Pull three cards" },
      { id: "n8", label: "Numerology", href: "/numerology", hint: "Your core numbers" },
      { id: "n9", label: "Shop", href: "/shop", hint: "Gemstones & rudraksha" },
      { id: "n10", label: "Journal", href: "/blog", hint: "Stories from the sky" },
    ],
    navCta: { label: "Book a reading", href: "/book" },
    homeSections: [
      { key: "marquee", label: "Marquee ticker", enabled: true },
      { key: "panchang", label: "Today's Panchang strip", enabled: true },
      { key: "manifesto", label: "Manifesto (scroll text reveal)", enabled: true },
      { key: "zodiac", label: "Zodiac horizontal scroll", enabled: true },
      { key: "services", label: "Services stack", enabled: true },
      { key: "tools", label: "Free tools bento", enabled: true },
      { key: "astrologers", label: "Astrologers", enabled: true },
      { key: "stats", label: "Numbers / stats", enabled: true },
      { key: "testimonials", label: "Testimonials", enabled: true },
      { key: "shop", label: "Shop preview", enabled: true },
      { key: "blog", label: "Journal preview", enabled: true },
      { key: "faq", label: "FAQ", enabled: true },
      { key: "cta", label: "Final call-to-action", enabled: true },
    ],
    manifesto:
      "We believe the sky is not a fortune cookie. It is a map — of timing, temperament and possibility. Our astrologers read it with rigour, speak with kindness, and never sell you fear.",
    stats: [
      { label: "Kundlis generated", value: 1200000, suffix: "+" },
      { label: "Consultations", value: 86000, suffix: "+" },
      { label: "Verified astrologers", value: 48, suffix: "" },
      { label: "Average rating", value: 4.9, suffix: "★" },
    ],
    marquee: ["Kundli", "Gun Milan", "Panchang", "Muhurat", "Numerology", "Tarot", "Vastu", "Gemstones", "Dasha", "Sade Sati", "Manglik Dosha", "Remedies"],
    footerNote: "Astrology is guidance, not destiny. Your free will always writes the final line.",
    currency: "₹",
  },

  services: [
    { id: "s1", slug: "kundli-analysis", title: "Complete Kundli Analysis", hindi: "कुंडली विश्लेषण", short: "A deep reading of your birth chart — dashas, yogas, strengths and timing.", description: "Your Janam Kundli is a snapshot of the sky at your first breath. In this 60-minute session our senior astrologer walks you through your lagna, the placement of all nine grahas, the yogas you were born with and the Vimshottari dasha you are currently living through.\n\nYou leave with clarity on your natural strengths, recurring challenges, and the windows of time that favour action — along with practical, non-fear-based remedies.", image: IMG.zodiacClock, price: 2100, duration: "60 min", icon: "Sparkles", featured: true, published: true, order: 1 },
    { id: "s2", slug: "marriage-love", title: "Love & Marriage", hindi: "विवाह एवं प्रेम", short: "Kundli matching, timing of marriage, and relationship harmony.", description: "Whether you are searching, committed or at a crossroads, we look at your 7th house, Venus, Jupiter and Navamsa chart to understand what you need in a partner and when the stars open the door.\n\nIncludes full 36-guna Ashtakoota matching, Manglik analysis and remedies.", image: IMG.duskSky, price: 1800, duration: "45 min", icon: "Heart", featured: true, published: true, order: 2 },
    { id: "s3", slug: "career-business", title: "Career & Business", hindi: "करियर एवं व्यापार", short: "Find your dharma at work — job changes, promotions and ventures.", description: "Your 10th house and its lord reveal the work you are built for. We map current and upcoming dashas and transits of Saturn and Jupiter to tell you when to push, when to pivot and when to wait.\n\nIdeal before a job switch, launch, partnership or big investment.", image: IMG.peakSky, price: 1800, duration: "45 min", icon: "Briefcase", featured: true, published: true, order: 3 },
    { id: "s4", slug: "health-wellness", title: "Health & Wellbeing", hindi: "स्वास्थ्य", short: "Understand your constitution and periods that need extra care.", description: "Medical astrology looks at the 6th, 8th and 12th houses, the Moon and your lagna lord to understand your constitution. We suggest lifestyle rhythms, mantras and timing for important procedures. Always alongside — never instead of — your doctor.", image: IMG.yoga, price: 1500, duration: "40 min", icon: "Leaf", featured: false, published: true, order: 4 },
    { id: "s5", slug: "vastu-shastra", title: "Vastu Shastra", hindi: "वास्तु शास्त्र", short: "Align your home and workplace with the five elements.", description: "A room-by-room Vastu review from your floor plan — entrances, kitchen, bedroom, puja space and workstations — with simple corrections that need no demolition.", image: IMG.canyon, price: 5100, duration: "90 min", icon: "Home", featured: false, published: true, order: 5 },
    { id: "s6", slug: "gemstone-consultation", title: "Gemstone Prescription", hindi: "रत्न परामर्श", short: "The right stone, weight, metal and day — or none at all.", description: "Gemstones amplify planets; the wrong one can amplify the wrong things. We analyse functional benefics in your chart before recommending a stone, its carat, metal, finger and muhurat for wearing.", image: IMG.pendant, price: 900, duration: "30 min", icon: "Gem", featured: false, published: true, order: 6 },
    { id: "s7", slug: "muhurat", title: "Muhurat Selection", hindi: "शुभ मुहूर्त", short: "Auspicious timing for weddings, griha pravesh, launches and more.", description: "We pick dates and exact time windows using panchang, your personal chart and current transits — for marriage, property, vehicle purchase, business launch, naming ceremony and travel.", image: IMG.moon, price: 1100, duration: "Report", icon: "CalendarClock", featured: false, published: true, order: 7 },
    { id: "s8", slug: "tarot-reading", title: "Intuitive Tarot", hindi: "टैरो रीडिंग", short: "A gentle, insightful spread for the question on your mind.", description: "When you need a fresh perspective rather than a timeline, tarot shines. A 10-card Celtic Cross or a focused 3-card spread, with a written summary after the call.", image: IMG.ritual, price: 799, duration: "30 min", icon: "Layers", featured: false, published: true, order: 8 },
  ],

  astrologers: [
    { id: "a1", name: "Acharya Devendra Shastri", title: "Vedic & KP Astrology", image: P.m2, experience: 27, languages: "Hindi, English, Sanskrit", expertise: "Kundli, Career, Muhurat", rating: 4.9, consultations: 21400, pricePerMin: 45, bio: "Third-generation Jyotishi from Varanasi, trained at Sampurnanand Sanskrit University. Known for precise timing predictions and calm, practical remedies.", online: true, published: true, order: 1 },
    { id: "a2", name: "Dr. Meera Iyer", title: "Relationship Astrologer", image: P.w2, experience: 15, languages: "English, Tamil, Hindi", expertise: "Marriage, Compatibility, Navamsa", rating: 4.9, consultations: 12800, pricePerMin: 38, bio: "PhD in Jyotish Shastra and a certified counsellor. Meera blends classical matching with modern relationship psychology.", online: true, published: true, order: 2 },
    { id: "a3", name: "Pt. Rakesh Mishra", title: "Vastu & Remedies", image: P.m1, experience: 19, languages: "Hindi, Bhojpuri", expertise: "Vastu, Puja, Lal Kitab", rating: 4.8, consultations: 9600, pricePerMin: 32, bio: "Has audited 3,000+ homes and offices. Specialises in simple, non-structural Vastu fixes and Lal Kitab upaay.", online: false, published: true, order: 3 },
    { id: "a4", name: "Ananya Kapoor", title: "Tarot & Numerology", image: P.w1, experience: 9, languages: "English, Hindi, Punjabi", expertise: "Tarot, Numerology, Name correction", rating: 4.8, consultations: 7400, pricePerMin: 25, bio: "Intuitive reader who pairs tarot with Chaldean numerology. Loved for her warm, no-drama readings.", online: true, published: true, order: 4 },
    { id: "a5", name: "Sanya Malhotra", title: "Nadi & Medical Astrology", image: P.w3, experience: 12, languages: "Hindi, English", expertise: "Health, Nadi, Prashna", rating: 4.7, consultations: 5200, pricePerMin: 30, bio: "Trained in Nadi astrology traditions of South India; focuses on health timing and Prashna (horary) questions.", online: true, published: true, order: 5 },
    { id: "a6", name: "Ira Banerjee", title: "Western & Vedic Fusion", image: P.w4, experience: 8, languages: "English, Bengali", expertise: "Transits, Life purpose, Relocation", rating: 4.8, consultations: 3900, pricePerMin: 28, bio: "Bridges Western psychological astrology with Vedic dashas. Popular with NRIs for relocation and timing advice.", online: false, published: true, order: 6 },
  ],

  products: [
    { id: "p1", slug: "yellow-sapphire-pukhraj", name: "Yellow Sapphire (Pukhraj)", category: "Gemstone", price: 18500, comparePrice: 22000, image: "", hue: 46, short: "Ceylon, lab-certified, 5.25 ratti", description: "Natural unheated Ceylon yellow sapphire, certified by GIA-accredited lab. Energised on a Thursday in Guru hora.", benefits: "Wisdom, prosperity, marriage, children", planet: "Jupiter", stock: 6, featured: true, published: true },
    { id: "p2", slug: "ruby-manik", name: "Ruby (Manik)", category: "Gemstone", price: 24000, comparePrice: 28000, image: "", hue: 350, short: "Burmese, 4.1 ratti", description: "Pigeon-blood Burmese ruby for a strong Sun — confidence, authority and vitality.", benefits: "Leadership, recognition, vitality", planet: "Sun", stock: 3, featured: true, published: true },
    { id: "p3", slug: "five-mukhi-rudraksha", name: "5 Mukhi Rudraksha", category: "Rudraksha", price: 1100, comparePrice: 1500, image: "", hue: 22, short: "Nepal origin, X-ray tested", description: "Collector-grade 5 mukhi bead from Nepal, ruled by Jupiter and blessed by Kalagni Rudra. Comes threaded in red silk.", benefits: "Calm mind, focus, blood pressure", planet: "Jupiter", stock: 40, featured: true, published: true },
    { id: "p4", slug: "shree-yantra", name: "Shree Yantra · Copper", category: "Yantra", price: 2400, comparePrice: 3000, image: "", hue: 28, short: "3D Meru, energised", description: "Hand-engraved copper Meru Shree Yantra, energised with Shri Suktam on a Friday.", benefits: "Abundance, harmony, Vastu correction", planet: "Venus", stock: 18, featured: true, published: true },
    { id: "p5", slug: "blue-sapphire-neelam", name: "Blue Sapphire (Neelam)", category: "Gemstone", price: 32000, comparePrice: 36000, image: "", hue: 225, short: "Ceylon, trial recommended", description: "The most powerful — and most cautious — gem. Sold only after chart verification and a 3-day trial.", benefits: "Discipline, sudden gains, career", planet: "Saturn", stock: 2, featured: false, published: true },
    { id: "p6", slug: "seven-chakra-bracelet", name: "Seven Chakra Bracelet", category: "Bracelet", price: 899, comparePrice: 1299, image: "", hue: 280, short: "Natural stones, elastic", description: "Seven natural stones aligned to the chakras, with a lava bead for essential oils.", benefits: "Balance, grounding, daily protection", planet: "All", stock: 120, featured: false, published: true },
    { id: "p7", slug: "emerald-panna", name: "Emerald (Panna)", category: "Gemstone", price: 15500, comparePrice: 19000, image: "", hue: 150, short: "Zambian, 4.5 ratti", description: "Vivid Zambian emerald for Mercury — communication, intellect and business.", benefits: "Speech, intellect, trade", planet: "Mercury", stock: 5, featured: false, published: true },
    { id: "p8", slug: "premium-kundli-report", name: "Premium Kundli Report", category: "Report", price: 999, comparePrice: 1999, image: "", hue: 260, short: "120+ page personalised PDF", description: "Your complete life report — charts, divisional charts, dasha predictions for 10 years, yogas, doshas and remedies — written by our astrologers, delivered in 48 hours.", benefits: "Clarity, planning, remedies", planet: "All", stock: 999, featured: true, published: true },
    { id: "p9", slug: "navgraha-shanti-puja", name: "Navgraha Shanti Puja", category: "Puja", price: 5100, comparePrice: 6100, image: "", hue: 18, short: "Live on video from Kashi", description: "A 2.5 hour Navgraha Shanti puja performed by 3 pandits in your name and gotra at our Varanasi ghat. Join live, receive prasad by post.", benefits: "Pacifies all nine planets", planet: "All", stock: 999, featured: false, published: true },
  ],

  posts: [
    { id: "b1", slug: "saturn-transit-2026-what-it-means", title: "Saturn in Pisces: the slow, sacred reset of 2026", excerpt: "Shani's transit through Meena asks every sign to dissolve something old. Here is how it touches yours.", content: "Saturn moves slowly — roughly two and a half years per sign — which is exactly why its transits feel like seasons rather than events. In sidereal Pisces, Shani meets the most boundless sign of the zodiac. The theme is surrender with structure: learning where to let go and where to hold the line.\n\n## Who feels it most\n\nMoon signs Aquarius, Pisces and Aries are in Sade Sati, while Cancer and Scorpio experience Dhaiya. This is not a curse. Saturn rewards honest effort, patience and humility — and punishes shortcuts.\n\n## What to do\n\nKeep a steady routine. Serve the elderly and labourers. Light a sesame oil lamp on Saturdays. Most importantly: finish what you started.\n\n## The gift\n\nPeople who work with Saturn rather than against it often look back on these years as the period they became who they really are.", image: IMG.nebulaBubble, category: "Transits", author: "Acharya Devendra Shastri", readMinutes: 6, date: daysAgo(3).slice(0, 10), published: true },
    { id: "b2", slug: "what-is-manglik-dosha", title: "Manglik dosha, explained without the fear", excerpt: "Nearly half of all charts have Mars in a 'Manglik' house. So why does it scare families so much?", content: "A chart is considered Manglik when Mars sits in the 1st, 2nd, 4th, 7th, 8th or 12th house. Statistically, that's around 50% of people — so it can't be the doom it is made out to be.\n\n## What it actually indicates\n\nMars brings energy, drive and directness. In relationship houses it can mean a strong-willed partner, or friction if that energy has no outlet.\n\n## Cancellations\n\nClassical texts list many cancellations: Mars in own sign, aspect of Jupiter, both partners Manglik, and more. Always get the full chart checked before panicking.\n\n## Remedies that help\n\nChannel Mars: sport, discipline, Hanuman Chalisa on Tuesdays, donating red lentils. Communication helps more than any ritual.", image: IMG.mars, category: "Marriage", author: "Dr. Meera Iyer", readMinutes: 5, date: daysAgo(8).slice(0, 10), published: true },
    { id: "b3", slug: "reading-your-moon-sign", title: "Why your Moon sign matters more than your Sun sign", excerpt: "In Vedic astrology, the Moon is the mind. Learn why your Rashi is the heart of every prediction.", content: "Western astrology leads with the Sun sign. Jyotish leads with the Moon — Chandra — because the Moon is manas, the mind, and the mind is where we experience life.\n\n## Your Rashi and Nakshatra\n\nThe sign the Moon occupied at birth is your Rashi. The exact lunar mansion — one of 27 nakshatras — adds texture: your instincts, emotional needs and even the starting point of your dasha cycle.\n\n## Try it\n\nGenerate your free Kundli on Taarak and look for Moon in the planets table. Read its nakshatra description — most people find it uncannily accurate.", image: IMG.moon, category: "Basics", author: "Ira Banerjee", readMinutes: 4, date: daysAgo(14).slice(0, 10), published: true },
    { id: "b4", slug: "vastu-for-small-apartments", title: "Vastu for small city apartments", excerpt: "No demolition, no stress — seven gentle Vastu fixes for one and two-BHK homes.", content: "Most Vastu advice assumes you can choose where the kitchen goes. City dwellers can't. The good news: Vastu works with energy and intention, and small adjustments go a long way.\n\n## Seven fixes\n\nKeep the north-east light and clutter-free. Sleep with your head to the south or east. Place a small water element in the north. Use warm lights in the south-east. Keep the centre (Brahmasthan) open. Fix leaking taps. Keep the entrance bright and clean.\n\n## When to call an expert\n\nIf you face recurring issues at home, share your floor plan with our Vastu team for a precise review.", image: IMG.canyon, category: "Vastu", author: "Pt. Rakesh Mishra", readMinutes: 5, date: daysAgo(21).slice(0, 10), published: true },
    { id: "b5", slug: "beginners-guide-to-nakshatras", title: "A beginner's guide to the 27 nakshatras", excerpt: "The lunar mansions are Jyotish's secret weapon. Meet the 27 star-groups that colour your mind.", content: "Long before the twelve signs, Vedic seers divided the sky into 27 lunar mansions — the nakshatras — each spanning 13°20'. The Moon visits one per day, which is why they are so tied to the mind and to timing.\n\n## Deities and symbols\n\nEach nakshatra has a ruling deity, a symbol and a planetary lord. Ashwini, ruled by the divine physicians, is quick and healing. Rohini, the Moon's favourite, is fertile and beautiful. Mula, the root, digs to the truth.\n\n## Why they matter\n\nNakshatras power muhurat, matching (Tara, Yoni, Gana, Nadi kootas) and the Vimshottari dasha system itself.", image: IMG.orion, category: "Basics", author: "Acharya Devendra Shastri", readMinutes: 7, date: daysAgo(30).slice(0, 10), published: true },
    { id: "b6", slug: "tarot-vs-astrology", title: "Tarot or astrology — which one do you need?", excerpt: "One is a map, the other a mirror. A simple way to decide which reading fits your question.", content: "Astrology answers 'when' and 'what kind'. Tarot answers 'what now' and 'what am I not seeing'. They are complementary, not competing.\n\n## Choose astrology when\n\nYou need timing, long-range planning, compatibility or a life overview.\n\n## Choose tarot when\n\nYou are stuck on a specific decision, want emotional clarity, or need a fresh perspective on a situation already in motion.", image: IMG.ritual, category: "Tarot", author: "Ananya Kapoor", readMinutes: 3, date: daysAgo(40).slice(0, 10), published: true },
  ],

  testimonials: [
    { id: "t1", name: "Priya Sharma", city: "Gurugram", image: P.w1, quote: "Acharya ji told me the exact month my job change would happen — and it did. More than the prediction, it was the calm he gave me.", rating: 5, service: "Career", published: true },
    { id: "t2", name: "Rohan & Aditi", city: "Pune", image: P.m1, quote: "Our families were worried about Manglik dosha. Dr. Meera explained the cancellations patiently. We got married in March!", rating: 5, service: "Matching", published: true },
    { id: "t3", name: "Neha Gupta", city: "Toronto", image: P.w3, quote: "The cleanest astrology site I have ever used. The free Kundli alone is better than the paid reports I bought before.", rating: 5, service: "Kundli", published: true },
    { id: "t4", name: "Vikram Rao", city: "Bengaluru", image: P.m2, quote: "Simple Vastu changes, no demolition, and the energy in our office is genuinely different. Revenue is up this quarter.", rating: 5, service: "Vastu", published: true },
    { id: "t5", name: "Kavya Menon", city: "Kochi", image: P.w2, quote: "Ananya's tarot reading was gentle and so accurate. I keep coming back before every big decision.", rating: 5, service: "Tarot", published: true },
  ],

  faqs: [
    { id: "f1", question: "Is the free Kundli really free?", answer: "Yes. Your birth chart, planetary positions, nakshatra, Manglik check and Vimshottari dasha are computed instantly and free forever. Detailed written reports are optional.", order: 1, published: true },
    { id: "f2", question: "How accurate is my birth time required to be?", answer: "Within 5–10 minutes is ideal. The ascendant changes roughly every two hours, so even an approximate time helps. If you don't know it, our astrologers can do birth-time rectification.", order: 2, published: true },
    { id: "f3", question: "Do you use Vedic (sidereal) or Western astrology?", answer: "We use Vedic sidereal astrology with Lahiri ayanamsa — the standard in India. Sun signs on our horoscope pages are shown in the familiar Western dates for convenience.", order: 3, published: true },
    { id: "f4", question: "How do consultations work?", answer: "Pick an astrologer, choose call, video or chat, and select a slot. You'll get a confirmation on WhatsApp and email with joining details.", order: 4, published: true },
    { id: "f5", question: "Are your gemstones certified?", answer: "Every gemstone ships with a certificate from a government-approved lab, and we only recommend a stone after reviewing your chart.", order: 5, published: true },
    { id: "f6", question: "Is my birth data private?", answer: "Always. Your details are encrypted, never sold, and used only to prepare your reading.", order: 6, published: true },
  ],

  horoscopes: [],

  bookings: [
    { id: "bk1", name: "Ankit Verma", phone: "+91 98110 22334", email: "ankit.v@example.com", service: "Complete Kundli Analysis", astrologer: "Acharya Devendra Shastri", mode: "Video", date: dateIn(1), time: "11:00", dob: "1992-04-11", tob: "06:45", pob: "Lucknow, India", message: "Career change confusion", amount: 2100, status: "confirmed", paid: true, createdAt: daysAgo(1, 9) },
    { id: "bk2", name: "Sneha Kulkarni", phone: "+91 98220 11223", email: "sneha.k@example.com", service: "Love & Marriage", astrologer: "Dr. Meera Iyer", mode: "Call", date: dateIn(2), time: "16:30", dob: "1996-09-02", tob: "21:10", pob: "Pune, India", message: "Marriage timing", amount: 1800, status: "pending", paid: false, createdAt: daysAgo(0, 8) },
    { id: "bk3", name: "Rahul Jain", phone: "+91 99300 55667", email: "rahul.j@example.com", service: "Vastu Shastra", astrologer: "Pt. Rakesh Mishra", mode: "In-person", date: dateIn(4), time: "10:00", dob: "1985-12-20", tob: "03:15", pob: "Jaipur, India", message: "New office Vastu", amount: 5100, status: "confirmed", paid: true, createdAt: daysAgo(2, 15) },
    { id: "bk4", name: "Fatima Khan", phone: "+91 98450 77889", email: "fatima.k@example.com", service: "Intuitive Tarot", astrologer: "Ananya Kapoor", mode: "Chat", date: dateIn(-2), time: "19:00", dob: "1999-01-28", tob: "", pob: "Hyderabad, India", message: "", amount: 799, status: "completed", paid: true, createdAt: daysAgo(5, 11) },
    { id: "bk5", name: "Arjun Nair", phone: "+91 97440 66778", email: "arjun.n@example.com", service: "Career & Business", astrologer: "Acharya Devendra Shastri", mode: "Video", date: dateIn(-5), time: "12:00", dob: "1990-06-14", tob: "14:20", pob: "Kochi, India", message: "Startup launch muhurat", amount: 1800, status: "completed", paid: true, createdAt: daysAgo(9, 13) },
    { id: "bk6", name: "Divya Reddy", phone: "+91 90000 12345", email: "divya.r@example.com", service: "Health & Wellbeing", astrologer: "Sanya Malhotra", mode: "Call", date: dateIn(-8), time: "09:30", dob: "1988-03-03", tob: "07:00", pob: "Hyderabad, India", message: "", amount: 1500, status: "cancelled", paid: false, createdAt: daysAgo(12, 10) },
  ],

  orders: [
    { id: "o1", name: "Manish Agarwal", phone: "+91 98100 98100", email: "manish@example.com", address: "B-14, Vasant Kunj, New Delhi 110070", items: [{ productId: "p1", name: "Yellow Sapphire (Pukhraj)", price: 18500, qty: 1 }], total: 18500, status: "shipped", payment: "UPI", createdAt: daysAgo(3, 14) },
    { id: "o2", name: "Pooja Desai", phone: "+91 98200 44556", email: "pooja.d@example.com", address: "Flat 302, Andheri West, Mumbai 400053", items: [{ productId: "p3", name: "5 Mukhi Rudraksha", price: 1100, qty: 2 }, { productId: "p6", name: "Seven Chakra Bracelet", price: 899, qty: 1 }], total: 3099, status: "processing", payment: "Card", createdAt: daysAgo(1, 18) },
    { id: "o3", name: "Sameer Joshi", phone: "+91 97000 11000", email: "sameer@example.com", address: "Sector 21, Chandigarh 160022", items: [{ productId: "p8", name: "Premium Kundli Report", price: 999, qty: 1 }], total: 999, status: "delivered", payment: "UPI", createdAt: daysAgo(6, 12) },
    { id: "o4", name: "Lakshmi Pillai", phone: "+91 94470 33221", email: "lakshmi@example.com", address: "MG Road, Thrissur 680001", items: [{ productId: "p4", name: "Shree Yantra · Copper", price: 2400, qty: 1 }], total: 2400, status: "placed", payment: "COD", createdAt: daysAgo(0, 7) },
  ],

  inquiries: [
    { id: "i1", name: "Karan Mehta", phone: "+91 98989 89898", email: "karan@example.com", subject: "Corporate Vastu", message: "We are moving into a 12,000 sq ft office in Noida. Can your team visit?", source: "Contact form", status: "new", createdAt: daysAgo(0, 11) },
    { id: "i2", name: "Ritu Singh", phone: "+91 97171 71717", email: "ritu@example.com", subject: "Gemstone query", message: "Is Pukhraj suitable for Sagittarius ascendant?", source: "WhatsApp", status: "contacted", createdAt: daysAgo(2, 16) },
    { id: "i3", name: "George Thomas", phone: "+44 7700 900123", email: "george@example.com", subject: "Consultation from UK", message: "Do you offer consultations in UK time zone?", source: "Contact form", status: "qualified", createdAt: daysAgo(4, 20) },
  ],

  customers: [
    { id: "c1", name: "Ankit Verma", phone: "+91 98110 22334", email: "ankit.v@example.com", city: "Lucknow", sign: "Aries", dob: "1992-04-11", status: "converted", tags: "Booking, Repeat", notes: "Prefers video calls in the morning.", source: "Booking", value: 6300, lastContact: daysAgo(1), createdAt: daysAgo(120) },
    { id: "c2", name: "Sneha Kulkarni", phone: "+91 98220 11223", email: "sneha.k@example.com", city: "Pune", sign: "Virgo", dob: "1996-09-02", status: "qualified", tags: "Booking, Marriage", notes: "Family wants matching with 2 profiles.", source: "Booking", value: 0, lastContact: daysAgo(0), createdAt: daysAgo(0) },
    { id: "c3", name: "Manish Agarwal", phone: "+91 98100 98100", email: "manish@example.com", city: "New Delhi", sign: "Sagittarius", dob: "1979-12-05", status: "converted", tags: "Order, VIP", notes: "High-value gemstone buyer.", source: "Order", value: 42500, lastContact: daysAgo(3), createdAt: daysAgo(200) },
    { id: "c4", name: "Karan Mehta", phone: "+91 98989 89898", email: "karan@example.com", city: "Noida", sign: "", dob: "", status: "new", tags: "Inquiry, Corporate", notes: "", source: "Contact form", value: 0, lastContact: daysAgo(0), createdAt: daysAgo(0) },
    { id: "c5", name: "Ritu Singh", phone: "+91 97171 71717", email: "ritu@example.com", city: "Delhi", sign: "Sagittarius", dob: "", status: "contacted", tags: "Inquiry", notes: "Follow up with gemstone options.", source: "WhatsApp", value: 0, lastContact: daysAgo(2), createdAt: daysAgo(2) },
    { id: "c6", name: "Pooja Desai", phone: "+91 98200 44556", email: "pooja.d@example.com", city: "Mumbai", sign: "Libra", dob: "", status: "converted", tags: "Order", notes: "", source: "Order", value: 3099, lastContact: daysAgo(1), createdAt: daysAgo(1) },
    { id: "c7", name: "Rahul Jain", phone: "+91 99300 55667", email: "rahul.j@example.com", city: "Jaipur", sign: "Capricorn", dob: "1985-12-20", status: "converted", tags: "Booking, Vastu", notes: "", source: "Booking", value: 5100, lastContact: daysAgo(2), createdAt: daysAgo(30) },
    { id: "c8", name: "George Thomas", phone: "+44 7700 900123", email: "george@example.com", city: "London", sign: "", dob: "", status: "lost", tags: "Inquiry, NRI", notes: "Timezone mismatch; revisit in Jan.", source: "Contact form", value: 0, lastContact: daysAgo(4), createdAt: daysAgo(4) },
  ],

  subscribers: [
    { id: "sub1", email: "stargazer@example.com", sign: "leo", createdAt: daysAgo(1) },
    { id: "sub2", email: "moonchild@example.com", sign: "cancer", createdAt: daysAgo(3) },
    { id: "sub3", email: "hello@example.com", sign: "pisces", createdAt: daysAgo(6) },
  ],

  activity: [
    { id: "ac1", type: "booking", text: "Sneha Kulkarni booked Love & Marriage", createdAt: daysAgo(0, 8) },
    { id: "ac2", type: "order", text: "New order from Lakshmi Pillai — ₹2,400", createdAt: daysAgo(0, 7) },
    { id: "ac3", type: "inquiry", text: "Karan Mehta asked about Corporate Vastu", createdAt: daysAgo(0, 11) },
    { id: "ac4", type: "booking", text: "Ankit Verma booked Complete Kundli Analysis", createdAt: daysAgo(1, 9) },
  ],
};
