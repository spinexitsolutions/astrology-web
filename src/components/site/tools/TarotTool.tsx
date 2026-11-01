"use client";
import { AnimatePresence, motion } from "framer-motion";
import { RotateCcw, Shuffle } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const CARDS = [
  { n: "The Fool", s: "✧", up: "New beginnings, spontaneity, a leap of faith.", rev: "Recklessness, hesitation, fear of the unknown." },
  { n: "The Magician", s: "∞", up: "Willpower, skill, manifesting what you focus on.", rev: "Scattered energy, untapped talent, manipulation." },
  { n: "The High Priestess", s: "☾", up: "Intuition, mystery, the wisdom of silence.", rev: "Ignoring your gut, secrets, disconnection." },
  { n: "The Empress", s: "♀", up: "Abundance, nurturing, creativity in bloom.", rev: "Creative block, dependence, neglecting self-care." },
  { n: "The Emperor", s: "♈", up: "Structure, authority, steady leadership.", rev: "Rigidity, control issues, lack of discipline." },
  { n: "The Hierophant", s: "⚷", up: "Tradition, mentorship, spiritual guidance.", rev: "Rebellion, new paths, questioning convention." },
  { n: "The Lovers", s: "♡", up: "Love, alignment of values, an important choice.", rev: "Disharmony, misalignment, avoiding a decision." },
  { n: "The Chariot", s: "⛭", up: "Determination, victory through focus.", rev: "Lack of direction, opposition, scattered will." },
  { n: "Strength", s: "♌", up: "Inner courage, compassion, gentle power.", rev: "Self-doubt, low energy, raw emotion." },
  { n: "The Hermit", s: "✶", up: "Soul-searching, solitude, inner guidance.", rev: "Isolation, loneliness, withdrawal." },
  { n: "Wheel of Fortune", s: "☸", up: "Cycles, luck, a turning point arrives.", rev: "Resistance to change, bad luck, delays." },
  { n: "Justice", s: "⚖", up: "Truth, fairness, cause and effect.", rev: "Unfairness, dishonesty, avoiding accountability." },
  { n: "The Hanged Man", s: "⟁", up: "Pause, surrender, a new perspective.", rev: "Stalling, resistance, needless sacrifice." },
  { n: "Death", s: "♅", up: "Endings that make space for beginnings.", rev: "Fear of change, holding on, stagnation." },
  { n: "Temperance", s: "△", up: "Balance, patience, the middle path.", rev: "Imbalance, excess, impatience." },
  { n: "The Devil", s: "♑", up: "Attachments, temptation, shadow work.", rev: "Release, breaking free, reclaiming power." },
  { n: "The Tower", s: "⚡", up: "Sudden upheaval, revelation, liberation.", rev: "Averting disaster, fear of change." },
  { n: "The Star", s: "★", up: "Hope, renewal, quiet faith.", rev: "Discouragement, lost faith, disconnection." },
  { n: "The Moon", s: "☽", up: "Illusion, dreams, trusting your intuition.", rev: "Clarity emerging, released fear." },
  { n: "The Sun", s: "☉", up: "Joy, success, radiant vitality.", rev: "Temporary clouds, dimmed enthusiasm." },
  { n: "Judgement", s: "♆", up: "Awakening, reckoning, a calling.", rev: "Self-doubt, ignoring the call." },
  { n: "The World", s: "⊕", up: "Completion, wholeness, accomplishment.", rev: "Loose ends, shortcuts, delayed closure." },
];
const ROMAN = ["0", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII", "XIII", "XIV", "XV", "XVI", "XVII", "XVIII", "XIX", "XX", "XXI"];
const SLOTS = ["Past", "Present", "Future"];

type Pick = { idx: number; reversed: boolean };

function CardBack() {
  return (
    <div className="absolute inset-0 rounded-[14px] border border-accent/40 bg-[radial-gradient(circle_at_50%_40%,#2a2242,#0e0c18)] [backface-visibility:hidden]">
      <div className="absolute inset-2 rounded-[10px] border border-accent/25" />
      <svg viewBox="0 0 100 160" className="absolute inset-0 h-full w-full p-4 text-accent/60" fill="none" stroke="currentColor" strokeWidth=".6">
        <circle cx="50" cy="80" r="26" /><circle cx="50" cy="80" r="16" />
        <path d="M50 40 L50 120 M14 80 L86 80" opacity=".5" />
        <path d="M50 58 L68 90 L32 90 Z" /><path d="M50 102 L32 70 L68 70 Z" />
      </svg>
    </div>
  );
}

function CardFace({ idx, reversed }: Pick) {
  const c = CARDS[idx];
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-between rounded-[14px] border border-accent/60 bg-[linear-gradient(170deg,#f6f0e3,#e6dcc6)] p-3 text-ink [backface-visibility:hidden] [transform:rotateY(180deg)]">
      <div className={cn("flex h-full w-full flex-col items-center justify-between rounded-[9px] border border-ink/20 p-2", reversed && "rotate-180")}>
        <span className="font-medium text-[10px]">{ROMAN[idx]}</span>
        <span className="text-5xl text-[#9a6b2a]">{c.s}</span>
        <span className="display text-center text-[15px] leading-tight">{c.n}</span>
      </div>
    </div>
  );
}

export default function TarotTool() {
  const [seed, setSeed] = useState(0);
  const [picks, setPicks] = useState<Pick[]>([]);
  const [shuffling, setShuffling] = useState(false);
  const [question, setQuestion] = useState("");

  const [deck, setDeck] = useState<number[]>([]);
  const [spread, setSpread] = useState(64);
  useEffect(() => {
    const a = CARDS.map((_, i) => i);
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    setDeck(a);
  }, [seed]);
  useEffect(() => {
    const m = () => setSpread(window.innerWidth < 640 ? 34 : window.innerWidth < 1024 ? 50 : 64);
    m();
    window.addEventListener("resize", m);
    return () => window.removeEventListener("resize", m);
  }, []);

  const shuffle = () => {
    setPicks([]);
    setShuffling(true);
    setTimeout(() => {
      setSeed((s) => s + 1);
      setShuffling(false);
    }, 900);
  };

  const pick = (idx: number) => {
    if (picks.length >= 3 || picks.some((p) => p.idx === idx)) return;
    setPicks((p) => [...p, { idx, reversed: Math.random() < 0.3 }]);
  };

  const done = picks.length === 3;

  return (
    <div>
      <div className="mx-auto max-w-xl text-center">
        <input className="field !rounded-full text-center" placeholder="Hold a question in your mind (optional)" value={question} onChange={(e) => setQuestion(e.target.value)} aria-label="Your question" />
        <p className="mt-4 text-sm text-mist">{done ? "Your spread is ready." : `Choose ${3 - picks.length} card${3 - picks.length === 1 ? "" : "s"} from the deck`}</p>
      </div>

      {/* Fan */}
      <div className="relative mx-auto mt-6 h-[210px] max-w-5xl md:h-[260px]">
        {deck.map((idx, i) => {
          const n = deck.length;
          const t = i / (n - 1) - 0.5;
          const taken = picks.some((p) => p.idx === idx);
          return (
            <motion.button
              key={`${seed}-${idx}`}
              onClick={() => pick(idx)}
              disabled={taken || done}
              aria-label={`Pick card ${i + 1}`}
              className="absolute left-1/2 top-6 h-[132px] w-[82px] origin-[50%_400%] md:h-[170px] md:w-[106px]"
              style={{ marginLeft: -41 }}
              initial={{ rotate: 0, opacity: 0, y: 40 }}
              animate={shuffling ? { rotate: 0, x: (Math.random() - 0.5) * 60, y: 0, opacity: 1 } : { rotate: t * spread, x: 0, y: taken ? -400 : 0, opacity: taken ? 0 : 1 }}
              whileHover={!taken && !done ? { y: -26, transition: { duration: 0.25 } } : {}}
              transition={{ duration: 0.8, delay: shuffling ? 0 : i * 0.015, ease: [0.16, 1, 0.3, 1] }}
            >
              <CardBack />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-10 flex justify-center gap-3">
        <button onClick={shuffle} className="btn btn-ghost"><Shuffle size={16} /> Shuffle</button>
        {picks.length > 0 && <button onClick={() => setPicks([])} className="btn btn-ghost"><RotateCcw size={16} /> Reset</button>}
      </div>

      {/* Spread */}
      <div className="mx-auto mt-14 grid max-w-5xl grid-cols-3 gap-3 md:gap-8">
        {SLOTS.map((slot, i) => {
          const p = picks[i];
          return (
            <div key={slot} className="text-center">
              <p className="eyebrow mb-4">{slot}</p>
              <div className="relative mx-auto aspect-[5/8] w-full max-w-[200px] [perspective:1200px]">
                {!p && <div className="absolute inset-0 rounded-[14px] border border-dashed border-paper/20" />}
                <AnimatePresence>
                  {p && (
                    <motion.div key={p.idx} className="absolute inset-0 [transform-style:preserve-3d]" initial={{ y: -200, opacity: 0, rotateY: 0 }} animate={{ y: 0, opacity: 1, rotateY: 180 }} transition={{ y: { duration: 0.7, ease: [0.16, 1, 0.3, 1] }, opacity: { duration: 0.3 }, rotateY: { delay: 0.6, duration: 1, ease: [0.83, 0, 0.17, 1] } }}>
                      <CardBack />
                      <CardFace {...p} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.6, duration: 0.8 }} className="mx-auto mt-14 max-w-5xl">
            {question && <p className="display mb-8 text-center text-3xl italic text-paper/70">“{question}”</p>}
            <div className="grid gap-4 md:grid-cols-3">
              {picks.map((p, i) => (
                <div key={p.idx} className="rounded-[28px] border border-paper/10 bg-ink-2 p-6">
                  <p className="eyebrow">{SLOTS[i]}</p>
                  <p className="display mt-3 text-3xl">{CARDS[p.idx].n}{p.reversed && <span className="ml-2 align-middle text-xs text-accent">REVERSED</span>}</p>
                  <p className="mt-3 text-paper/70">{p.reversed ? CARDS[p.idx].rev : CARDS[p.idx].up}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-center text-sm text-mist">For a full Celtic Cross reading with an intuitive reader, <a href="/book?service=Intuitive%20Tarot" className="text-accent underline-offset-4 hover:underline">book a session</a>.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
