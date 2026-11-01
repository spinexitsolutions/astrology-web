import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import PanchangView from "@/components/site/tools/PanchangView";

export const metadata: Metadata = { title: "Today's Panchang", description: "Tithi, nakshatra, yoga, karana, sunrise, Rahu Kaal and Choghadiya for any date and city." };

export default function PanchangPage() {
  return (
    <>
      <PageHeader eyebrow="Hindu calendar" title="Panchang, beautifully." italic={["beautifully."]} sub="The five limbs of time — tithi, vara, nakshatra, yoga and karana — with muhurat windows for any date and city." />
      <section className="container-x pb-28"><PanchangView /></section>
    </>
  );
}
