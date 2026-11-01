"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { cn, slugify } from "@/lib/utils";
import { FieldInput } from "./FieldInput";
import { SCHEMAS } from "./schemas";
import { api, Button, Card, Drawer, Empty, PageHeader, Toggle, useToast } from "./ui";

type Row = Record<string, unknown> & { id: string };

export function CollectionEditor({ name, initial }: { name: string; initial: Row[] }) {
  const schema = SCHEMAS[name];
  const toast = useToast();
  const [rows, setRows] = useState<Row[]>(initial);
  const [q, setQ] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);

  const visible = useMemo(() => {
    const list = [...rows];
    if (schema.sort) list.sort(schema.sort);
    if (!q) return list;
    const needle = q.toLowerCase();
    return list.filter((r) => JSON.stringify(r).toLowerCase().includes(needle));
  }, [rows, q, schema]);

  const titleOf = (r: Row) => (schema.title ? schema.title(r) : String(r[schema.titleKey] ?? "Untitled"));

  const openNew = () => {
    setIsNew(true);
    setEditing({ id: "", ...schema.defaults() } as Row);
  };
  const openEdit = (r: Row) => {
    setIsNew(false);
    setEditing({ ...r });
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body: Record<string, unknown> = { ...editing };
      const slugField = schema.fields.find((f) => f.type === "slug");
      if (slugField && !body.slug && slugField.from) body.slug = slugify(String(body[slugField.from] ?? ""));
      if (isNew) {
        delete body.id;
        const created = await api<Row>(`/api/admin/collections/${name}`, "POST", body);
        setRows((r) => [created, ...r]);
        toast(`${schema.singular} created`);
      } else {
        const updated = await api<Row>(`/api/admin/collections/${name}/${editing.id}`, "PUT", body);
        setRows((r) => r.map((x) => (x.id === updated.id ? updated : x)));
        toast("Changes saved — live on site");
      }
      setEditing(null);
    } catch (e) {
      toast((e as Error).message, "err");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (r: Row) => {
    if (!confirm(`Delete “${titleOf(r)}”? This cannot be undone.`)) return;
    await api(`/api/admin/collections/${name}/${r.id}`, "DELETE");
    setRows((x) => x.filter((y) => y.id !== r.id));
    setEditing(null);
    toast(`${schema.singular} deleted`);
  };

  const togglePublish = async (r: Row, v: boolean) => {
    if (!schema.publishKey) return;
    setRows((x) => x.map((y) => (y.id === r.id ? { ...y, [schema.publishKey!]: v } : y)));
    try {
      await api(`/api/admin/collections/${name}/${r.id}`, "PUT", { [schema.publishKey]: v });
      toast(v ? "Published" : "Hidden from site");
    } catch (e) {
      toast((e as Error).message, "err");
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="CMS"
        title={schema.label}
        subtitle={schema.description}
        actions={
          <Button variant="gold" onClick={openNew}>
            <Plus className="size-4" /> New {schema.singular.toLowerCase()}
          </Button>
        }
      />

      <div className="mb-4 flex items-center gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-neutral-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${schema.label.toLowerCase()}…`} className="h-10 w-full rounded-full bg-white pl-10 pr-4 text-sm outline-none ring-1 ring-black/10 focus:ring-2 focus:ring-[#C9963F]/40" />
        </div>
        <span className="text-[13px] text-neutral-400">{visible.length} items</span>
      </div>

      {visible.length === 0 ? (
        <Empty text={q ? "Nothing matches your search." : `No ${schema.label.toLowerCase()} yet — create the first one.`} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence initial={false}>
            {visible.map((r) => {
              const img = schema.imageKey ? String(r[schema.imageKey] ?? "") : "";
              const hue = schema.cardHue?.(r);
              const pub = schema.publishKey ? Boolean(r[schema.publishKey]) : true;
              return (
                <motion.div key={r.id} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}>
                  <Card className={cn("group flex h-full flex-col overflow-hidden transition hover:shadow-lg", !pub && "opacity-60")}>
                    {(schema.imageKey || hue !== undefined) && (
                      <button onClick={() => openEdit(r)} className="relative h-36 overflow-hidden bg-neutral-100">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className="size-full object-cover transition duration-700 group-hover:scale-105" />
                        ) : hue !== undefined ? (
                          <div className="grid size-full place-items-center" style={{ background: `radial-gradient(circle at 40% 35%, hsl(${hue} 80% 75%), hsl(${hue} 60% 35%) 60%, #0b0b12)` }}>
                            <span className="size-14 rotate-45 rounded-xl border border-white/40 bg-white/20 backdrop-blur" />
                          </div>
                        ) : null}
                      </button>
                    )}
                    <div className="flex flex-1 flex-col p-4">
                      <button onClick={() => openEdit(r)} className="text-left">
                        <div className="line-clamp-2 font-medium leading-snug">{titleOf(r)}</div>
                        <div className="mt-1 line-clamp-2 text-[13px] text-neutral-500">{schema.subtitle(r)}</div>
                      </button>
                      <div className="mt-auto flex items-center justify-between pt-4">
                        {schema.publishKey ? <Toggle checked={pub} onChange={(v) => togglePublish(r, v)} label={pub ? "Live" : "Hidden"} /> : <span />}
                        <div className="flex gap-1">
                          <button onClick={() => openEdit(r)} className="grid size-8 place-items-center rounded-full text-neutral-500 hover:bg-black/5 hover:text-neutral-900" aria-label="Edit">
                            <Pencil className="size-4" />
                          </button>
                          <button onClick={() => remove(r)} className="grid size-8 place-items-center rounded-full text-neutral-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      <Drawer
        open={!!editing}
        onClose={() => setEditing(null)}
        title={isNew ? `New ${schema.singular.toLowerCase()}` : `Edit ${schema.singular.toLowerCase()}`}
        footer={
          <>
            {!isNew && editing && (
              <Button variant="danger" className="mr-auto" onClick={() => remove(editing)}>
                <Trash2 className="size-4" /> Delete
              </Button>
            )}
            <Button variant="secondary" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={save} loading={saving}>
              {isNew ? "Create" : "Save changes"}
            </Button>
          </>
        }
      >
        {editing && (
          <div className="grid grid-cols-2 gap-4">
            {schema.extra && <div className="col-span-2">{schema.extra(editing)}</div>}
            {schema.fields.map((f) => (
              <div key={f.key} className={f.half ? "col-span-2 sm:col-span-1" : "col-span-2"}>
                <FieldInput
                  field={f}
                  value={editing[f.key]}
                  draft={editing}
                  onChange={(v) =>
                    setEditing((d) => {
                      if (!d) return d;
                      const next = { ...d, [f.key]: v };
                      // auto slug while creating
                      const slugField = schema.fields.find((x) => x.type === "slug" && x.from === f.key);
                      if (slugField && isNew) next[slugField.key] = slugify(String(v));
                      return next;
                    })
                  }
                />
              </div>
            ))}
          </div>
        )}
      </Drawer>
    </>
  );
}
