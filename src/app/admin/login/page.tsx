import { Suspense } from "react";
import { getSettings } from "@/lib/db";
import { LoginForm } from "@/components/admin/LoginForm";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const s = getSettings();
  return (
    <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
      {/* cosmic panel */}
      <div className="relative hidden overflow-hidden bg-[#07070C] text-[#F3EEE5] lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={s.hero.image} alt="" className="absolute inset-0 size-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07070C] via-[#07070C]/40 to-transparent" />
        <svg viewBox="0 0 400 400" className="absolute -right-24 -top-24 size-[560px] animate-[spin_90s_linear_infinite] opacity-30" fill="none" stroke="#E8B86D" strokeWidth="0.6">
          <circle cx="200" cy="200" r="190" />
          <circle cx="200" cy="200" r="150" />
          <circle cx="200" cy="200" r="110" strokeDasharray="2 6" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line key={i} x1="200" y1="10" x2="200" y2="50" transform={`rotate(${i * 30} 200 200)`} />
          ))}
        </svg>
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-2xl bg-white/10 text-xl text-[#E8B86D] backdrop-blur">{s.logoGlyph}</span>
            <span className="font-display text-3xl">{s.brandName}</span>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#E8B86D]">Studio · CMS + CRM</p>
            <h1 className="mt-4 max-w-md font-display text-6xl leading-[0.95] tracking-tight">
              Run the whole <em className="text-[#E8B86D]">cosmos</em> from one calm place.
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-white/60">Content, intro animation, bookings, orders and every customer relationship — all editable, all live.</p>
          </div>
        </div>
      </div>

      {/* form */}
      <div className="flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3 lg:hidden">
            <span className="grid size-10 place-items-center rounded-2xl bg-neutral-900 text-[#E8B86D]">{s.logoGlyph}</span>
            <span className="font-display text-3xl">{s.brandName}</span>
          </div>
          <h2 className="font-display text-5xl tracking-tight">Welcome back</h2>
          <p className="mt-2 text-sm text-neutral-500">Sign in to the {s.brandName} Studio.</p>
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
