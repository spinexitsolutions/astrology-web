/**
 * Lightweight Vedic astrology engine (no external APIs).
 * Accuracy: Sun/Moon ≈ 0.1°, planets ≈ 1° (JPL approximate Keplerian elements),
 * which is plenty for rashi/nakshatra level work in a consumer website.
 */

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
const norm = (x: number) => ((x % 360) + 360) % 360;
const sin = (d: number) => Math.sin(d * D2R);
const cos = (d: number) => Math.cos(d * D2R);

export const RASHIS = ["Mesha", "Vrishabha", "Mithuna", "Karka", "Simha", "Kanya", "Tula", "Vrishchika", "Dhanu", "Makara", "Kumbha", "Meena"];
export const RASHI_EN = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
export const RASHI_LORD = ["Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury", "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter"];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha",
  "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

export const TITHIS = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi", "Saptami", "Ashtami",
  "Navami", "Dashami", "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi",
];

export const YOGAS = [
  "Vishkambha", "Priti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda", "Sukarma", "Dhriti", "Shula",
  "Ganda", "Vriddhi", "Dhruva", "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyan",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla", "Brahma", "Indra", "Vaidhriti",
];

const KARANA_MOVABLE = ["Bava", "Balava", "Kaulava", "Taitila", "Garaja", "Vanija", "Vishti"];
export const VARAS = ["Ravivara", "Somavara", "Mangalavara", "Budhavara", "Guruvara", "Shukravara", "Shanivara"];

// ───────── time ─────────

export function julianDay(date: Date) {
  return date.getTime() / 86400000 + 2440587.5;
}

const centuries = (jd: number) => (jd - 2451545.0) / 36525;

export function lahiriAyanamsa(jd: number) {
  const T = centuries(jd);
  return 23.85305 + 1.39689 * T + 0.000308 * T * T;
}

// ───────── Sun & Moon (tropical) ─────────

export function sunLongitude(jd: number) {
  const T = centuries(jd);
  const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  const M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  const C = (1.914602 - 0.004817 * T) * sin(M) + (0.019993 - 0.000101 * T) * sin(2 * M) + 0.000289 * sin(3 * M);
  const omega = 125.04 - 1934.136 * T;
  return norm(L0 + C - 0.00569 - 0.00478 * sin(omega));
}

export function moonLongitude(jd: number) {
  const T = centuries(jd);
  const Lp = 218.3164477 + 481267.88123421 * T;
  const D = 297.8501921 + 445267.1114034 * T;
  const M = 357.5291092 + 35999.0502909 * T;
  const Mp = 134.9633964 + 477198.8675055 * T;
  const F = 93.272095 + 483202.0175233 * T;
  const terms =
    6.288774 * sin(Mp) +
    1.274027 * sin(2 * D - Mp) +
    0.658314 * sin(2 * D) +
    0.213618 * sin(2 * Mp) -
    0.185116 * sin(M) -
    0.114332 * sin(2 * F) +
    0.058793 * sin(2 * D - 2 * Mp) +
    0.057066 * sin(2 * D - M - Mp) +
    0.053322 * sin(2 * D + Mp) +
    0.045758 * sin(2 * D - M) -
    0.040923 * sin(M - Mp) -
    0.03472 * sin(D) -
    0.030383 * sin(M + Mp) +
    0.015327 * sin(2 * D - 2 * F) -
    0.012528 * sin(Mp + 2 * F) +
    0.01098 * sin(Mp - 2 * F) +
    0.010675 * sin(4 * D - Mp) +
    0.010034 * sin(3 * Mp) +
    0.008548 * sin(4 * D - 2 * Mp) -
    0.007888 * sin(2 * D + M - Mp) -
    0.006766 * sin(2 * D + M) -
    0.005163 * sin(D - Mp);
  return norm(Lp + terms);
}

export function rahuLongitude(jd: number) {
  const T = centuries(jd);
  return norm(125.04452 - 1934.136261 * T + 0.0020708 * T * T);
}

