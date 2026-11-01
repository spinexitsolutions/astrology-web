import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import NumerologyTool from "@/components/site/tools/NumerologyTool";

export const metadata: Metadata = { title: "Numerology Calculator", description: "Find your life path, destiny, soul urge and personal year numbers." };

export default function NumerologyPage() {
  return (
    <>
      <PageHeader eyebrow="Numerology" title="You are a number. A beautiful one." italic={["beautiful"]} sub="Your name and birth date carry vibrations. Discover your core numbers and what they ask of you." />
      <section className="container-x pb-28"><NumerologyTool /></section>
    </>
  );
}
