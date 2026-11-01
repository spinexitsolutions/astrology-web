"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Download, Sparkles } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { birthChart, DASHA_ORDER, NAKSHATRAS, RASHI_EN, RASHIS, toUTC, type Chart } from "@/lib/astro";
import { cn } from "@/lib/utils";
import BirthFields, { emptyBirth, type BirthInput } from "./BirthForm";
import ChartSVG from "./ChartSVG";

const DEITY = ["Ashwini Kumaras", "Yama", "Agni", "Brahma", "Soma", "Rudra", "Aditi", "Brihaspati", "Nagas", "Pitris", "Bhaga", "Aryaman", "Savitar", "Vishwakarma", "Vayu", "Indra-Agni", "Mitra", "Indra", "Nirriti", "Apas", "Vishvedevas", "Vishnu", "Vasus", "Varuna", "Aja Ekapada", "Ahir Budhnya", "Pushan"];
const ASC_TEXT = [
  "Energetic and pioneering — you meet life head-on.", "Steady and sensual — you build lasting comfort.", "Curious and quick — you connect ideas and people.", "Caring and intuitive — home is your power source.",
  "Warm and regal — you naturally take centre stage.", "Precise and helpful — you improve whatever you touch.", "Graceful and fair — you seek harmony in all things.", "Intense and perceptive — you see beneath the surface.",
  "Optimistic and wise — life is a grand pilgrimage.", "Disciplined and patient — you climb mountains slowly.", "Original and humane — you think for the collective.", "Dreamy and compassionate — you feel the whole ocean.",
];

const fmtDeg = (d: number) => `${Math.floor(d)}°${String(Math.floor((d % 1) * 60)).padStart(2, "0")}′`;
const yr = (d: Date) => d.getFullYear();

