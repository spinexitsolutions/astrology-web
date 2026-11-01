import type { PlanetPos } from "@/lib/astro";

const CENTER: [number, number][] = [
  [200, 100], [100, 42], [42, 100], [100, 200], [42, 300], [100, 358],
  [200, 300], [300, 358], [358, 300], [300, 200], [358, 100], [300, 42],
];
const NUM: [number, number][] = [
  [200, 178], [100, 86], [86, 100], [178, 200], [86, 300], [100, 314],
  [200, 222], [300, 314], [314, 300], [222, 200], [314, 100], [300, 86],
];

/** North-Indian style Kundli. `lagna` is the rashi index (0–11) of house 1. */
export default function ChartSVG({ lagna, planets, title }: { lagna: number; planets: PlanetPos[]; title?: string }) {
  const byHouse: Record<number, PlanetPos[]> = {};
  for (const p of planets) {
    const h = ((p.rashi - lagna + 12) % 12) + 1;
    (byHouse[h] ||= []).push(p);
  }
  return (
    <svg viewBox="-4 -4 408 408" className="h-auto w-full" role="img" aria-label={title || "Birth chart"}>
      <defs>
        <linearGradient id="chart-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--accent) 12%, #0e0e16)" />
          <stop offset="100%" stopColor="#0b0b12" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="400" height="400" rx="6" fill="url(#chart-bg)" stroke="var(--accent)" strokeWidth="1.4" />
      <g stroke="color-mix(in oklab, var(--accent) 60%, transparent)" strokeWidth="1" fill="none">
        <path d="M0 0 L400 400 M400 0 L0 400" />
        <path d="M200 0 L400 200 L200 400 L0 200 Z" />
      </g>
      <path d="M200 0 L300 100 L200 200 L100 100 Z" fill="color-mix(in oklab, var(--accent) 10%, transparent)" />
      {NUM.map(([x, y], i) => (
        <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="rgba(243,238,229,.4)" fontFamily="var(--font-geist-mono)">
          {((lagna + i) % 12) + 1}
        </text>
      ))}
      {i0(byHouse).map(([h, ps]) => {
        const [cx, cy] = CENTER[h - 1];
        const start = cy - ((ps.length - 1) * 15) / 2;
        return ps.map((p, k) => (
          <text key={p.name} x={cx} y={start + k * 15} textAnchor="middle" dominantBaseline="central" fontSize="13" fill={p.name === "Moon" ? "var(--accent)" : "#f3eee5"} fontFamily="var(--font-geist)">
            {p.short}
            <tspan fontSize="9" fill="rgba(243,238,229,.5)">{Math.floor(p.degree)}°{p.retro && p.name !== "Rahu" && p.name !== "Ketu" ? "ᴿ" : ""}</tspan>
          </text>
        ));
      })}
      <text x="200" y="128" textAnchor="middle" fontSize="10" fill="var(--accent)" fontFamily="var(--font-geist-mono)" letterSpacing="2">ASC</text>
    </svg>
  );
}

function i0(o: Record<number, PlanetPos[]>) {
  return Object.entries(o).map(([h, v]) => [Number(h), v] as [number, PlanetPos[]]);
}
