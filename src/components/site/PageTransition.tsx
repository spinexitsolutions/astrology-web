"use client";
import { motion } from "framer-motion";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <>
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[120] origin-top bg-accent"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.8, ease: [0.83, 0, 0.17, 1] }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[119] bg-[#0d0b14]"
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.83, 0, 0.17, 1], delay: 0.08 }}
        style={{ transformOrigin: "top" }}
      />
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}>
        {children}
      </motion.div>
    </>
  );
}
