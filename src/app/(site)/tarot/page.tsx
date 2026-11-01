import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import TarotTool from "@/components/site/tools/TarotTool";

export const metadata: Metadata = { title: "Free Tarot Reading", description: "Shuffle the Major Arcana and draw a three-card past, present, future spread." };

export default function TarotPage() {
  return (
    <>
      <PageHeader eyebrow="Three-card spread" title="Ask. Shuffle. Listen." italic={["Listen."]} sub="Breathe, hold your question, and let your hand choose. The Major Arcana speaks in archetypes — read with an open heart." />
      <section className="container-x overflow-hidden pb-28"><TarotTool /></section>
    </>
  );
}