export default function KundliTool() {
  const [input, setInput] = useState<BirthInput>(emptyBirth());
  const [chart, setChart] = useState<Chart | null>(null);
  const [view, setView] = useState<"lagna" | "moon">("lagna");
  const [loading, setLoading] = useState(false);

  // Prefill from the hero's "Map my sky" field (/kundli?date=YYYY-MM-DD)
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("date");
    if (d && /^\d{4}-\d{2}-\d{2}$/.test(d)) setInput((x) => ({ ...x, date: d }));
  }, []);

  function generate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setChart(birthChart(toUTC(input.date, input.time, input.tz), input.lat, input.lon));
      setLoading(false);
      setTimeout(() => document.getElementById("kundli-result")?.scrollIntoView({ behavior: "smooth", block: "start" }), 50);
    }, 900);
  }

  const moon = chart?.planets[1];
  const summary = useMemo(() => {
    if (!chart || !moon) return [];
    return [
      { k: "Lagna (Ascendant)", v: `${RASHIS[chart.ascendant.rashi]}`, s: `${RASHI_EN[chart.ascendant.rashi]} · ${fmtDeg(chart.ascendant.degree)}` },
      { k: "Moon sign (Rashi)", v: RASHIS[moon.rashi], s: RASHI_EN[moon.rashi] },
      { k: "Nakshatra", v: NAKSHATRAS[moon.nakshatra], s: `Pada ${moon.pada} · ${DEITY[moon.nakshatra]}` },
      { k: "Sun sign (Vedic)", v: RASHIS[chart.sunRashi], s: RASHI_EN[chart.sunRashi] },
      { k: "Current Mahadasha", v: chart.currentDasha?.lord ?? "—", s: chart.currentDasha ? `${yr(chart.currentDasha.start)} – ${yr(chart.currentDasha.end)}` : "" },
      { k: "Manglik", v: chart.manglik.isManglik ? "Yes" : "No", s: `Mars in house ${chart.manglik.house}` },
    ];
  }, [chart, moon]);

  const span = chart ? chart.dasha[chart.dasha.length - 1].end.getTime() - chart.dasha[0].start.getTime() : 1;

  return (
    <div className="grid gap-12 lg:grid-cols-[400px_1fr]">
      <form onSubmit={generate} className="h-fit rounded-[28px] border border-paper/10 bg-ink-2 p-6 lg:sticky lg:top-28">
        <p className="display mb-1 text-3xl">Birth details</p>
        <p className="mb-6 text-sm text-mist">Accurate time = accurate ascendant.</p>
        <BirthFields value={input} onChange={setInput} />
        <button className="btn btn-accent mt-6 w-full" disabled={loading}>
          {loading ? (
            <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}><Sparkles size={17} /></motion.span> Calculating the heavens…</>
          ) : (
            <>Generate Kundli <ArrowUpRight size={17} /></>
          )}
        </button>
        <p className="mt-4 text-center text-xs text-mist">Sidereal zodiac · Lahiri ayanamsa · Whole-sign houses</p>
      </form>

      <div id="kundli-result" className="min-h-[400px] scroll-mt-28">
        <AnimatePresence mode="wait">
          {!chart ? (
            <motion.div key="empty" exit={{ opacity: 0 }} className="grid h-full place-items-center rounded-[28px] border border-dashed border-paper/15 p-10 text-center">
              <div>
                <div className="mx-auto w-56 opacity-40"><ChartSVG lagna={0} planets={[]} /></div>
                <p className="display mt-6 text-3xl italic text-paper/60">Your chart will appear here.</p>
              </div>
            </motion.div>
          ) : (
            <motion.div key={chart.jd} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} className="space-y-6">
              <div>
                <p className="eyebrow">Janam Kundli</p>
                <h2 className="display mt-2 text-5xl md:text-6xl">{input.name || "Your chart"}</h2>
                <p className="mt-2 text-paper/60">{new Date(input.date + "T00:00").toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })} · {input.time} · {input.place}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {summary.map((x, i) => (
                  <motion.div key={x.k} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }} className={cn("rounded-3xl border p-4", x.k === "Manglik" && x.v === "Yes" ? "border-red-400/30 bg-red-400/5" : "border-paper/10 bg-ink-2")}>
                    <p className="text-xs text-mist">{x.k}</p>
                    <p className="display mt-2 text-[28px] leading-none">{x.v}</p>
                    <p className="mt-1 text-xs text-paper/50">{x.s}</p>
                  </motion.div>
                ))}
              </div>

              <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
                <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-5">
                  <div className="mb-4 flex items-center justify-between">
                    <p className="eyebrow">{view === "lagna" ? "Lagna chart (D1)" : "Chandra chart"}</p>
                    <div className="flex rounded-full border border-paper/10 p-0.5 text-xs">
                      {(["lagna", "moon"] as const).map((v) => (
                        <button key={v} onClick={() => setView(v)} className={cn("rounded-full px-3 py-1.5 capitalize transition", view === v ? "bg-paper text-ink" : "text-paper/60")}>{v}</button>
                      ))}
                    </div>
                  </div>
                  <motion.div key={view} initial={{ opacity: 0, scale: 0.96, rotate: -2 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}>
                    <ChartSVG lagna={view === "lagna" ? chart.ascendant.rashi : chart.moonRashi} planets={chart.planets} />
                  </motion.div>
                  <p className="mt-4 text-sm text-paper/60">{ASC_TEXT[chart.ascendant.rashi]}</p>
                </div>

                <div className="overflow-hidden rounded-[28px] border border-paper/10 bg-ink-2">
                  <p className="eyebrow p-5 pb-3">Planetary positions</p>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[420px] text-sm">
                      <thead>
                        <tr className="border-y border-paper/10 text-left text-xs text-mist">
                          <th className="px-5 py-2.5 font-normal">Graha</th><th className="py-2.5 font-normal">Rashi</th><th className="py-2.5 font-normal">Degree</th><th className="py-2.5 font-normal">Nakshatra</th><th className="py-2.5 pr-5 text-right font-normal">House</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chart.planets.map((p) => (
                          <tr key={p.name} className="border-b border-paper/5 last:border-0">
                            <td className="px-5 py-3">{p.name}{p.retro && p.name !== "Rahu" && p.name !== "Ketu" && <span className="ml-1 text-xs text-accent">R</span>}</td>
                            <td className="py-3 text-paper/75">{RASHIS[p.rashi]}</td>
                            <td className="py-3 font-medium text-xs text-paper/75">{fmtDeg(p.degree)}</td>
                            <td className="py-3 text-paper/75">{NAKSHATRAS[p.nakshatra]} <span className="text-mist">{p.pada}</span></td>
                            <td className="py-3 pr-5 text-right font-medium text-paper/75">{p.house}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="rounded-[28px] border border-paper/10 bg-ink-2 p-5 md:p-6">
                <p className="eyebrow mb-5">Vimshottari Mahadasha</p>
                <div className="flex h-12 overflow-hidden rounded-xl">
                  {chart.dasha.map((d, i) => {
                    const w = ((d.end.getTime() - d.start.getTime()) / span) * 100;
                    const cur = d === chart.currentDasha;
                    return (
                      <motion.div key={d.lord + i} initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ delay: i * 0.05 }} style={{ width: `${w}%` }} className={cn("grid place-items-center border-r border-ink text-[10px] font-medium", cur ? "bg-accent text-ink" : i % 2 ? "bg-paper/10" : "bg-paper/[0.05]")} title={`${d.lord} ${yr(d.start)}–${yr(d.end)}`}>
                        <span className="truncate px-1">{w > 6 ? d.lord : d.lord.slice(0, 2)}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
                  {chart.dasha.map((d, i) => (
                    <p key={i} className={cn("flex justify-between border-b border-paper/5 py-1.5", d === chart.currentDasha ? "text-accent" : "text-paper/70")}>
                      <span>{d.lord}</span><span className="font-medium text-xs">{yr(d.start)}–{yr(d.end)}</span>
                    </p>
                  ))}
                </div>
                <p className="mt-4 text-xs text-mist">Dasha cycle: {DASHA_ORDER.map(([l, y]) => `${l} ${y}y`).join(" · ")}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <Link href="/shop/premium-kundli-report" className="group flex items-center justify-between rounded-[28px] bg-accent p-6 text-ink">
                  <div><p className="display text-3xl">120-page life report</p><p className="text-ink/70">Written by our astrologers in 48h</p></div>
                  <Download className="transition group-hover:translate-y-1" />
                </Link>
                <Link href={`/book?service=${encodeURIComponent("Complete Kundli Analysis")}&name=${encodeURIComponent(input.name)}&dob=${input.date}&tob=${input.time}&pob=${encodeURIComponent(input.place)}`} className="group flex items-center justify-between rounded-[28px] border border-paper/15 p-6 transition hover:border-paper/40">
                  <div><p className="display text-3xl">Discuss this chart</p><p className="text-paper/60">Live with a senior astrologer</p></div>
                  <ArrowUpRight className="transition group-hover:rotate-45" />
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
