"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, ExternalLink, Plus, RotateCcw, Save, Trash2, TriangleAlert, X } from "lucide-react";
import { useMemo, useState } from "react";
import type { SiteSettings } from "@/lib/types";
import { cn } from "@/lib/utils";
import { api, Button, Card, Input, Label, PageHeader, Select, Textarea, Toggle, useToast } from "./ui";

const TABS = [
  { id: "general", label: "General" },
  { id: "theme", label: "Theme" },
  { id: "intro", label: "Intro animation" },
  { id: "hero", label: "Hero" },
  { id: "nav", label: "Navigation" },
  { id: "sections", label: "Home sections" },
  { id: "content", label: "Content" },
  { id: "contact", label: "Contact & socials" },
] as const;
type Tab = (typeof TABS)[number]["id"];

function move<T>(arr: T[], i: number, d: number) {
  const j = i + d;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
}

function Section({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <Card className="p-5 sm:p-7">
      <h3 className="font-medium">{title}</h3>
      {desc && <p className="mt-0.5 text-[13px] text-neutral-500">{desc}</p>}
      <div className="mt-5">{children}</div>
    </Card>
  );
}

function ImagePreview({ src }: { src: string }) {
  return (
    <div className="mt-2 h-40 overflow-hidden rounded-2xl bg-neutral-100 ring-1 ring-black/5">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {src && <img src={src} alt="" className="size-full object-cover" />}
    </div>
  );
}

