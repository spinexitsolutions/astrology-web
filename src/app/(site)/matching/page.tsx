import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import MatchingTool from "@/components/site/tools/MatchingTool";

export const metadata: Metadata = { title: "Kundli Matching — 36 Guna Milan", description: "Free Ashtakoota kundli matching for marriage with all 8 kootas and Manglik check." };

export default function MatchingPage() {
  return (
    <>
      <PageHeader eyebrow="Ashtakoota Guna Milan" title="Two charts. One story." italic={["One"]} sub="Classical 36-point compatibility across eight kootas — Varna, Vashya, Tara, Yoni, Graha Maitri, Gana, Bhakoot and Nadi — plus a Manglik check for both." />
      <section className="container-x pb-28"><MatchingTool /></section>
    </>
  );
}
