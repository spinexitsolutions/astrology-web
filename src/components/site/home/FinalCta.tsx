"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import NewsletterForm from "../NewsletterForm";

export default function FinalCta({ image, whatsapp }: { image: string; whatsapp: string }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);
  const clip = useTransform(scrollYProgress, [0, 0.45], ["inset(12% 8% 12% 8% round 48px)", "inset(0% 0% 0% 0% round 0px)"]);
  return (
    <section ref={ref} className="relative min-h-[110svh]">
      <motion.div style={{ clipPath: clip }} className="absolute inset-0 overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-[-15%]">
          <Image src={image} alt="" fill sizes="100vw" className="object-cover" />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/40 to-ink" />
      </motion.div>
      <div className="container-x relative flex min-h-[110svh] flex-col items-center justify-center py-32 text-center">
        <p className="eyebrow mb-6">Begin tonight</p>
        <h2 className="display max-w-5xl text-[clamp(52px,10vw,160px)] leading-[0.88]">
          The stars <em className="text-gold">already</em> know. Now you can too.
        </h2>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/book" className="btn btn-accent">Book a consultation <ArrowUpRight size={17} /></Link>
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="btn btn-ghost backdrop-blur">Chat on WhatsApp</a>
        </div>
        <div className="mt-16 w-full max-w-xl">
          <p className="mb-4 text-paper/70">Or get your weekly horoscope, every Monday.</p>
          <NewsletterForm />
        </div>
      </div>
    </section>
  );
}