function IntroPreview({ s }: { s: SiteSettings }) {
  const { intro } = s;
  return (
    <div className="relative grid h-56 place-items-center overflow-hidden rounded-2xl bg-[#07070C] text-[#F3EEE5]">
      <svg viewBox="0 0 200 200" className="absolute size-52 opacity-60" fill="none" stroke={s.accent} strokeWidth="0.5">
        {intro.style === "mandala" ? (
          Array.from({ length: 12 }).map((_, i) => <ellipse key={i} cx="100" cy="100" rx="80" ry="26" transform={`rotate(${i * 15} 100 100)`} />)
        ) : intro.style === "orbit" ? (
          <>
            <circle cx="100" cy="100" r="90" /><circle cx="100" cy="100" r="64" strokeDasharray="2 4" /><circle cx="100" cy="100" r="40" />
            <motion.g animate={{ rotate: 360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} style={{ originX: "100px", originY: "100px" }}>
              <circle cx="190" cy="100" r="3" fill={s.accent} />
            </motion.g>
          </>
        ) : (
          <line x1="40" y1="100" x2="160" y2="100" />
        )}
      </svg>
      <div className="relative text-center">
        <div className="font-display text-4xl">{intro.title || s.brandName}</div>
        <div className="mt-1 text-[12px] text-white/60">{intro.tagline}</div>
        <div className="mt-4 font-mono text-[9px] uppercase tracking-[0.3em]" style={{ color: s.accent }}>{intro.loadingText}</div>
      </div>
      {!intro.enabled && <div className="absolute inset-0 grid place-items-center bg-black/60 text-sm">Intro disabled</div>}
    </div>
  );
}

export function SettingsEditor({ initial }: { initial: SiteSettings }) {
  const toast = useToast();
  const [saved, setSaved] = useState(initial);
  const [s, setS] = useState(initial);
  const [tab, setTab] = useState<Tab>("general");
  const [saving, setSaving] = useState(false);
  const [chip, setChip] = useState("");
  const dirty = useMemo(() => JSON.stringify(s) !== JSON.stringify(saved), [s, saved]);

  const up = <K extends keyof SiteSettings>(k: K, v: SiteSettings[K]) => setS((p) => ({ ...p, [k]: v }));
  const upIn = <K extends keyof SiteSettings>(k: K, patch: Partial<SiteSettings[K]>) => setS((p) => ({ ...p, [k]: { ...(p[k] as object), ...patch } as SiteSettings[K] }));

  const save = async () => {
    setSaving(true);
    try {
      const next = await api<SiteSettings>("/api/admin/settings", "PUT", s);
      setSaved(next);
      setS(next);
      toast("Settings published — live on the site");
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  };

  const reset = async () => {
    if (!confirm("Reset ALL content, settings and CRM data to the demo defaults? This cannot be undone.")) return;
    await api("/api/admin/reset", "POST");
    toast("Demo data restored");
    setTimeout(() => window.location.reload(), 600);
  };

  return (
    <div className="pb-28">
      <PageHeader eyebrow="CMS" title="Site settings" subtitle="Everything on the public site — brand, intro, hero, navigation and sections." actions={
        <a href="/?intro=1" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium ring-1 ring-black/10 hover:bg-neutral-50">Preview site <ExternalLink className="size-4" /></a>
      } />

      <div className="no-scrollbar sticky top-[57px] z-20 -mx-4 mb-6 overflow-x-auto bg-[#F5F5F7]/85 px-4 py-2 backdrop-blur-xl sm:mx-0 sm:px-0 lg:top-0">
        <div className="flex w-max gap-1 rounded-full bg-black/[0.05] p-1">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className="relative rounded-full px-4 py-1.5 text-[13px] font-medium">
              {tab === t.id && <motion.span layoutId="settings-tab" className="absolute inset-0 rounded-full bg-white shadow-sm" transition={{ type: "spring", stiffness: 500, damping: 38 }} />}
              <span className={cn("relative", tab === t.id ? "text-neutral-900" : "text-neutral-500")}>{t.label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }} className="space-y-4">
          {tab === "general" && (
            <>
              <Section title="Brand" desc="Name, glyph and tagline used across the site, intro and admin.">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Brand name</Label><Input value={s.brandName} onChange={(e) => up("brandName", e.target.value)} /></div>
                  <div><Label hint="Emoji or symbol, e.g. ✦ ☾ ॐ">Logo glyph</Label><Input value={s.logoGlyph} onChange={(e) => up("logoGlyph", e.target.value)} /></div>
                  <div className="sm:col-span-2"><Label>Tagline</Label><Input value={s.brandTagline} onChange={(e) => up("brandTagline", e.target.value)} /></div>
                  <div><Label>Currency symbol</Label><Input value={s.currency} onChange={(e) => up("currency", e.target.value)} /></div>
                </div>
              </Section>
              <Section title="SEO" desc="Shown in search results and link previews.">
                <div className="space-y-4">
                  <div><Label hint={`${s.seo.title.length}/60`}>Meta title</Label><Input value={s.seo.title} onChange={(e) => upIn("seo", { title: e.target.value })} /></div>
                  <div><Label hint={`${s.seo.description.length}/160`}>Meta description</Label><Textarea rows={3} value={s.seo.description} onChange={(e) => upIn("seo", { description: e.target.value })} /></div>
                  <div className="rounded-2xl bg-white p-4 ring-1 ring-black/5">
                    <div className="text-[12px] text-neutral-400">taarak.in</div>
                    <div className="text-[17px] text-[#1a0dab]">{s.seo.title}</div>
                    <div className="line-clamp-2 text-[13px] text-neutral-600">{s.seo.description}</div>
                  </div>
                </div>
              </Section>
              <Section title="Danger zone">
                <div className="flex flex-col gap-3 rounded-2xl bg-red-50 p-4 sm:flex-row sm:items-center">
                  <TriangleAlert className="size-5 shrink-0 text-red-500" />
                  <p className="flex-1 text-[13px] text-red-700">Reset every setting, CMS item and CRM record to the original demo data.</p>
                  <Button variant="danger" onClick={reset}><RotateCcw className="size-4" /> Reset demo data</Button>
                </div>
              </Section>
            </>
          )}

          {tab === "theme" && (
            <Section title="Colours" desc="Accent colours drive buttons, highlights, gradients and the intro.">
              <div className="grid gap-6 sm:grid-cols-2">
                {(["accent", "accentSecondary"] as const).map((k) => (
                  <div key={k}>
                    <Label>{k === "accent" ? "Primary accent" : "Secondary accent"}</Label>
                    <div className="flex items-center gap-3">
                      <input type="color" value={s[k]} onChange={(e) => up(k, e.target.value)} className="h-12 w-16 cursor-pointer rounded-xl border border-black/10 bg-white p-1" />
                      <Input value={s[k]} onChange={(e) => up(k, e.target.value)} className="font-mono" />
                    </div>
                    <div className="mt-3 flex gap-2">
                      {(k === "accent" ? ["#E8B86D", "#F2A65A", "#E07A5F", "#D4AF37", "#9ED8DB"] : ["#A89BFF", "#7DD3FC", "#F0ABFC", "#86EFAC", "#FCA5A5"]).map((c) => (
                        <button key={c} onClick={() => up(k, c)} className={cn("size-8 rounded-full ring-2 ring-offset-2", s[k].toLowerCase() === c.toLowerCase() ? "ring-neutral-900" : "ring-transparent")} style={{ background: c }} aria-label={c} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 overflow-hidden rounded-2xl bg-[#07070C] p-6 text-[#F3EEE5]">
                <div className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: s.accent }}>Live preview</div>
                <div className="mt-2 font-display text-4xl leading-none">
                  Your stars, <em style={{ backgroundImage: `linear-gradient(100deg, #fff3d6, ${s.accent}, ${s.accentSecondary})`, WebkitBackgroundClip: "text", color: "transparent" }}>finally</em>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="rounded-full px-5 py-2.5 text-sm font-medium text-[#07070C]" style={{ background: s.accent }}>Book a reading</span>
                  <span className="rounded-full border border-white/20 px-5 py-2.5 text-sm">Free Kundli</span>
                  <span className="rounded-full px-3 py-2.5 text-sm" style={{ color: s.accentSecondary }}>✦ Secondary</span>
                </div>
              </div>
            </Section>
          )}

          {tab === "intro" && (
            <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
              <Section title="Intro animation" desc="The cinematic loader visitors see when they arrive.">
                <div className="space-y-5">
                  <Toggle checked={s.intro.enabled} onChange={(v) => upIn("intro", { enabled: v })} label="Show intro animation" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div><Label>Style</Label><Select options={[{ value: "orbit", label: "Orbit — planets & rings" }, { value: "mandala", label: "Mandala — blooming petals" }, { value: "minimal", label: "Minimal — type only" }]} value={s.intro.style} onChange={(e) => upIn("intro", { style: e.target.value as SiteSettings["intro"]["style"] })} /></div>
                    <div><Label>Title</Label><Input value={s.intro.title} onChange={(e) => upIn("intro", { title: e.target.value })} /></div>
                    <div className="sm:col-span-2"><Label>Tagline</Label><Input value={s.intro.tagline} onChange={(e) => upIn("intro", { tagline: e.target.value })} /></div>
                    <div className="sm:col-span-2"><Label>Loading text</Label><Input value={s.intro.loadingText} onChange={(e) => upIn("intro", { loadingText: e.target.value })} /></div>
                  </div>
                  <div>
                    <Label hint={`${(s.intro.durationMs / 1000).toFixed(1)}s`}>Duration</Label>
                    <input type="range" min={1500} max={6000} step={100} value={s.intro.durationMs} onChange={(e) => upIn("intro", { durationMs: Number(e.target.value) })} className="w-full accent-[#C9963F]" />
                  </div>
                  <Toggle checked={s.intro.oncePerSession} onChange={(v) => upIn("intro", { oncePerSession: v })} label="Only once per browser session" />
                </div>
              </Section>
              <div className="space-y-3">
                <IntroPreview s={s} />
                <a href="/?intro=1" target="_blank" className="flex h-11 items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-700">
                  Preview intro on site <ExternalLink className="size-4" />
                </a>
                {dirty && <p className="text-center text-[12px] text-neutral-400">Save first to preview your latest changes.</p>}
              </div>
            </div>
          )}

          {tab === "hero" && (
            <Section title="Hero" desc="The first screen of the home page.">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2"><Label>Eyebrow</Label><Input value={s.hero.eyebrow} onChange={(e) => upIn("hero", { eyebrow: e.target.value })} /></div>
                <div><Label>Headline — line 1</Label><Input value={s.hero.titleTop} onChange={(e) => upIn("hero", { titleTop: e.target.value })} /></div>
                <div><Label hint="Gold italic">Headline — accent word</Label><Input value={s.hero.titleAccent} onChange={(e) => upIn("hero", { titleAccent: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Headline — line 2</Label><Input value={s.hero.titleBottom} onChange={(e) => upIn("hero", { titleBottom: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Subtitle</Label><Textarea rows={3} value={s.hero.subtitle} onChange={(e) => upIn("hero", { subtitle: e.target.value })} /></div>
                <div><Label>Primary button</Label><Input value={s.hero.primaryCta.label} onChange={(e) => upIn("hero", { primaryCta: { ...s.hero.primaryCta, label: e.target.value } })} /></div>
                <div><Label>Primary link</Label><Input value={s.hero.primaryCta.href} onChange={(e) => upIn("hero", { primaryCta: { ...s.hero.primaryCta, href: e.target.value } })} /></div>
                <div><Label>Secondary button</Label><Input value={s.hero.secondaryCta.label} onChange={(e) => upIn("hero", { secondaryCta: { ...s.hero.secondaryCta, label: e.target.value } })} /></div>
                <div><Label>Secondary link</Label><Input value={s.hero.secondaryCta.href} onChange={(e) => upIn("hero", { secondaryCta: { ...s.hero.secondaryCta, href: e.target.value } })} /></div>
                <div className="sm:col-span-2">
                  <Label hint="Image URL">Background image</Label>
                  <Input value={s.hero.image} onChange={(e) => upIn("hero", { image: e.target.value.trim() })} className="font-mono text-[12px]" />
                  <ImagePreview src={s.hero.image} />
                </div>
              </div>
            </Section>
          )}

          {tab === "nav" && (
            <>
              <Section title="Menu items" desc="Order, labels and links of the navbar & full-screen menu.">
                <div className="space-y-2">
                  {s.nav.map((n, i) => (
                    <motion.div layout key={n.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-2 rounded-2xl bg-neutral-50 p-2 ring-1 ring-black/5 sm:grid-cols-[auto_1fr_1fr_1fr_auto]">
                      <div className="flex flex-col">
                        <button onClick={() => up("nav", move(s.nav, i, -1))} className="text-neutral-400 hover:text-neutral-900" aria-label="Up"><ChevronUp className="size-4" /></button>
                        <button onClick={() => up("nav", move(s.nav, i, 1))} className="text-neutral-400 hover:text-neutral-900" aria-label="Down"><ChevronDown className="size-4" /></button>
                      </div>
                      <Input placeholder="Label" value={n.label} onChange={(e) => up("nav", s.nav.map((x) => (x.id === n.id ? { ...x, label: e.target.value } : x)))} />
                      <Input placeholder="/link" className="col-start-2 sm:col-start-auto" value={n.href} onChange={(e) => up("nav", s.nav.map((x) => (x.id === n.id ? { ...x, href: e.target.value } : x)))} />
                      <Input placeholder="Hint" className="col-start-2 sm:col-start-auto" value={n.hint ?? ""} onChange={(e) => up("nav", s.nav.map((x) => (x.id === n.id ? { ...x, hint: e.target.value } : x)))} />
                      <button onClick={() => up("nav", s.nav.filter((x) => x.id !== n.id))} className="row-start-1 grid size-9 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600 sm:row-start-auto" style={{ gridColumnStart: 3 }} aria-label="Remove"><Trash2 className="size-4" /></button>
                    </motion.div>
                  ))}
                </div>
                <Button variant="secondary" className="mt-3" onClick={() => up("nav", [...s.nav, { id: "n" + Date.now(), label: "New link", href: "/", hint: "" }])}><Plus className="size-4" /> Add link</Button>
              </Section>
              <Section title="Navbar button">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Label</Label><Input value={s.navCta.label} onChange={(e) => upIn("navCta", { label: e.target.value })} /></div>
                  <div><Label>Link</Label><Input value={s.navCta.href} onChange={(e) => upIn("navCta", { href: e.target.value })} /></div>
                </div>
              </Section>
            </>
          )}

          {tab === "sections" && (
            <Section title="Home page sections" desc="Toggle and reorder the sections of the home page.">
              <div className="space-y-2">
                {s.homeSections.map((h, i) => (
                  <motion.div layout key={h.key} className={cn("flex items-center gap-3 rounded-2xl p-3 ring-1 ring-black/5 transition", h.enabled ? "bg-white" : "bg-neutral-50 opacity-60")}>
                    <span className="w-6 text-center font-mono text-[12px] text-neutral-400">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 text-sm font-medium">{h.label}</span>
                    <button onClick={() => up("homeSections", move(s.homeSections, i, -1))} className="grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-black/5 hover:text-neutral-900" aria-label="Up"><ChevronUp className="size-4" /></button>
                    <button onClick={() => up("homeSections", move(s.homeSections, i, 1))} className="grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-black/5 hover:text-neutral-900" aria-label="Down"><ChevronDown className="size-4" /></button>
                    <Toggle checked={h.enabled} onChange={(v) => up("homeSections", s.homeSections.map((x) => (x.key === h.key ? { ...x, enabled: v } : x)))} />
                  </motion.div>
                ))}
              </div>
            </Section>
          )}

          {tab === "content" && (
            <>
              <Section title="Announcement bar">
                <div className="space-y-4">
                  <Toggle checked={s.announcement.enabled} onChange={(v) => upIn("announcement", { enabled: v })} label="Show announcement bar" />
                  <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                    <div><Label>Text</Label><Input value={s.announcement.text} onChange={(e) => upIn("announcement", { text: e.target.value })} /></div>
                    <div><Label>Link</Label><Input value={s.announcement.href} onChange={(e) => upIn("announcement", { href: e.target.value })} /></div>
                  </div>
                </div>
              </Section>
              <Section title="Manifesto" desc="The large text revealed word-by-word on scroll.">
                <Textarea rows={4} value={s.manifesto} onChange={(e) => up("manifesto", e.target.value)} />
              </Section>
              <Section title="Marquee words">
                <div className="flex flex-wrap gap-2">
                  {s.marquee.map((w, i) => (
                    <span key={w + i} className="inline-flex items-center gap-1 rounded-full bg-neutral-100 py-1 pl-3 pr-1 text-sm">
                      {w}
                      <button onClick={() => up("marquee", s.marquee.filter((_, j) => j !== i))} className="grid size-5 place-items-center rounded-full text-neutral-400 hover:bg-black/10 hover:text-neutral-900" aria-label="Remove"><X className="size-3" /></button>
                    </span>
                  ))}
                  <form onSubmit={(e) => { e.preventDefault(); if (chip.trim()) { up("marquee", [...s.marquee, chip.trim()]); setChip(""); } }}>
                    <input value={chip} onChange={(e) => setChip(e.target.value)} placeholder="+ Add word" className="h-8 w-32 rounded-full bg-white px-3 text-sm outline-none ring-1 ring-black/10 focus:ring-[#C9963F]" />
                  </form>
                </div>
              </Section>
              <Section title="Stats">
                <div className="space-y-2">
                  {s.stats.map((st, i) => (
                    <div key={i} className="grid grid-cols-[1fr_110px_70px_auto] gap-2">
                      <Input value={st.label} onChange={(e) => up("stats", s.stats.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))} />
                      <Input type="number" step="any" value={st.value} onChange={(e) => up("stats", s.stats.map((x, j) => (j === i ? { ...x, value: Number(e.target.value) } : x)))} />
                      <Input value={st.suffix} onChange={(e) => up("stats", s.stats.map((x, j) => (j === i ? { ...x, suffix: e.target.value } : x)))} placeholder="+" />
                      <button onClick={() => up("stats", s.stats.filter((_, j) => j !== i))} className="grid size-10 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600" aria-label="Remove"><Trash2 className="size-4" /></button>
                    </div>
                  ))}
                </div>
                <Button variant="secondary" className="mt-3" onClick={() => up("stats", [...s.stats, { label: "New stat", value: 0, suffix: "" }])}><Plus className="size-4" /> Add stat</Button>
              </Section>
              <Section title="Footer note">
                <Textarea rows={2} value={s.footerNote} onChange={(e) => up("footerNote", e.target.value)} />
              </Section>
            </>
          )}

          {tab === "contact" && (
            <>
              <Section title="Contact details">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><Label>Phone</Label><Input value={s.contact.phone} onChange={(e) => upIn("contact", { phone: e.target.value })} /></div>
                  <div><Label hint="Digits with country code">WhatsApp number</Label><Input value={s.contact.whatsapp} onChange={(e) => upIn("contact", { whatsapp: e.target.value })} /></div>
                  <div><Label>Email</Label><Input value={s.contact.email} onChange={(e) => upIn("contact", { email: e.target.value })} /></div>
                  <div><Label>Hours</Label><Input value={s.contact.hours} onChange={(e) => upIn("contact", { hours: e.target.value })} /></div>
                  <div className="sm:col-span-2"><Label>Address</Label><Textarea rows={2} value={s.contact.address} onChange={(e) => upIn("contact", { address: e.target.value })} /></div>
                </div>
              </Section>
              <Section title="Social links">
                <div className="grid gap-4 sm:grid-cols-2">
                  {(["instagram", "youtube", "facebook", "x"] as const).map((k) => (
                    <div key={k}><Label>{k === "x" ? "X (Twitter)" : k[0].toUpperCase() + k.slice(1)}</Label><Input value={s.socials[k]} onChange={(e) => upIn("socials", { [k]: e.target.value })} /></div>
                  ))}
                </div>
              </Section>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {dirty && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", stiffness: 400, damping: 34 }} className="fixed inset-x-0 bottom-4 z-40 flex justify-center px-4 lg:pl-[264px]">
            <div className="flex w-full max-w-lg items-center gap-3 rounded-full bg-neutral-900 py-2 pl-5 pr-2 text-white shadow-2xl">
              <span className="size-2 animate-pulse rounded-full bg-[#E8B86D]" />
              <span className="flex-1 text-sm">Unsaved changes</span>
              <button onClick={() => setS(saved)} className="rounded-full px-4 py-2 text-sm text-white/70 hover:text-white">Discard</button>
              <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-full bg-[#E8B86D] px-5 py-2 text-sm font-medium text-neutral-900 hover:bg-[#f0c886] disabled:opacity-60">
                <Save className="size-4" /> {saving ? "Saving…" : "Publish"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
