import { Clock, Mail, MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import ContactForm from "@/components/site/ContactForm";
import PageHeader from "@/components/site/PageHeader";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Contact" };

export default function ContactPage() {
  const s = getSettings();
  const items = [
    { I: Phone, k: "Call", v: s.contact.phone, href: `tel:${s.contact.phone}` },
    { I: MessageCircle, k: "WhatsApp", v: "Chat with us", href: `https://wa.me/${s.contact.whatsapp}` },
    { I: Mail, k: "Email", v: s.contact.email, href: `mailto:${s.contact.email}` },
    { I: MapPin, k: "Visit", v: s.contact.address, href: `https://maps.google.com/?q=${encodeURIComponent(s.contact.address)}` },
    { I: Clock, k: "Hours", v: s.contact.hours },
  ];
  return (
    <>
      <PageHeader eyebrow="Contact" title="Say namaste." italic={["namaste."]} sub="Questions about a reading, an order or a corporate Vastu visit? We usually reply within the hour." />
      <section className="container-x grid gap-12 pb-28 lg:grid-cols-[1fr_1.3fr]">
        <div className="space-y-3">
          {items.map(({ I, k, v, href }) => {
            const C = href ? "a" : "div";
            return (
              <C key={k} {...(href ? { href, target: href.startsWith("http") ? "_blank" : undefined, rel: "noreferrer" } : {})} className="group flex items-start gap-4 rounded-3xl border border-paper/10 p-5 transition hover:border-paper/30">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-paper/[0.06] text-accent"><I size={18} /></span>
                <span><span className="block text-xs text-mist">{k}</span><span className="mt-0.5 block text-paper/85">{v}</span></span>
              </C>
            );
          })}
        </div>
        <ContactForm />
      </section>
    </>
  );
}
