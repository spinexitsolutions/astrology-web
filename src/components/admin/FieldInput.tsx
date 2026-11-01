"use client";

import { ImageIcon } from "lucide-react";
import { slugify } from "@/lib/utils";
import type { Field } from "./schemas";
import { Input, Label, Select, Textarea, Toggle } from "./ui";

export function FieldInput({ field, value, onChange, draft }: { field: Field; value: unknown; onChange: (v: unknown) => void; draft?: Record<string, unknown> }) {
  const v = value ?? "";
  switch (field.type) {
    case "boolean":
      return (
        <div className="flex h-full items-center rounded-xl bg-white px-3.5 py-2.5 ring-1 ring-black/10">
          <Toggle checked={Boolean(value)} onChange={onChange} label={field.label} />
        </div>
      );
    case "textarea":
    case "longtext":
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <Textarea rows={field.type === "longtext" ? 10 : 3} value={String(v)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case "number":
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <Input type="number" value={v === "" ? "" : Number(v)} min={field.min} max={field.max} step={field.step ?? 1} onChange={(e) => onChange(e.target.value === "" ? 0 : Number(e.target.value))} />
        </div>
      );
    case "select":
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <Select options={field.options ?? []} value={String(v)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case "date":
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <Input type="date" value={String(v)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
    case "color":
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <div className="flex items-center gap-2">
            <input type="color" value={String(v) || "#000000"} onChange={(e) => onChange(e.target.value)} className="h-10 w-12 cursor-pointer rounded-lg border border-black/10 bg-white p-1" />
            <Input value={String(v)} onChange={(e) => onChange(e.target.value)} />
          </div>
        </div>
      );
    case "slug":
      return (
        <div>
          <Label hint="URL">{field.label}</Label>
          <div className="flex gap-2">
            <Input value={String(v)} onChange={(e) => onChange(slugify(e.target.value))} placeholder="auto-from-title" />
            {field.from && (
              <button type="button" onClick={() => onChange(slugify(String(draft?.[field.from!] ?? "")))} className="shrink-0 rounded-xl bg-black/[0.05] px-3 text-[13px] text-neutral-600 hover:bg-black/10">
                Generate
              </button>
            )}
          </div>
        </div>
      );
    case "image":
      return (
        <div>
          <Label hint={field.hint ?? "Paste an image URL (Unsplash works great)"}>{field.label}</Label>
          <div className="flex gap-3">
            <div className="grid size-[74px] shrink-0 place-items-center overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {v ? <img src={String(v)} alt="" className="size-full object-cover" /> : <ImageIcon className="size-5 text-neutral-300" />}
            </div>
            <Textarea rows={2} className="min-h-[74px] font-mono text-[12px]" value={String(v)} onChange={(e) => onChange(e.target.value.trim())} placeholder="https://images.unsplash.com/…" />
          </div>
        </div>
      );
    default:
      return (
        <div>
          <Label hint={field.hint}>{field.label}</Label>
          <Input value={String(v)} onChange={(e) => onChange(e.target.value)} />
        </div>
      );
  }
}
