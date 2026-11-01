export type Sign = {
  slug: string;
  name: string;
  hindi: string;
  vedic: string;
  glyph: string;
  dates: string;
  start: [number, number]; // month, day (tropical, western)
  element: "Fire" | "Earth" | "Air" | "Water";
  modality: "Cardinal" | "Fixed" | "Mutable";
  ruler: string;
  traits: string[];
  strengths: string;
  shadow: string;
  color: string;
  gem: string;
  number: number;
  day: string;
  compatible: string[];
  hue: number;
};

export const SIGNS: Sign[] = [
  { slug: "aries", name: "Aries", hindi: "मेष", vedic: "Mesha", glyph: "♈", dates: "Mar 21 – Apr 19", start: [3, 21], element: "Fire", modality: "Cardinal", ruler: "Mars", traits: ["Bold", "Driven", "Pioneering"], strengths: "Courage, initiative and an infectious will to begin.", shadow: "Impatience and a quick temper.", color: "Scarlet", gem: "Red Coral", number: 9, day: "Tuesday", compatible: ["leo", "sagittarius", "gemini"], hue: 8 },
  { slug: "taurus", name: "Taurus", hindi: "वृषभ", vedic: "Vrishabha", glyph: "♉", dates: "Apr 20 – May 20", start: [4, 20], element: "Earth", modality: "Fixed", ruler: "Venus", traits: ["Grounded", "Loyal", "Sensual"], strengths: "Patience, devotion and a love for beauty.", shadow: "Stubbornness and resistance to change.", color: "Emerald", gem: "Diamond", number: 6, day: "Friday", compatible: ["virgo", "capricorn", "cancer"], hue: 140 },
  { slug: "gemini", name: "Gemini", hindi: "मिथुन", vedic: "Mithuna", glyph: "♊", dates: "May 21 – Jun 20", start: [5, 21], element: "Air", modality: "Mutable", ruler: "Mercury", traits: ["Curious", "Witty", "Adaptive"], strengths: "A brilliant mind that connects everything.", shadow: "Restlessness and scattered focus.", color: "Lemon", gem: "Emerald", number: 5, day: "Wednesday", compatible: ["libra", "aquarius", "aries"], hue: 52 },
  { slug: "cancer", name: "Cancer", hindi: "कर्क", vedic: "Karka", glyph: "♋", dates: "Jun 21 – Jul 22", start: [6, 21], element: "Water", modality: "Cardinal", ruler: "Moon", traits: ["Nurturing", "Intuitive", "Protective"], strengths: "Deep empathy and fierce care for loved ones.", shadow: "Moodiness and holding on too tight.", color: "Silver", gem: "Pearl", number: 2, day: "Monday", compatible: ["scorpio", "pisces", "taurus"], hue: 200 },
  { slug: "leo", name: "Leo", hindi: "सिंह", vedic: "Simha", glyph: "♌", dates: "Jul 23 – Aug 22", start: [7, 23], element: "Fire", modality: "Fixed", ruler: "Sun", traits: ["Radiant", "Generous", "Regal"], strengths: "Warmth, leadership and creative fire.", shadow: "Pride and a hunger for applause.", color: "Gold", gem: "Ruby", number: 1, day: "Sunday", compatible: ["aries", "sagittarius", "libra"], hue: 38 },
  { slug: "virgo", name: "Virgo", hindi: "कन्या", vedic: "Kanya", glyph: "♍", dates: "Aug 23 – Sep 22", start: [8, 23], element: "Earth", modality: "Mutable", ruler: "Mercury", traits: ["Precise", "Helpful", "Analytical"], strengths: "Craft, discernment and quiet devotion.", shadow: "Over-criticism and worry.", color: "Sage", gem: "Emerald", number: 5, day: "Wednesday", compatible: ["taurus", "capricorn", "cancer"], hue: 95 },
  { slug: "libra", name: "Libra", hindi: "तुला", vedic: "Tula", glyph: "♎", dates: "Sep 23 – Oct 22", start: [9, 23], element: "Air", modality: "Cardinal", ruler: "Venus", traits: ["Harmonious", "Charming", "Fair"], strengths: "Grace, diplomacy and an eye for balance.", shadow: "Indecision and people-pleasing.", color: "Rose", gem: "Diamond", number: 6, day: "Friday", compatible: ["gemini", "aquarius", "leo"], hue: 330 },
  { slug: "scorpio", name: "Scorpio", hindi: "वृश्चिक", vedic: "Vrishchika", glyph: "♏", dates: "Oct 23 – Nov 21", start: [10, 23], element: "Water", modality: "Fixed", ruler: "Mars", traits: ["Intense", "Magnetic", "Loyal"], strengths: "Depth, focus and transformative power.", shadow: "Jealousy and secrecy.", color: "Maroon", gem: "Red Coral", number: 9, day: "Tuesday", compatible: ["cancer", "pisces", "virgo"], hue: 350 },
  { slug: "sagittarius", name: "Sagittarius", hindi: "धनु", vedic: "Dhanu", glyph: "♐", dates: "Nov 22 – Dec 21", start: [11, 22], element: "Fire", modality: "Mutable", ruler: "Jupiter", traits: ["Free", "Optimistic", "Wise"], strengths: "Vision, humour and a seeker's heart.", shadow: "Restlessness and bluntness.", color: "Saffron", gem: "Yellow Sapphire", number: 3, day: "Thursday", compatible: ["aries", "leo", "aquarius"], hue: 28 },
  { slug: "capricorn", name: "Capricorn", hindi: "मकर", vedic: "Makara", glyph: "♑", dates: "Dec 22 – Jan 19", start: [12, 22], element: "Earth", modality: "Cardinal", ruler: "Saturn", traits: ["Ambitious", "Steady", "Wise"], strengths: "Discipline and the patience to build empires.", shadow: "Rigidity and workaholism.", color: "Charcoal", gem: "Blue Sapphire", number: 8, day: "Saturday", compatible: ["taurus", "virgo", "pisces"], hue: 230 },
  { slug: "aquarius", name: "Aquarius", hindi: "कुंभ", vedic: "Kumbha", glyph: "♒", dates: "Jan 20 – Feb 18", start: [1, 20], element: "Air", modality: "Fixed", ruler: "Saturn", traits: ["Visionary", "Original", "Humane"], strengths: "Originality and care for the collective.", shadow: "Detachment and contrarianism.", color: "Electric Blue", gem: "Blue Sapphire", number: 8, day: "Saturday", compatible: ["gemini", "libra", "sagittarius"], hue: 210 },
  { slug: "pisces", name: "Pisces", hindi: "मीन", vedic: "Meena", glyph: "♓", dates: "Feb 19 – Mar 20", start: [2, 19], element: "Water", modality: "Mutable", ruler: "Jupiter", traits: ["Dreamy", "Compassionate", "Artistic"], strengths: "Imagination, empathy and spiritual depth.", shadow: "Escapism and blurred boundaries.", color: "Sea Green", gem: "Yellow Sapphire", number: 3, day: "Thursday", compatible: ["cancer", "scorpio", "capricorn"], hue: 175 },
];

export const signBySlug = (slug: string) => SIGNS.find((s) => s.slug === slug);

/** Western (tropical) sun sign from a date */
export function sunSignFromDate(d: Date): Sign {
  const v = (d.getMonth() + 1) * 100 + d.getDate();
  let best: Sign | null = null;
  let bestV = -1;
  for (const s of SIGNS) {
    const sv = s.start[0] * 100 + s.start[1];
    if (sv <= v && sv > bestV) {
      best = s;
      bestV = sv;
    }
  }
  return best ?? SIGNS[9]; // capricorn (Jan 1–19)
}
