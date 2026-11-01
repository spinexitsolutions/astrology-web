import type { Metadata } from "next";
import { AstrologerCard } from "@/components/site/home/Astrologers";
import PageHeader from "@/components/site/PageHeader";
import { Reveal } from "@/components/site/Reveal";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Consult Astrologers", description: "Talk to verified Vedic astrologers on call, video or chat." };

export default function AstrologersPage() {
  const db = getDB();
  const list = db.astrologers.filter((a) => a.published).sort((a, b) => Number(b.online) - Number(a.online) || a.order - b.order);
  return (
    <>
      <PageHeader eyebrow={`${list.filter((a) => a.online).length} online now`} title="Speak with someone who knows the sky." italic={["knows"]} sub="Every astrologer is interviewed, tested on real charts and reviewed by clients. No fear-selling — ever." />
      <section className="container-x pb-28">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((a, i) => (
            <Reveal key={a.id} delay={(i % 3) * 0.07}>
              <AstrologerCard a={a} currency={db.settings.currency} />
              <p className="mt-3 px-2 text-sm text-paper/55">{a.bio}</p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