// ───────── Planets (JPL approx. elements, 1800–2050) ─────────

type El = [number, number, number, number, number, number];
const ELEMENTS: Record<string, [El, El]> = {
  Mercury: [[0.38709927, 0.20563593, 7.00497902, 252.2503235, 77.45779628, 48.33076593], [0.00000037, 0.00001906, -0.00594749, 149472.67411175, 0.16047689, -0.12534081]],
  Venus: [[0.72333566, 0.00677672, 3.39467605, 181.9790995, 131.60246718, 76.67984255], [0.0000039, -0.00004107, -0.0007889, 58517.81538729, 0.00268329, -0.27769418]],
  Earth: [[1.00000261, 0.01671123, -0.00001531, 100.46457166, 102.93768193, 0], [0.00000562, -0.00004392, -0.01294668, 35999.37244981, 0.32327364, 0]],
  Mars: [[1.52371034, 0.0933941, 1.84969142, -4.55343205, -23.94362959, 49.55953891], [0.00001847, 0.00007882, -0.00813131, 19140.30268499, 0.44441088, -0.29257343]],
  Jupiter: [[5.202887, 0.04838624, 1.30439695, 34.39644051, 14.72847983, 100.47390909], [-0.00011607, -0.00013253, -0.00183714, 3034.74612775, 0.21252668, 0.20469106]],
  Saturn: [[9.53667594, 0.05386179, 2.48599187, 49.95424423, 92.59887831, 113.66242448], [-0.0012506, -0.00050991, 0.00193609, 1222.49362201, -0.41897216, -0.28867794]],
};

function helio(name: string, T: number) {
  const [e0, r] = ELEMENTS[name];
  const [a, e, I, L, wbar, O] = e0.map((v, i) => v + r[i] * T);
  const w = wbar - O;
  const M = norm(L - wbar);
  let E = M + R2D * e * sin(M);
  for (let k = 0; k < 8; k++) {
    const dM = M - (E - R2D * e * sin(E));
    E += dM / (1 - e * cos(E));
  }
  const xp = a * (cos(E) - e);
  const yp = a * Math.sqrt(1 - e * e) * sin(E);
  const x = (cos(w) * cos(O) - sin(w) * sin(O) * cos(I)) * xp + (-sin(w) * cos(O) - cos(w) * sin(O) * cos(I)) * yp;
  const y = (cos(w) * sin(O) + sin(w) * cos(O) * cos(I)) * xp + (-sin(w) * sin(O) + cos(w) * cos(O) * cos(I)) * yp;
  const z = sin(w) * sin(I) * xp + cos(w) * sin(I) * yp;
  return { x, y, z };
}

export function planetLongitude(name: "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn", jd: number) {
  const T = centuries(jd);
  const p = helio(name, T);
  const earth = helio("Earth", T);
  return norm(Math.atan2(p.y - earth.y, p.x - earth.x) * R2D);
}

function isRetro(name: "Mercury" | "Venus" | "Mars" | "Jupiter" | "Saturn", jd: number) {
  const a = planetLongitude(name, jd - 0.5);
  const b = planetLongitude(name, jd + 0.5);
  let d = b - a;
  if (d > 180) d -= 360;
  if (d < -180) d += 360;
  return d < 0;
}

// ───────── Ascendant ─────────

export function ascendant(jd: number, lat: number, lon: number) {
  const T = centuries(jd);
  const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * T * T);
  const ramc = norm(gmst + lon);
  const eps = 23.4392911 - 0.0130042 * T;
  const asc = Math.atan2(cos(ramc), -(sin(ramc) * cos(eps) + Math.tan(lat * D2R) * sin(eps))) * R2D;
  return norm(asc);
}

// ───────── Places ─────────

