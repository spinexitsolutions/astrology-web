import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import KundliTool from "@/components/site/tools/KundliTool";

export const metadata: Metadata = { title: "Free Kundli — Vedic Birth Chart", description: "Generate your free Janam Kundli with planetary positions, nakshatra, Manglik check and Vimshottari dasha." };

export default function KundliPage() {
  return (
    <>
      <PageHeader eyebrow="Free Janam Kundli" title="Your birth chart, decoded." italic={["decoded."]} sub="The exact sky at your first breath — nine grahas, twelve bhavas, twenty-seven nakshatras. Computed live with real astronomy." />
      <section className="container-x pb-28"><KundliTool /></section>
    </>
  );
}
