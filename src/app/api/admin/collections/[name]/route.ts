import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createItem, list, logActivity } from "@/lib/db";
import type { CollectionName } from "@/lib/types";

const ALLOWED: CollectionName[] = ["services", "astrologers", "products", "posts", "testimonials", "faqs", "horoscopes", "bookings", "orders", "inquiries", "customers", "subscribers", "activity"];

export async function GET(_: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  if (!ALLOWED.includes(name as CollectionName)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  return NextResponse.json(list(name as CollectionName));
}

export async function POST(req: Request, ctx: { params: Promise<{ name: string }> }) {
  const { name } = await ctx.params;
  if (!ALLOWED.includes(name as CollectionName)) return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  const body = await req.json();
  if (["bookings", "orders", "inquiries", "customers", "subscribers"].includes(name) && !body.createdAt) body.createdAt = new Date().toISOString();
  const item = createItem(name as CollectionName, body);
  logActivity("cms", `Created ${name.replace(/s$/, "")} “${body.title || body.name || body.question || body.email || item.id}”`);
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}
