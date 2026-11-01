import type { Metadata } from "next";
import PageHeader from "@/components/site/PageHeader";
import ShopGrid from "@/components/site/ShopGrid";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Remedy Shop — Gemstones, Rudraksha & Yantras" };

export default function ShopPage() {
  const db = getDB();
  return (
    <>
      <PageHeader eyebrow="Certified · Energised · Insured" title="Remedies, rendered with care." italic={["care."]} sub="Lab-certified gemstones, authentic Nepali rudraksha and hand-engraved yantras — each energised in Kashi on an auspicious muhurat." />
      <section className="container-x pb-28"><ShopGrid products={db.products.filter((p) => p.published)} currency={db.settings.currency} /></section>
    </>
  );
}
