import type { Metadata } from "next";
import { Suspense } from "react";
import PageHeader from "@/components/site/PageHeader";
import BookingForm from "@/components/site/BookingForm";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Book a Consultation" };

export default function BookPage() {
  const db = getDB();
  return (
    <>
      <PageHeader eyebrow="Book a reading" title="Let's look at your sky together." italic={["together."]} sub="Pick a service, an astrologer and a time. You'll get a confirmation on WhatsApp within minutes." />
      <section className="container-x pb-28">
        <Suspense>
          <BookingForm
            services={db.services.filter((s) => s.published).map((s) => ({ title: s.title, price: s.price, duration: s.duration }))}
            astrologers={db.astrologers.filter((a) => a.published).map((a) => ({ name: a.name, title: a.title, image: a.image, online: a.online }))}
            currency={db.settings.currency}
          />
        </Suspense>
      </section>
    </>
  );
}
