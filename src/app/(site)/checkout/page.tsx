import type { Metadata } from "next";
import Checkout from "@/components/site/Checkout";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Checkout" };

export default function CheckoutPage() {
  return (
    <section className="container-x pb-28 pt-32 md:pt-40">
      <h1 className="display mb-12 text-[clamp(52px,8vw,120px)]">Checkout<span className="text-accent">.</span></h1>
      <Checkout currency={getSettings().currency} />
    </section>
  );
}
