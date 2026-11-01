import { ScrollText } from "../Reveal";

export default function Manifesto({ text }: { text: string }) {
  return (
    <section className="container-x py-24 md:py-40">
      <p className="eyebrow mb-10 flex items-center gap-3"><span className="text-accent">✦</span> Our belief</p>
      <ScrollText text={text} className="display text-[clamp(34px,5.6vw,84px)] leading-[1.02]" />
    </section>
  );
}