export type Place = { name: string; lat: number; lon: number; tz: number };
export const PLACES: Place[] = [
  { name: "New Delhi, India", lat: 28.6139, lon: 77.209, tz: 5.5 },
  { name: "Mumbai, India", lat: 19.076, lon: 72.8777, tz: 5.5 },
  { name: "Bengaluru, India", lat: 12.9716, lon: 77.5946, tz: 5.5 },
  { name: "Kolkata, India", lat: 22.5726, lon: 88.3639, tz: 5.5 },
  { name: "Chennai, India", lat: 13.0827, lon: 80.2707, tz: 5.5 },
  { name: "Hyderabad, India", lat: 17.385, lon: 78.4867, tz: 5.5 },
  { name: "Pune, India", lat: 18.5204, lon: 73.8567, tz: 5.5 },
  { name: "Ahmedabad, India", lat: 23.0225, lon: 72.5714, tz: 5.5 },
  { name: "Jaipur, India", lat: 26.9124, lon: 75.7873, tz: 5.5 },
  { name: "Lucknow, India", lat: 26.8467, lon: 80.9462, tz: 5.5 },
  { name: "Varanasi, India", lat: 25.3176, lon: 82.9739, tz: 5.5 },
  { name: "Patna, India", lat: 25.5941, lon: 85.1376, tz: 5.5 },
  { name: "Bhopal, India", lat: 23.2599, lon: 77.4126, tz: 5.5 },
  { name: "Indore, India", lat: 22.7196, lon: 75.8577, tz: 5.5 },
  { name: "Chandigarh, India", lat: 30.7333, lon: 76.7794, tz: 5.5 },
  { name: "Amritsar, India", lat: 31.634, lon: 74.8723, tz: 5.5 },
  { name: "Dehradun, India", lat: 30.3165, lon: 78.0322, tz: 5.5 },
  { name: "Haridwar, India", lat: 29.9457, lon: 78.1642, tz: 5.5 },
  { name: "Ujjain, India", lat: 23.1765, lon: 75.7885, tz: 5.5 },
  { name: "Nagpur, India", lat: 21.1458, lon: 79.0882, tz: 5.5 },
  { name: "Surat, India", lat: 21.1702, lon: 72.8311, tz: 5.5 },
  { name: "Kochi, India", lat: 9.9312, lon: 76.2673, tz: 5.5 },
  { name: "Guwahati, India", lat: 26.1445, lon: 91.7362, tz: 5.5 },
  { name: "Bhubaneswar, India", lat: 20.2961, lon: 85.8245, tz: 5.5 },
  { name: "Kathmandu, Nepal", lat: 27.7172, lon: 85.324, tz: 5.75 },
  { name: "Dubai, UAE", lat: 25.2048, lon: 55.2708, tz: 4 },
  { name: "Singapore", lat: 1.3521, lon: 103.8198, tz: 8 },
  { name: "London, UK", lat: 51.5074, lon: -0.1278, tz: 0 },
  { name: "New York, USA", lat: 40.7128, lon: -74.006, tz: -5 },
  { name: "San Francisco, USA", lat: 37.7749, lon: -122.4194, tz: -8 },
  { name: "Toronto, Canada", lat: 43.6532, lon: -79.3832, tz: -5 },
  { name: "Sydney, Australia", lat: -33.8688, lon: 151.2093, tz: 10 },
];

/** Convert local civil date+time at a place into a UTC Date */
export function toUTC(date: string, time: string, tz: number) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = (time || "12:00").split(":").map(Number);
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - tz * 3600000);
}

// ───────── Birth chart ─────────

export type PlanetPos = {
  name: string;
  short: string;
  lon: number; // sidereal
  rashi: number;
  degree: number;
  nakshatra: number;
  pada: number;
  house: number;
  retro: boolean;
};

export type Chart = {
  jd: number;
  ayanamsa: number;
  ascendant: { lon: number; rashi: number; degree: number; nakshatra: number };
  planets: PlanetPos[];
  moonRashi: number;
  moonNakshatra: number;
  sunRashi: number;
  manglik: { isManglik: boolean; house: number };
  dasha: { lord: string; start: Date; end: Date }[];
  currentDasha?: { lord: string; start: Date; end: Date };
};

