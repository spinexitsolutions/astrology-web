"use client";
import { motion, useAnimationFrame, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useRef } from "react";

function wrap(min: number, max: number, v: number) {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
}

function Row({ words, base, outline }: { words: string[]; base: number; outline?: boolean }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(vel, [0, 1000], [0, 5], { clamp: false });
  const skew = useTransform(vel, [-2000, 2000], [8, -8]);
  const dir = useRef(1);
  const xp = useTransform(x, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    let move = dir.current * base * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    move += dir.current * move * f;
    x.set(x.get() + move);
  });

  const content = [...words, ...words];
  return (
    <div className="flex overflow-hidden whitespace-nowrap">
      <motion.div style={{ x: xp, skewX: skew }} className="flex shrink-0 items-center">
        {[0, 1].map((k) => (
          <div key={k} className="flex shrink-0 items-center">
            {content.map((w, i) => (
              <span key={i} className="flex items-center">
                <span className={`display px-6 text-[clamp(48px,9vw,128px)] ${outline ? "text-transparent [-webkit-text-stroke:1px_rgba(243,238,229,.35)]" : i % 2 ? "italic text-gold" : "text-paper"}`}>{w}</span>
                <span className="text-2xl text-accent md:text-4xl">✦</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function Marquee({ words }: { words: string[] }) {
  const half = Math.ceil(words.length / 2);
  return (
    <section className="relative overflow-hidden border-y border-paper/10 py-8 md:py-12" aria-label="What we offer">
      <Row words={words.slice(0, half)} base={-2.2} />
      <Row words={words.slice(half)} base={2.2} outline />
    </section>
  );
}
