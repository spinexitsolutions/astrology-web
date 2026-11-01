"use client";
import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1], onUpdate: setV });
    return () => c.stop();
  }, [inView, to]);
  const fmt = to % 1 !== 0 ? v.toFixed(1) : v >= 100000 ? `${(v / 100000).toFixed(v >= to ? 1 : 1)}L` : Math.round(v).toLocaleString("en-IN");
  return (
    <span ref={ref} className="tabular-nums">
      {fmt}
      <span className="text-accent">{suffix}</span>
    </span>
  );
}

export default function Stats({ stats }: { stats: { label: string; value: number; suffix: string }[] }) {
  return (
    <section className="container-x py-16">
      <div className="grid grid-cols-2 border-y border-paper/10 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div key={s.label} className={`px-2 py-10 md:px-8 ${i % 2 ? "border-l border-paper/10" : ""} ${i > 1 ? "border-t border-paper/10 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}>
            <p className="display text-[clamp(44px,6vw,88px)] leading-none"><Counter to={s.value} suffix={s.suffix} /></p>
            <p className="mt-3 text-sm text-mist">{s.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
