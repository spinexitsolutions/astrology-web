"use client";
import { useState } from "react";
import { PLACES } from "@/lib/astro";

export type BirthInput = { name: string; date: string; time: string; place: string; lat: number; lon: number; tz: number };

export function emptyBirth(name = ""): BirthInput {
  return { name, date: "1995-08-15", time: "10:30", place: PLACES[0].name, lat: PLACES[0].lat, lon: PLACES[0].lon, tz: PLACES[0].tz };
}

export default function BirthFields({ value, onChange, label }: { value: BirthInput; onChange: (v: BirthInput) => void; label?: string }) {
  const [custom, setCustom] = useState(false);
  const set = (p: Partial<BirthInput>) => onChange({ ...value, ...p });
  return (
    <div className="grid gap-3">
      {label && <p className="eyebrow">{label}</p>}
      <input className="field" placeholder="Full name" value={value.name} onChange={(e) => set({ name: e.target.value })} aria-label="Full name" />
      <div className="grid grid-cols-2 gap-3">
        <label className="grid gap-1.5 text-xs text-mist">Date of birth<input type="date" required className="field" value={value.date} onChange={(e) => set({ date: e.target.value })} /></label>
        <label className="grid gap-1.5 text-xs text-mist">Time of birth<input type="time" className="field" value={value.time} onChange={(e) => set({ time: e.target.value })} /></label>
      </div>
      <label className="grid gap-1.5 text-xs text-mist">
        Place of birth
        <select
          className="field"
          value={custom ? "__custom" : value.place}
          onChange={(e) => {
            if (e.target.value === "__custom") return setCustom(true);
            setCustom(false);
            const p = PLACES.find((x) => x.name === e.target.value)!;
            set({ place: p.name, lat: p.lat, lon: p.lon, tz: p.tz });
          }}
        >
          {PLACES.map((p) => <option key={p.name} value={p.name}>{p.name}</option>)}
          <option value="__custom">Other — enter coordinates</option>
        </select>
      </label>
      {custom && (
        <div className="grid grid-cols-3 gap-3">
          <input className="field" type="number" step="0.0001" placeholder="Latitude" value={value.lat} onChange={(e) => set({ lat: +e.target.value, place: "Custom" })} aria-label="Latitude" />
          <input className="field" type="number" step="0.0001" placeholder="Longitude" value={value.lon} onChange={(e) => set({ lon: +e.target.value, place: "Custom" })} aria-label="Longitude" />
          <input className="field" type="number" step="0.25" placeholder="UTC offset" value={value.tz} onChange={(e) => set({ tz: +e.target.value })} aria-label="UTC offset" />
        </div>
      )}
    </div>
  );
}
