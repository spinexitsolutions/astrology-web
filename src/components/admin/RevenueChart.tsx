"use client";

import { useState } from "react";
import { money } from "@/lib/utils";

type Pt = { label: string; revenue: number; bookings: number };

export function RevenueChart({ data, currency }: { data: Pt[]; currency: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const W = 700, H = 240, pl = 8, pr = 8, pt = 16, pb = 28;
  const maxR = Math.max(1000, ...data.map((d) => d.revenue)) * 1.15;
  const maxB = Math.max(3, ...data.map((d) => d.bookings)) * 1.2;
  const step = (W - pl - pr) / data.length;
  const bw = Math.min(26, step * 0.55);
  const y = (v: number, m: number) => pt + (H - pt - pb) * (1 - v / m);
  const line = data.map((d, i) => `${i ? "L" : "M"}${pl + step * i + step / 2},${y(d.bookings, maxB)}`).join(" ");

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-[220px] w-full sm:h-[260px]" preserveAspectRatio="none" onMouseLeave={() => setHover(null)}>
        <defs>
          <linearGradient id="rg" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#E8B86D" />
            <stop offset="1" stopColor="#C9963F" stopOpacity="0.55" />
          </linearGradient>
        </defs>
        {[0.25, 0.5, 0.75, 1].map((f) => (
          <line key={f} x1={pl} x2={W - pr} y1={y(maxR * f, maxR)} y2={y(maxR * f, maxR)} stroke="#000" strokeOpacity="0.05" />
        ))}
        {data.map((d, i) => {
          const x = pl + step * i + step / 2;
          const top = y(d.revenue, maxR);
          return (
            <g key={i} onMouseEnter={() => setHover(i)}>
              <rect x={pl + step * i} y={pt} width={step} height={H - pt - pb} fill="transparent" />
              <rect x={x - bw / 2} y={top} width={bw} height={Math.max(2, H - pb - top)} rx={6} fill="url(#rg)" opacity={hover === null || hover === i ? 1 : 0.4} style={{ transition: "opacity .2s" }} />
              {i % 2 === 0 && (
                <text x={x} y={H - 8} textAnchor="middle" fontSize="10" fill="#999">
                  {d.label}
                </text>
              )}
            </g>
          );
        })}
        <path d={line} fill="none" stroke="#111" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => (
          <circle key={i} cx={pl + step * i + step / 2} cy={y(d.bookings, maxB)} r={hover === i ? 5 : 3} fill="#111" stroke="#fff" strokeWidth="1.5" />
        ))}
      </svg>
      {hover !== null && (
        <div
          className="pointer-events-none absolute top-0 -translate-x-1/2 rounded-xl bg-neutral-900 px-3 py-2 text-[12px] text-white shadow-lg"
          style={{ left: `${((hover + 0.5) / data.length) * 100}%` }}
        >
          <div className="text-white/60">{data[hover].label}</div>
          <div className="font-medium">{money(data[hover].revenue, currency)}</div>
          <div className="text-white/70">{data[hover].bookings} bookings</div>
        </div>
      )}
    </div>
  );
}
