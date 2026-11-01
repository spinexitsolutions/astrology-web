import Starfield from "./Starfield";
import { SplitText } from "./Reveal";
import ZodiacWheel from "./ZodiacWheel";

export default function PageHeader({ eyebrow, title, italic = [], sub, children }: { eyebrow: string; title: string; italic?: string[]; sub?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
      <Starfield density={0.00012} />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,color-mix(in_oklab,var(--accent-2)_16%,transparent),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-[20vmax] -top-[20vmax] h-[60vmax] w-[60vmax] animate-spin-slower text-paper/[0.06]">
        <ZodiacWheel className="h-full w-full" />
      </div>
      <div className="container-x relative">
        <p className="eyebrow mb-5 flex items-center gap-3"><span className="text-accent">✦</span>{eyebrow}</p>
        <h1 className="display max-w-5xl text-[clamp(52px,9vw,140px)]">
          <SplitText text={title} italicWords={italic} />
        </h1>
        {sub && <p className="mt-6 max-w-2xl text-paper/65 md:text-lg">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
