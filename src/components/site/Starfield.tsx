"use client";
import { useEffect, useRef } from "react";

/** GPU-cheap canvas starfield with twinkle + mouse parallax + occasional shooting star */
export default function Starfield({ density = 0.00018, className = "" }: { density?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const c = ref.current!;
    const ctx = c.getContext("2d")!;
    let w = 0, h = 0, dpr = 1, raf = 0;
    let stars: { x: number; y: number; r: number; p: number; s: number; z: number }[] = [];
    const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
    let shoot: { x: number; y: number; vx: number; vy: number; life: number } | null = null;
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#ff5a1f";
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = c.clientWidth;
      h = c.clientHeight;
      c.width = w * dpr;
      c.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.floor(w * h * density);
      stars = Array.from({ length: n }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.2 + 0.2,
        p: Math.random() * Math.PI * 2,
        s: 0.5 + Math.random() * 1.5,
        z: Math.random(),
      }));
    };
    const onMove = (e: PointerEvent) => {
      mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
      mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    let visible = true;
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(c);

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!visible) return;
      mouse.x += (mouse.tx - mouse.x) * 0.04;
      mouse.y += (mouse.ty - mouse.y) * 0.04;
      ctx.clearRect(0, 0, w, h);
      const col = getComputedStyle(c).color;
      for (const s of stars) {
        const a = reduce ? 0.7 : 0.35 + 0.65 * Math.abs(Math.sin(t * 0.001 * s.s + s.p));
        const px = s.x - mouse.x * 14 * s.z;
        const py = s.y - mouse.y * 14 * s.z;
        ctx.globalAlpha = a;
        ctx.fillStyle = s.z > 0.94 ? accent : col;
        ctx.beginPath();
        ctx.arc(px, py, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduce) {
        if (!shoot && Math.random() < 0.003) {
          shoot = { x: Math.random() * w * 0.8, y: Math.random() * h * 0.3, vx: 7 + Math.random() * 4, vy: 2.5 + Math.random() * 2, life: 1 };
        }
        if (shoot) {
          const g = ctx.createLinearGradient(shoot.x, shoot.y, shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
          g.addColorStop(0, `rgba(255,200,170,${shoot.life})`);
          g.addColorStop(1, "rgba(255,200,170,0)");
          ctx.globalAlpha = 1;
          ctx.strokeStyle = g;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(shoot.x, shoot.y);
          ctx.lineTo(shoot.x - shoot.vx * 14, shoot.y - shoot.vy * 14);
          ctx.stroke();
          shoot.x += shoot.vx;
          shoot.y += shoot.vy;
          shoot.life -= 0.012;
          if (shoot.life <= 0) shoot = null;
        }
      }
      ctx.globalAlpha = 1;
    };

    resize();
    raf = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onMove);
    };
  }, [density]);

  return <canvas ref={ref} aria-hidden className={`pointer-events-none absolute inset-0 h-full w-full text-paper ${className}`} />;
}
