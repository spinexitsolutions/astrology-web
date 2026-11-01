import { SplitText } from "./Reveal";
import ZodiacWheel from "./ZodiacWheel";

export default function PageHeader({ eyebrow, title, italic = [], sub, children }: { eyebrow: string; title: string; italic?: string[]; sub?: string; children?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden pb-14 pt-36 md:pb-20 md:pt-48">
      {/* colour field + slow orbit — light, airy, unmistakably ours */}
      <div className="pointer-events-none absolute -right-[18vmax] -top-[22vmax] h-[62vmax] w-[62vmax] rounded-full bg-[radial-gradient(circle_at_40%_60%,color-mix(in_oklab,var(--accent)_30%,transparent),transparent_55%),radial-gradient(circle_at_70%_30%,color-mix(in_oklab,var(--accent-2)_32%,transparent),transparent_60%)] blur-2xl" />
      <div className="pointer-events-none absolute -right-[14vmax] -top-[18vmax] h-[54vmax] w-[54vmax] animate-spin-slower text-paper/[0.09]">
        <ZodiacWheel className="h-full w-full" />
      </div>
      <div className="container-x relative">
        <p className="eyebrow mb-5 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" />{eyebrow}</p>
        <h1 className="display display-xl max-w-5xl text-[clamp(50px,8.6vw,136px)]">
          <SplitText text={title} italicWords={italic} />
        </h1>
        {sub && <p className="mt-6 max-w-2xl text-paper/65 md:text-lg">{sub}</p>}
        {children}
      </div>
    </section>
  );
}
