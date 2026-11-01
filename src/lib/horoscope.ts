import { seeded } from "./astro";
import type { HoroscopeOverride } from "./types";
import { SIGNS } from "./zodiac";

export type Period = "daily" | "weekly" | "monthly";

export type Reading = {
  sign: string;
  period: Period;
  periodLabel: string;
  key: string;
  text: string;
  love: string;
  career: string;
  health: string;
  luckyNumber: number;
  luckyColor: string;
  luckyTime: string;
  mood: string;
  compatibility: string;
  scores: { love: number; career: number; health: number; money: number };
};

const OPEN = [
  "The Moon lights up your {house}, and something you have been circling quietly finally asks for a decision.",
  "A softer rhythm settles in as {planet} moves through a supportive angle to your sign.",
  "{planet} nudges your {house} today — expect conversations that open unexpected doors.",
  "There is momentum in the air. With {planet} on your side, small, deliberate steps compound quickly.",
  "An old thread resurfaces under {planet}'s gaze. Tie it off gracefully instead of pulling it apart.",
  "You are more magnetic than you realise. {planet} amplifies your natural {trait} energy.",
  "The sky favours clarity over speed. Let {planet} slow you down just enough to see the whole picture.",
  "Your {house} is the stage for a quiet breakthrough — less fireworks, more foundation.",
];
const MID = [
  "Trust what your body tells you before your mind starts negotiating.",
  "Say the honest thing kindly; it lands better than you fear.",
  "A message or meeting carries more weight than it first appears.",
  "Declutter one corner of your life and watch your focus return.",
  "Generosity comes back to you faster than usual — give without keeping score.",
  "Resist comparing your chapter one to someone else's chapter twenty.",
  "An idea that felt too big last month now looks perfectly doable.",
  "Protect your mornings; that is where your best thinking lives right now.",
];
const CLOSE = [
  "By evening, a sense of quiet confidence returns.",
  "Remember: delays now are redirections, not denials.",
  "Light a diya at dusk and set one clear intention.",
  "The universe rewards the version of you that shows up consistently.",
  "End the day with gratitude — it tunes you to the right frequency.",
  "What you nurture with patience now blossoms by the next new Moon.",
];
const LOVE = [
  "Romance prefers small gestures today — a thoughtful message beats grand plans.",
  "If single, someone from your wider circle notices you. Be approachable.",
  "Listen more than you speak; your partner needs to feel heard.",
  "Old misunderstandings soften. A sincere apology goes a long way.",
  "Venus favours playful dates and shared laughter.",
  "Give each other space — absence today makes reunion sweeter.",
];
const CAREER = [
  "A senior person takes notice of your consistency. Keep delivering.",
  "Avoid signing anything in a hurry; read the fine print twice.",
  "Collaboration beats competition — share credit generously.",
  "A financial decision benefits from one more night of sleep.",
  "New skills you pick up now pay off within months.",
  "Pitch your idea — the timing is better than you think.",
];
const HEALTH = [
  "Hydrate and walk after meals; digestion is your focus.",
  "Prioritise sleep — your energy reserves need topping up.",
  "Stretch your back and shoulders; you carry more than you admit.",
  "A short pranayama practice resets your nervous system.",
  "Ease up on caffeine after noon for calmer evenings.",
  "Sunlight in the morning lifts your mood noticeably.",
];
const COLORS = ["Saffron", "Ivory", "Emerald", "Royal Blue", "Maroon", "Lavender", "Gold", "Silver", "Coral", "Turquoise", "Rose Pink", "Mustard"];
const MOODS = ["Reflective", "Bold", "Tender", "Focused", "Playful", "Grounded", "Inspired", "Serene"];
const HOUSES = ["house of self", "house of wealth", "house of communication", "house of home", "house of creativity", "house of service", "house of partnerships", "house of transformation", "house of fortune", "house of career", "house of gains", "house of solitude"];
const PLANETS = ["Jupiter", "Venus", "Mercury", "the Moon", "Mars", "Saturn", "the Sun"];

export function periodKey(period: Period, d = new Date()) {
  const ist = new Date(d.getTime() + 5.5 * 3600000);
  if (period === "daily") return ist.toISOString().slice(0, 10);
  if (period === "monthly") return ist.toISOString().slice(0, 7) + "-01";
  const day = ist.getUTCDay();
  const monday = new Date(ist.getTime() - ((day + 6) % 7) * 86400000);
  return monday.toISOString().slice(0, 10);
}

export function periodLabel(period: Period, key: string) {
  const d = new Date(key + "T00:00:00Z");
  const fmt = (x: Date, o: Intl.DateTimeFormatOptions) => x.toLocaleDateString("en-IN", { ...o, timeZone: "UTC" });
  if (period === "daily") return fmt(d, { weekday: "long", day: "numeric", month: "long" });
  if (period === "monthly") return fmt(d, { month: "long", year: "numeric" });
  const end = new Date(d.getTime() + 6 * 86400000);
  return `${fmt(d, { day: "numeric", month: "short" })} – ${fmt(end, { day: "numeric", month: "short" })}`;
}

export function getReading(signSlug: string, period: Period, overrides: HoroscopeOverride[] = [], date = new Date()): Reading {
  const key = periodKey(period, date);
  const sign = SIGNS.find((s) => s.slug === signSlug) ?? SIGNS[0];
  const r = seeded(`${signSlug}:${period}:${key}`);
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const fill = (s: string) =>
    s.replace("{house}", pick(HOUSES)).replace("{planet}", pick(PLANETS)).replace("{trait}", sign.traits[Math.floor(r() * 3)].toLowerCase());
  const score = () => 2 + Math.round(r() * 3);
  const hr = 6 + Math.floor(r() * 14);

  const base: Reading = {
    sign: signSlug,
    period,
    periodLabel: periodLabel(period, key),
    key,
    text: [fill(pick(OPEN)), pick(MID), pick(CLOSE)].join(" ") + (period !== "daily" ? " " + pick(MID) : ""),
    love: pick(LOVE),
    career: pick(CAREER),
    health: pick(HEALTH),
    luckyNumber: 1 + Math.floor(r() * 9),
    luckyColor: pick(COLORS),
    luckyTime: `${((hr + 11) % 12) + 1}:00 ${hr >= 12 ? "PM" : "AM"}`,
    mood: pick(MOODS),
    compatibility: pick(sign.compatible),
    scores: { love: score(), career: score(), health: score(), money: score() },
  };

  const o = overrides.find((x) => x.sign === signSlug && x.period === period && x.date === key);
  if (o) {
    return {
      ...base,
      text: o.text || base.text,
      love: o.love || base.love,
      career: o.career || base.career,
      health: o.health || base.health,
      luckyNumber: o.luckyNumber || base.luckyNumber,
      luckyColor: o.luckyColor || base.luckyColor,
    };
  }
  return base;
}
