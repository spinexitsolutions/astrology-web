"use client";
import type { MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { birthChart, NAKSHATRAS, RASHIS } from "@/lib/astro";
import { SIGNS } from "@/lib/zodiac";

/**
 * Live orrery — today's real sidereal planet positions on a tilted, slowly
 * rotating zodiac ring. Geometry is projected manually (2.5D) and written
 * straight to the DOM every frame, so React never re-renders during animation.
 */

type Body = { name: string; glyph: string; r: number; size: number; color: string };
const BODIES: Body[] = [
  { name: "Moon", glyph: "☽", r: 120, size: 9, color: "#f5f0e8" },
  { name: "Mercury", glyph: "☿", r: 168, size: 5, color: "#9fd4ff" },
  { name: "Venus", glyph: "♀", r: 214, size: 7, color: "#ffc4dc" },
  { name: "Sun", glyph: "☉", r: 262, size: 16, color: "var(--accent)" },
  { name: "Mars", glyph: "♂", r: 310, size: 7, color: "#ff5b4a" },
  { name: "Jupiter", glyph: "♃", r: 358, size: 12, color: "#ffb27a" },
  { name: "Saturn", glyph: "♄", r: 404, size: 10, color: "#e6d29b" },
  { name: "Rahu", glyph: "☊", r: 446, size: 5, color: "var(--accent-2)" },
  { name: "Ketu", glyph: "☋", r: 446, size: 5, color: "var(--accent-2)" },
];
const RING_IN = 470;
const RING_OUT = 520;
const D2R = Math.PI / 180;

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));

