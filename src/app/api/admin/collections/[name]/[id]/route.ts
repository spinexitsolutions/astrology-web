import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { deleteItem, getItem, logActivity, updateItem } from "@/lib/db";
import type { CollectionName } from "@/lib/types";

type Ctx = { params: Promise<{ name: string; id: string }> };

export async function GET(_: Request, ctx: Ctx) {
  const { name, id } = await ctx.params;
  const item = getItem(name as CollectionName, id);
  return item ? NextResponse.json(item) : NextResponse.json({ error: "Not found" }, { status: 404 });
}

export async function PUT(req: Request, ctx: Ctx) {
  const { name, id } = await ctx.params;
  const body = await req.json();
  const item = updateItem(name as CollectionName, id, body);
  if (!item) return NextResponse.json({ error: "Not found" }, { status: 404 });
  revalidatePath("/", "layout");
  return NextResponse.json(item);
}

export async function DELETE(_: Request, ctx: Ctx) {
  const { name, id } = await ctx.params;
  deleteItem(name as CollectionName, id);
  logActivity("cms", `Deleted an item from ${name}`);
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
