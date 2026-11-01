import "server-only";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { seed } from "./seed";
import type { Activity, CollectionName, DB } from "./types";

/**
 * Tiny JSON-file database. Zero setup, perfect for demos & small sites.
 * Data lives in ./data/db.json (or $DATA_DIR). On read-only hosts it falls
 * back to the OS temp dir so the admin panel keeps working.
 * Swap this module for Postgres/Mongo later without touching the UI.
 */

const primaryDir = process.env.DATA_DIR || path.join(process.cwd(), "data");
let dataFile = path.join(primaryDir, "db.json");

let cache: DB | null = null;

function deepMerge<T>(base: T, extra: unknown): T {
  if (Array.isArray(base) || typeof base !== "object" || base === null) {
    return (extra === undefined ? base : extra) as T;
  }
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  if (extra && typeof extra === "object") {
    for (const [k, v] of Object.entries(extra as Record<string, unknown>)) {
      out[k] = k in out ? deepMerge(out[k], v) : v;
    }
  }
  return out as T;
}

function load(): DB {
  if (cache) return cache;
  const candidates = [dataFile, path.join(os.tmpdir(), "astrology-web", "db.json")];
  for (const file of candidates) {
    try {
      if (fs.existsSync(file)) {
        const raw = JSON.parse(fs.readFileSync(file, "utf8"));
        // merge so new settings keys added in code appear in old databases
        cache = { ...structuredClone(seed), ...raw, settings: deepMerge(structuredClone(seed.settings), raw.settings) } as DB;
        dataFile = file;
        return cache!;
      }
    } catch {
      /* try next */
    }
  }
  cache = structuredClone(seed);
  persist();
  return cache;
}

function persist() {
  if (!cache) return;
  const body = JSON.stringify(cache, null, 2);
  try {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    fs.writeFileSync(dataFile, body);
  } catch {
    const fallback = path.join(os.tmpdir(), "astrology-web", "db.json");
    try {
      fs.mkdirSync(path.dirname(fallback), { recursive: true });
      fs.writeFileSync(fallback, body);
      dataFile = fallback;
    } catch {
      /* in-memory only */
    }
  }
}

export function uid(prefix = "") {
  return prefix + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

export function getDB(): DB {
  return load();
}

export function getSettings() {
  return load().settings;
}

export function updateSettings(patch: Partial<DB["settings"]>) {
  const db = load();
  db.settings = deepMerge(db.settings, patch);
  persist();
  return db.settings;
}

export function list<K extends CollectionName>(name: K): DB[K] {
  return load()[name];
}

type Item<K extends CollectionName> = DB[K][number];

export function getItem<K extends CollectionName>(name: K, id: string): Item<K> | undefined {
  return (load()[name] as Item<K>[]).find((x) => (x as { id: string }).id === id);
}

export function createItem<K extends CollectionName>(name: K, data: Partial<Item<K>>): Item<K> {
  const db = load();
  const item = { ...data, id: (data as { id?: string }).id || uid() } as Item<K>;
  (db[name] as Item<K>[]).unshift(item);
  persist();
  return item;
}

export function updateItem<K extends CollectionName>(name: K, id: string, patch: Partial<Item<K>>) {
  const db = load();
  const arr = db[name] as Item<K>[];
  const i = arr.findIndex((x) => (x as { id: string }).id === id);
  if (i < 0) return undefined;
  arr[i] = { ...arr[i], ...patch, id } as Item<K>;
  persist();
  return arr[i];
}

export function deleteItem(name: CollectionName, id: string) {
  const db = load();
  const arr = db[name] as { id: string }[];
  const i = arr.findIndex((x) => x.id === id);
  if (i >= 0) arr.splice(i, 1);
  persist();
  return i >= 0;
}

export function logActivity(type: string, text: string) {
  const db = load();
  const a: Activity = { id: uid(), type, text, createdAt: new Date().toISOString() };
  db.activity.unshift(a);
  db.activity = db.activity.slice(0, 200);
  persist();
}

/** Upsert a CRM customer from any touch-point (booking, order, inquiry). */
export function touchCustomer(input: { name: string; phone: string; email: string; source: string; value?: number; dob?: string }) {
  const db = load();
  const key = (input.email || input.phone || "").toLowerCase();
  const now = new Date().toISOString();
  let c = db.customers.find(
    (x) => (x.email && x.email.toLowerCase() === key) || (x.phone && x.phone === input.phone && input.phone)
  );
  if (!c) {
    c = {
      id: uid("c_"),
      name: input.name,
      phone: input.phone,
      email: input.email,
      city: "",
      sign: "",
      dob: input.dob || "",
      status: "new",
      tags: input.source,
      notes: "",
      source: input.source,
      value: 0,
      lastContact: now,
      createdAt: now,
    };
    db.customers.unshift(c);
  }
  c.value += input.value || 0;
  c.lastContact = now;
  if (!c.tags.split(",").map((t) => t.trim()).includes(input.source)) c.tags = [c.tags, input.source].filter(Boolean).join(", ");
  persist();
  return c;
}

export function resetDB() {
  cache = structuredClone(seed);
  persist();
}