const SHORT: Record<string, string> = { Sun: "Su", Moon: "Mo", Mars: "Ma", Mercury: "Me", Jupiter: "Ju", Venus: "Ve", Saturn: "Sa", Rahu: "Ra", Ketu: "Ke" };

export const DASHA_ORDER: [string, number][] = [
  ["Ketu", 7], ["Venus", 20], ["Sun", 6], ["Moon", 10], ["Mars", 7], ["Rahu", 18], ["Jupiter", 16], ["Saturn", 19], ["Mercury", 17],
];

export function birthChart(utc: Date, lat: number, lon: number): Chart {
  const jd = julianDay(utc);
  const ay = lahiriAyanamsa(jd);
  const sid = (x: number) => norm(x - ay);

  const ascLon = sid(ascendant(jd, lat, lon));
  const ascRashi = Math.floor(ascLon / 30);

  const raw: [string, number, boolean][] = [
    ["Sun", sid(sunLongitude(jd)), false],
    ["Moon", sid(moonLongitude(jd)), false],
    ["Mars", sid(planetLongitude("Mars", jd)), isRetro("Mars", jd)],
    ["Mercury", sid(planetLongitude("Mercury", jd)), isRetro("Mercury", jd)],
    ["Jupiter", sid(planetLongitude("Jupiter", jd)), isRetro("Jupiter", jd)],
    ["Venus", sid(planetLongitude("Venus", jd)), isRetro("Venus", jd)],
    ["Saturn", sid(planetLongitude("Saturn", jd)), isRetro("Saturn", jd)],
    ["Rahu", sid(rahuLongitude(jd)), true],
    ["Ketu", sid(rahuLongitude(jd) + 180), true],
  ];

  const planets: PlanetPos[] = raw.map(([name, l, retro]) => {
    const rashi = Math.floor(l / 30);
    const nak = Math.floor(l / (360 / 27));
    return {
      name,
      short: SHORT[name],
      lon: l,
      rashi,
      degree: l % 30,
      nakshatra: nak,
      pada: Math.floor((l % (360 / 27)) / (360 / 108)) + 1,
      house: ((rashi - ascRashi + 12) % 12) + 1,
      retro,
    };
  });

  const moon = planets[1];
  const mars = planets[2];
  const manglikHouses = [1, 2, 4, 7, 8, 12];

  // Vimshottari dasha
  const nakLen = 360 / 27;
  const lordIdx = moon.nakshatra % 9;
  const traversed = (moon.lon % nakLen) / nakLen;
  const yearMs = 365.25 * 86400000;
  const dasha: Chart["dasha"] = [];
  let cursor = utc.getTime() - traversed * DASHA_ORDER[lordIdx][1] * yearMs;
  for (let i = 0; i < 9; i++) {
    const [lord, yrs] = DASHA_ORDER[(lordIdx + i) % 9];
    const start = new Date(cursor);
    cursor += yrs * yearMs;
    dasha.push({ lord, start, end: new Date(cursor) });
  }
  const now = Date.now();

  return {
    jd,
    ayanamsa: ay,
    ascendant: { lon: ascLon, rashi: ascRashi, degree: ascLon % 30, nakshatra: Math.floor(ascLon / nakLen) },
    planets,
    moonRashi: moon.rashi,
    moonNakshatra: moon.nakshatra,
    sunRashi: planets[0].rashi,
    manglik: { isManglik: manglikHouses.includes(mars.house), house: mars.house },
    dasha,
    currentDasha: dasha.find((d) => d.start.getTime() <= now && d.end.getTime() > now),
  };
}

// ───────── Panchang ─────────

