import { SIGNS } from "@/lib/zodiac";

const f = (n: number) => Math.round(n * 100) / 100;
const px = (r: number, a: number) => f(300 + r * Math.cos(a));
const py = (r: number, a: number) => f(300 + r * Math.sin(a));

/** Decorative astrolabe-style zodiac wheel (pure SVG, server-safe) */
export default function ZodiacWheel({ className = "", stroke = "currentColor", detailed = true }: { className?: string; stroke?: string; detailed?: boolean }) {
  const ticks = Array.from({ length: 360 / 2 });
  return (
    <svg viewBox="0 0 600 600" className={className} fill="none" aria-hidden>
      <g stroke={stroke} strokeWidth="0.6">
        <circle cx="300" cy="300" r="296" opacity="0.5" />
        <circle cx="300" cy="300" r="270" opacity="0.6" />
        <circle cx="300" cy="300" r="210" opacity="0.6" />
        <circle cx="300" cy="300" r="150" opacity="0.35" />
        <circle cx="300" cy="300" r="60" opacity="0.35" />
        {detailed &&
          ticks.map((_, i) => {
            const a = (i * 2 * Math.PI) / 180;
            const long = i % 15 === 0;
            const r1 = 296, r2 = long ? 280 : 290;
            return <line key={i} x1={px(r1, a)} y1={py(r1, a)} x2={px(r2, a)} y2={py(r2, a)} opacity={long ? 0.7 : 0.35} />;
          })}
        {SIGNS.map((_, i) => {
          const a = (i * 30 * Math.PI) / 180;
          return <line key={i} x1={px(210, a)} y1={py(210, a)} x2={px(270, a)} y2={py(270, a)} opacity="0.6" />;
        })}
        {detailed &&
          Array.from({ length: 27 }).map((_, i) => {
            const a = ((i * 360) / 27) * (Math.PI / 180);
            return <line key={i} x1={px(150, a)} y1={py(150, a)} x2={px(210, a)} y2={py(210, a)} opacity="0.25" />;
          })}
        <path d="M300 90 L482 405 L118 405 Z" opacity="0.18" />
        <path d="M300 510 L118 195 L482 195 Z" opacity="0.18" />
      </g>
      <g fill={stroke} fontSize="26" textAnchor="middle" dominantBaseline="central" style={{ fontFamily: "serif" }}>
        {SIGNS.map((s, i) => {
          const a = ((i * 30 + 15 - 90) * Math.PI) / 180;
          return (
            <text key={s.slug} x={px(240, a)} y={py(240, a)} opacity="0.85">
              {s.glyph}&#xFE0E;
            </text>
          );
        })}
      </g>
    </svg>
  );
}
