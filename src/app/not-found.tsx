import Link from "next/link";
import ZodiacWheel from "@/components/site/ZodiacWheel";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[100svh] bg-ink text-paper place-items-center overflow-hidden px-5 text-center">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 animate-spin-slow text-paper/[0.07]"><ZodiacWheel className="h-full w-full" /></div>
      <div className="relative">
        <p className="eyebrow">Error 404 · Rahu Kaal</p>
        <h1 className="display mt-4 text-[clamp(64px,14vw,200px)]">Lost in <em className="text-gold">space.</em></h1>
        <p className="mx-auto mt-4 max-w-md text-paper/60">This page drifted out of orbit. Even Mercury retrograde can&apos;t explain it.</p>
        <Link href="/" className="btn btn-primary mt-8">Return to Earth</Link>
      </div>
    </section>
  );
}
