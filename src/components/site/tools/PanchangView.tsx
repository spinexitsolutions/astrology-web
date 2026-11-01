"use client";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { choghadiya, panchang, PLACES, RASHIS } from "@/lib/astro";
import { cn } from "@/lib/utils";
import { MoonPhase } from "../home/PanchangStrip";

export default function PanchangView() {
  const [date, setDate] = useState("");
  const [placeName, setPlaceName] = useState(PLACES[0].name);
  useEffect(() => setDate(new Date().toISOString().slice(0, 10)), []);
  const place = PLACES.find((p) => p.name === placeName) ?? PLACES[0];

  const p = useMemo(() => {
    if (!date) return null;
    const [y, m, d] = date.split("-").map(Number);
    // evaluate at local sunrise-ish (6:00 local) like a traditional panchang
    return panchang(new Date(Date.UTC(y, m - 1, d, 6, 0) - place.tz * 3600000), place);
  }, [date, place]);
  const chog = p ? choghadiya(p) : [];

  return (
    <div>
      <div className="flex flex-col gap-3 rounded-[28px] border border-paper/10 bg-ink-2 p-3 sm:flex-row sm:rounded-full">
        <input type="date" className="field !rounded-full sm:w-56" value={date} onChange={(e) => setDate(e.target.value)} aria-label="Date" />
        <select className="field !rounded-full sm:flex-1" value={placeName} onChange={(e) => setPlaceName(e.target.value)} aria-label="City">
          {PLACES.map((x) => <option key={x.name}>{x.name}</option>)}
        </select>
      </div>

      {p && (
        <motion.div key={date + placeName} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }} className="mt-10 grid gap-4 lg:grid-cols-3">
          <div className="relative overflow-hidden rounded-[32px] border border-paper/10 bg-ink-2 p-8 lg:row-span-2">
            <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
            <p className="eyebrow">{p.vara}</p>
            <div className="mt-8 flex justify-center"><MoonPhase phase={p.moonPhase} size={180} /></div>
            <p className="display mt-8 text-center text-5xl">{p.tithi.name}</p>
            <p className="mt-2 text-center text-mist">{p.tithi.paksha} Paksha · {Math.round(p.moonIllumination * 100)}% illuminated</p>
            <div className="mt-8 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-2xl border border-paper/10 p-4"><p className="text-mist">Sunrise</p><p className="display mt-1 text-2xl">{p.sunrise}</p></div>
              <div className="rounded-2xl border border-paper/10 p-4"><p className="text-mist">Sunset</p><p className="display mt-1 text-2xl">{p.sunset}</p></div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:col-span-2">
            {[
              ["Nakshatra", p.nakshatra.name, `${Math.round(p.nakshatra.percent)}% elapsed`],
              ["Yoga", p.yoga, "Sun + Moon"],
              ["Karana", p.karana, "Half-tithi"],
              ["Moon in", RASHIS[p.moonRashi], `Sun in ${RASHIS[p.sunRashi]}`],
            ].map(([k, v, s]) => (
              <div key={k} className="rounded-3xl border border-paper/10 bg-ink-2 p-5">
                <p className="eyebrow">{k}</p>
                <p className="display mt-4 text-3xl">{v}</p>
                <p className="text-sm text-mist">{s}</p>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5">
              <p className="eyebrow !text-emerald-300">Auspicious</p>
              <p className="mt-4 text-sm text-mist">Abhijit Muhurat</p>
              <p className="display text-2xl">{p.abhijit}</p>
            </div>
            <div className="rounded-3xl border border-red-400/20 bg-red-400/[0.04] p-5">
              <p className="eyebrow !text-red-300">Avoid</p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex justify-between gap-4"><span className="text-mist">Rahu Kaal</span><span>{p.rahuKaal}</span></p>
                <p className="flex justify-between gap-4"><span className="text-mist">Yamaganda</span><span>{p.yamaganda}</span></p>
                <p className="flex justify-between gap-4"><span className="text-mist">Gulika</span><span>{p.gulika}</span></p>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-6 lg:col-span-3">
            <p className="eyebrow mb-5">Day Choghadiya</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {chog.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={cn("rounded-2xl border p-3", c.nature === "good" ? "border-emerald-400/25 bg-emerald-400/[0.06]" : c.nature === "bad" ? "border-red-400/20 bg-red-400/[0.04]" : "border-paper/10")}>
                  <p className="display text-xl">{c.name}</p>
                  <p className="mt-1 font-medium text-[10px] text-mist">{c.from}</p>
                  <p className="font-medium text-[10px] text-mist">{c.to}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