export default function Orrery({ progress, className = "" }: { progress: MotionValue<number>; className?: string }) {
  const [lons, setLons] = useState<number[] | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const orbitRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const ringRefs = useRef<(SVGEllipseElement | null)[]>([]);
  const glyphRefs = useRef<(SVGTextElement | null)[]>([]);
  const tickRefs = useRef<(SVGLineElement | null)[]>([]);
  const bodyRefs = useRef<(SVGGElement | null)[]>([]);
  const haloRef = useRef<SVGEllipseElement | null>(null);

  useEffect(() => {
    const c = birthChart(new Date(), 28.6139, 77.209);
    const byName = Object.fromEntries(c.planets.map((p) => [p.name, p]));
    setLons(BODIES.map((b) => byName[b.name].lon));
    setLabels(BODIES.map((b) => {
      const p = byName[b.name];
      return `${b.name} · ${Math.floor(p.degree)}° ${RASHIS[p.rashi]}${b.name === "Moon" ? ` · ${NAKSHATRAS[p.nakshatra]}` : ""}`;
    }));
  }, []);

  useEffect(() => {
    if (!lons) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let last = performance.now();
    let spin = 0;
    const m = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      m.tx = e.clientX / window.innerWidth - 0.5;
      m.ty = e.clientY / window.innerHeight - 0.5;
    };
    window.addEventListener("pointermove", onMove);

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(64, now - last);
      last = now;
      if (!reduce) spin += dt * 0.0016;
      m.x += (m.tx - m.x) * 0.05;
      m.y += (m.ty - m.y) * 0.05;

      const p = progress.get();
      const flat = ease(clamp((p - 0.12) / 0.5));
      const tilt = clamp(0.3 + 0.7 * flat - m.y * 0.12 * (1 - flat), 0.18, 1);
      const rot = spin - p * 140 + m.x * 14 * (1 - flat) - 90;
      const proj = (r: number, deg: number) => {
        const a = (deg + rot) * D2R;
        return [r * Math.cos(a), r * Math.sin(a) * tilt, Math.sin(a)] as const;
      };

      orbitRefs.current.forEach((el, i) => el?.setAttribute("ry", String(BODIES[i].r * tilt)));
      ringRefs.current.forEach((el, i) => el?.setAttribute("ry", String([RING_IN, RING_OUT][i] * tilt)));
      haloRef.current?.setAttribute("ry", String(60 * tilt));

      tickRefs.current.forEach((el, i) => {
        if (!el) return;
        const deg = i * 5;
        const long = i % 6 === 0;
        const [x1, y1] = proj(RING_OUT, deg);
        const [x2, y2] = proj(long ? RING_IN : RING_OUT - 14, deg);
        el.setAttribute("x1", x1.toFixed(1));
        el.setAttribute("y1", y1.toFixed(1));
        el.setAttribute("x2", x2.toFixed(1));
        el.setAttribute("y2", y2.toFixed(1));
      });
      glyphRefs.current.forEach((el, i) => {
        if (!el) return;
        const [x, y, z] = proj((RING_IN + RING_OUT) / 2, i * 30 + 15);
        el.setAttribute("x", x.toFixed(1));
        el.setAttribute("y", y.toFixed(1));
        el.style.opacity = String(0.35 + 0.65 * (flat + (1 - flat) * (z + 1) / 2));
      });
      bodyRefs.current.forEach((el, i) => {
        if (!el) return;
        const [x, y, z] = proj(BODIES[i].r, lons[i]);
        const depth = flat + (1 - flat) * ((z + 1) / 2);
        el.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(0.7 + 0.45 * depth).toFixed(3)})`);
        el.style.opacity = String(0.4 + 0.6 * depth);
      });
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [lons, progress]);

  return (
    <svg viewBox="-560 -560 1120 1120" className={className} style={{ opacity: lons ? 1 : 0, transition: "opacity 1.6s cubic-bezier(.16,1,.3,1)" }} aria-label="Live positions of the nine grahas right now" role="img">
      <defs>
        <radialGradient id="orr-sun">
          <stop offset="0%" stopColor="#fff2e6" />
          <stop offset="35%" stopColor="var(--accent)" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="orr-earth">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="var(--accent-2)" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="orr-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity=".9" />
          <stop offset="50%" stopColor="#ff2d7a" stopOpacity=".5" />
          <stop offset="100%" stopColor="var(--accent-2)" stopOpacity=".9" />
        </linearGradient>
      </defs>

      {/* zodiac band */}
      {[RING_IN, RING_OUT].map((r, i) => (
        <ellipse key={r} ref={(el) => { ringRefs.current[i] = el; }} cx="0" cy="0" rx={r} ry={r * 0.3} fill="none" stroke="url(#orr-ring)" strokeWidth={i ? 1.4 : 0.8} />
      ))}
      <g stroke="rgba(245,240,232,.35)" strokeWidth="0.8">
        {Array.from({ length: 72 }).map((_, i) => (
          <line key={i} ref={(el) => { tickRefs.current[i] = el; }} />
        ))}
      </g>
      <g fill="rgba(245,240,232,.9)" fontSize="26" textAnchor="middle" dominantBaseline="central">
        {SIGNS.map((s, i) => (
          <text key={s.slug} ref={(el) => { glyphRefs.current[i] = el; }}>{s.glyph}&#xFE0E;</text>
        ))}
      </g>

      {/* orbits */}
      <g fill="none" stroke="rgba(245,240,232,.13)" strokeWidth="1">
        {BODIES.slice(0, 7).map((b, i) => (
          <ellipse key={b.name} ref={(el) => { orbitRefs.current[i] = el; }} rx={b.r} ry={b.r * 0.3} strokeDasharray={i % 2 ? "3 7" : undefined} />
        ))}
      </g>

      {/* you, at the centre */}
      <ellipse ref={haloRef} rx="60" ry="18" fill="none" stroke="var(--accent-2)" strokeOpacity=".5">
        <animate attributeName="rx" values="40;90;40" dur="5s" repeatCount="indefinite" />
        <animate attributeName="stroke-opacity" values=".6;0;.6" dur="5s" repeatCount="indefinite" />
      </ellipse>
      <circle r="30" fill="url(#orr-earth)" />
      <circle r="5" fill="#fff" />

      {lons &&
        BODIES.map((b, i) => (
          <g key={b.name} ref={(el) => { bodyRefs.current[i] = el; }} style={{ transition: "opacity .2s" }}>
            {b.name === "Sun" && <circle r="60" fill="url(#orr-sun)" />}
            <circle r={b.size} fill={b.color} />
            {b.name === "Saturn" && <ellipse rx="20" ry="5" fill="none" stroke={b.color} strokeWidth="1.5" transform="rotate(-18)" />}
            <g className="max-md:hidden">
              <line x1={b.size + 6} y1="0" x2={b.size + 26} y2="-18" stroke="rgba(245,240,232,.35)" />
              <text x={b.size + 30} y="-22" fontSize="15" fill="rgba(245,240,232,.85)" style={{ fontFamily: "var(--font-sans)", letterSpacing: "-0.01em" }}>
                <tspan fill={b.color} fontSize="17">{b.glyph}&#xFE0E; </tspan>
                {labels[i]}
              </text>
            </g>
          </g>
        ))}
    </svg>
  );
}