function sunTimes(date: Date, lat: number, lon: number, tz: number) {
  // NOAA-style sunrise equation, returns local hours
  const y = date.getUTCFullYear();
  const start = Date.UTC(y, 0, 0);
  const N = Math.floor((date.getTime() - start) / 86400000);
  const gamma = ((2 * Math.PI) / 365) * (N - 1);
  const eqTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const decl = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const latR = lat * D2R;
  const cosH = (Math.cos(90.833 * D2R) - Math.sin(latR) * Math.sin(decl)) / (Math.cos(latR) * Math.cos(decl));
  const ha = Math.acos(Math.max(-1, Math.min(1, cosH))) * R2D;
  const rise = (720 - 4 * (lon + ha) - eqTime) / 60 + tz;
  const set = (720 - 4 * (lon - ha) - eqTime) / 60 + tz;
  return { rise, set };
}

export const fmtHours = (h: number) => {
  const hh = Math.floor(((h % 24) + 24) % 24);
  const mm = Math.round((h - Math.floor(h)) * 60) % 60;
  const ampm = hh >= 12 ? "PM" : "AM";
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, "0")} ${ampm}`;
};

export type Panchang = {
  date: Date;
  vara: string;
  tithi: { name: string; paksha: "Shukla" | "Krishna"; index: number; percent: number };
  nakshatra: { name: string; index: number; percent: number };
  yoga: string;
  karana: string;
  sunRashi: number;
  moonRashi: number;
  sunrise: string;
  sunset: string;
  rahuKaal: string;
  yamaganda: string;
  gulika: string;
  abhijit: string;
  moonPhase: number; // 0..1 (0 new, .5 full)
  moonIllumination: number;
  riseH: number;
  setH: number;
  weekday: number;
};

const CHOG = ["Udveg", "Chal", "Labh", "Amrit", "Kaal", "Shubh", "Rog"];
const CHOG_START = [0, 3, 6, 2, 5, 1, 4];
export const CHOG_NATURE: Record<string, "good" | "neutral" | "bad"> = { Amrit: "good", Shubh: "good", Labh: "good", Chal: "neutral", Udveg: "bad", Kaal: "bad", Rog: "bad" };

/** Day Choghadiya — eight auspicious/inauspicious windows between sunrise and sunset */
export function choghadiya(p: Panchang) {
  const part = (p.setH - p.riseH) / 8;
  return Array.from({ length: 8 }, (_, i) => {
    const name = CHOG[(CHOG_START[p.weekday] + i) % 7];
    return { name, nature: CHOG_NATURE[name], from: fmtHours(p.riseH + i * part), to: fmtHours(p.riseH + (i + 1) * part) };
  });
}

export function panchang(date: Date, place: Place = PLACES[0]): Panchang {
  const jd = julianDay(date);
  const ay = lahiriAyanamsa(jd);
  const sunT = sunLongitude(jd);
  const moonT = moonLongitude(jd);
  const sun = norm(sunT - ay);
  const moon = norm(moonT - ay);
  const diff = norm(moon - sun);

  const tIdx = Math.floor(diff / 12); // 0..29
  const paksha = tIdx < 15 ? "Shukla" : "Krishna";
  const inPaksha = tIdx % 15;
  const tithiName = inPaksha === 14 ? (paksha === "Shukla" ? "Purnima" : "Amavasya") : TITHIS[inPaksha];

  const nakLen = 360 / 27;
  const nIdx = Math.floor(moon / nakLen);
  const yIdx = Math.floor(norm(sun + moon) / nakLen);

  const kIdx = Math.floor(diff / 6);
  let karana: string;
  if (kIdx === 0) karana = "Kimstughna";
  else if (kIdx >= 57) karana = ["Shakuni", "Chatushpada", "Naga"][kIdx - 57];
  else karana = KARANA_MOVABLE[(kIdx - 1) % 7];

  const local = new Date(date.getTime() + place.tz * 3600000);
  const weekday = local.getUTCDay();
  const { rise, set } = sunTimes(date, place.lat, place.lon, place.tz);
  const part = (set - rise) / 8;
  const slot = (n: number) => `${fmtHours(rise + (n - 1) * part)} – ${fmtHours(rise + n * part)}`;
  const RAHU = [8, 2, 7, 5, 6, 4, 3];
  const YAMA = [5, 4, 3, 2, 1, 7, 6];
  const GULI = [7, 6, 5, 4, 3, 2, 1];
  const mid = (rise + set) / 2;

  return {
    date,
    vara: VARAS[weekday],
    tithi: { name: tithiName, paksha, index: tIdx, percent: ((diff % 12) / 12) * 100 },
    nakshatra: { name: NAKSHATRAS[nIdx], index: nIdx, percent: ((moon % nakLen) / nakLen) * 100 },
    yoga: YOGAS[yIdx],
    karana,
    sunRashi: Math.floor(sun / 30),
    moonRashi: Math.floor(moon / 30),
    sunrise: fmtHours(rise),
    sunset: fmtHours(set),
    rahuKaal: slot(RAHU[weekday]),
    yamaganda: slot(YAMA[weekday]),
    gulika: slot(GULI[weekday]),
    abhijit: `${fmtHours(mid - 0.4)} – ${fmtHours(mid + 0.4)}`,
    moonPhase: diff / 360,
    moonIllumination: (1 - cos(diff)) / 2,
    riseH: rise,
    setH: set,
    weekday,
  };
}

// ───────── Ashtakoota Gun Milan ─────────

const VARNA_BY_RASHI = [3, 2, 1, 4, 3, 2, 1, 4, 3, 2, 1, 4]; // 4 Brahmin … 1 Shudra
const VARNA_NAME: Record<number, string> = { 4: "Brahmin", 3: "Kshatriya", 2: "Vaishya", 1: "Shudra" };
// 0 Chatushpada, 1 Manava, 2 Jalachara, 3 Vanachara, 4 Keeta
const VASHYA_BY_RASHI = [0, 0, 1, 2, 3, 1, 1, 4, 0, 2, 1, 2];
const VASHYA_NAME = ["Chatushpada", "Manava", "Jalachara", "Vanachara", "Keeta"];
const VASHYA_MATRIX = [
  [2, 1, 1, 0.5, 1],
  [1, 2, 0.5, 0, 1],
  [1, 0.5, 2, 1, 1],
  [0.5, 0, 1, 2, 0],
  [1, 1, 1, 0, 2],
];
const YONI = ["Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog", "Cat", "Sheep", "Cat", "Rat", "Rat", "Cow", "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer", "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse", "Lion", "Cow", "Elephant"];
const YONI_ENEMY: [string, string][] = [["Horse", "Buffalo"], ["Elephant", "Lion"], ["Sheep", "Monkey"], ["Serpent", "Mongoose"], ["Dog", "Deer"], ["Cat", "Rat"], ["Cow", "Tiger"]];
const GANA = ["Deva", "Manushya", "Rakshasa", "Manushya", "Deva", "Manushya", "Deva", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Deva", "Rakshasa", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva", "Rakshasa", "Rakshasa", "Manushya", "Manushya", "Deva"];
const NADI = ["Adi", "Madhya", "Antya", "Antya", "Madhya", "Adi"];

const FRIENDS: Record<string, [string[], string[], string[]]> = {
  Sun: [["Moon", "Mars", "Jupiter"], ["Mercury"], ["Venus", "Saturn"]],
  Moon: [["Sun", "Mercury"], ["Mars", "Jupiter", "Venus", "Saturn"], []],
  Mars: [["Sun", "Moon", "Jupiter"], ["Venus", "Saturn"], ["Mercury"]],
  Mercury: [["Sun", "Venus"], ["Mars", "Jupiter", "Saturn"], ["Moon"]],
  Jupiter: [["Sun", "Moon", "Mars"], ["Saturn"], ["Mercury", "Venus"]],
  Venus: [["Mercury", "Saturn"], ["Mars", "Jupiter"], ["Sun", "Moon"]],
  Saturn: [["Mercury", "Venus"], ["Jupiter"], ["Sun", "Moon", "Mars"]],
};
const rel = (a: string, b: string) => (a === b ? 2 : FRIENDS[a][0].includes(b) ? 2 : FRIENDS[a][1].includes(b) ? 1 : 0);

export type Koota = { name: string; max: number; score: number; boy: string; girl: string; meaning: string };

export function gunMilan(boy: { rashi: number; nak: number }, girl: { rashi: number; nak: number }) {
  const k: Koota[] = [];

  const bv = VARNA_BY_RASHI[boy.rashi], gv = VARNA_BY_RASHI[girl.rashi];
  k.push({ name: "Varna", max: 1, score: bv >= gv ? 1 : 0, boy: VARNA_NAME[bv], girl: VARNA_NAME[gv], meaning: "Spiritual compatibility & ego" });

  const bva = VASHYA_BY_RASHI[boy.rashi], gva = VASHYA_BY_RASHI[girl.rashi];
  k.push({ name: "Vashya", max: 2, score: VASHYA_MATRIX[bva][gva], boy: VASHYA_NAME[bva], girl: VASHYA_NAME[gva], meaning: "Mutual attraction & influence" });

  const t1 = (((boy.nak - girl.nak + 27) % 27) + 1) % 9;
  const t2 = (((girl.nak - boy.nak + 27) % 27) + 1) % 9;
  const bad = [3, 5, 7];
  const tara = (bad.includes(t1) ? 0 : 1.5) + (bad.includes(t2) ? 0 : 1.5);
  k.push({ name: "Tara", max: 3, score: tara, boy: NAKSHATRAS[boy.nak], girl: NAKSHATRAS[girl.nak], meaning: "Destiny & wellbeing" });

  const by = YONI[boy.nak], gy = YONI[girl.nak];
  const enemy = YONI_ENEMY.some(([a, b]) => (a === by && b === gy) || (a === gy && b === by));
  k.push({ name: "Yoni", max: 4, score: by === gy ? 4 : enemy ? 0 : 2, boy: by, girl: gy, meaning: "Physical & intimate harmony" });

  const bl = RASHI_LORD[boy.rashi], gl = RASHI_LORD[girl.rashi];
  const [ra, rb] = [rel(bl, gl), rel(gl, bl)].sort((x, y) => y - x);
  const GM: Record<string, number> = { "2-2": 5, "2-1": 4, "1-1": 3, "2-0": 1, "1-0": 0.5, "0-0": 0 };
  k.push({ name: "Graha Maitri", max: 5, score: GM[`${ra}-${rb}`], boy: bl, girl: gl, meaning: "Mental wavelength & friendship" });

  const bg = GANA[boy.nak], gg = GANA[girl.nak];
  let gana = 0;
  if (bg === gg) gana = 6;
  else if (bg === "Deva" && gg === "Manushya") gana = 6;
  else if (bg === "Manushya" && gg === "Deva") gana = 5;
  else if (bg === "Rakshasa" && gg === "Deva") gana = 1;
  k.push({ name: "Gana", max: 6, score: gana, boy: bg, girl: gg, meaning: "Temperament & nature" });

  const d = ((boy.rashi - girl.rashi + 12) % 12) + 1;
  const d2 = ((girl.rashi - boy.rashi + 12) % 12) + 1;
  const pair = [Math.min(d, d2), Math.max(d, d2)].join("/");
  const bhakoot = ["2/12", "5/9", "6/8"].includes(pair) ? 0 : 7;
  k.push({ name: "Bhakoot", max: 7, score: bhakoot, boy: RASHIS[boy.rashi], girl: RASHIS[girl.rashi], meaning: "Love, family & prosperity" });

  const bn = NADI[boy.nak % 6], gn = NADI[girl.nak % 6];
  k.push({ name: "Nadi", max: 8, score: bn === gn ? 0 : 8, boy: bn, girl: gn, meaning: "Health & progeny" });

  const total = k.reduce((s, x) => s + x.score, 0);
  const verdict =
    total >= 32 ? "Excellent — a rare, blessed match." :
    total >= 25 ? "Very good — strong foundation for marriage." :
    total >= 18 ? "Acceptable — compatible with conscious effort." :
    "Challenging — consult an astrologer for remedies.";
  return { kootas: k, total, verdict };
}

// ───────── Numerology ─────────

const PY: Record<string, number> = {};
"abcdefghijklmnopqrstuvwxyz".split("").forEach((c, i) => (PY[c] = (i % 9) + 1));

export function reduce(n: number, keepMaster = true): number {
  while (n > 9 && !(keepMaster && (n === 11 || n === 22 || n === 33))) {
    n = String(n).split("").reduce((s, d) => s + Number(d), 0);
  }
  return n;
}

export const NUMBER_MEANINGS: Record<number, { title: string; text: string; planet: string }> = {
  1: { title: "The Leader", planet: "Sun", text: "Independent, original and born to initiate. You shine brightest when you trust your own path." },
  2: { title: "The Diplomat", planet: "Moon", text: "Sensitive, intuitive and cooperative. You bring harmony and see what others miss." },
  3: { title: "The Communicator", planet: "Jupiter", text: "Expressive, joyful and creative. Words, art and optimism are your gifts." },
  4: { title: "The Builder", planet: "Rahu", text: "Practical, loyal and disciplined. You create foundations that outlast you." },
  5: { title: "The Explorer", planet: "Mercury", text: "Free, curious and adaptable. Change is your teacher and travel your medicine." },
  6: { title: "The Nurturer", planet: "Venus", text: "Loving, responsible and artistic. Home, beauty and service fulfil you." },
  7: { title: "The Seeker", planet: "Ketu", text: "Analytical, spiritual and introspective. You are here to find deeper truths." },
  8: { title: "The Powerhouse", planet: "Saturn", text: "Ambitious, resilient and karmic. Mastery of material life is your path." },
  9: { title: "The Humanitarian", planet: "Mars", text: "Compassionate, brave and idealistic. You serve something larger than yourself." },
  11: { title: "The Illuminator", planet: "Moon ✦", text: "A master number of intuition and inspiration — a channel for higher insight." },
  22: { title: "The Master Builder", planet: "Rahu ✦", text: "A master number that turns grand visions into lasting reality." },
  33: { title: "The Master Teacher", planet: "Jupiter ✦", text: "A master number of compassion, healing and selfless guidance." },
};

export function numerology(name: string, dob: string) {
  const [y, m, d] = dob.split("-").map(Number);
  const digits = (n: number) => String(n).split("").reduce((s, x) => s + Number(x), 0);
  const lifePath = reduce(reduce(digits(y)) + reduce(digits(m)) + reduce(digits(d)));
  const letters = name.toLowerCase().replace(/[^a-z]/g, "").split("");
  const vowels = letters.filter((c) => "aeiou".includes(c));
  const cons = letters.filter((c) => !"aeiou".includes(c));
  const sum = (arr: string[]) => arr.reduce((s, c) => s + (PY[c] || 0), 0);
  const now = new Date();
  return {
    lifePath,
    destiny: reduce(sum(letters)),
    soulUrge: reduce(sum(vowels)),
    personality: reduce(sum(cons)),
    birthday: reduce(d),
    personalYear: reduce(reduce(digits(now.getFullYear())) + reduce(m) + reduce(d), false),
    lucky: { numbers: [reduce(d, false), lifePath > 9 ? reduce(lifePath, false) : lifePath], },
  };
}

// ───────── Seeded randomness (for generated horoscopes) ─────────

export function seeded(seed: string) {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}
