import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { resetDB } from "@/lib/db";

export async function POST() {
  resetDB();
  revalidatePath("/", "layout");
  return NextResponse.json({ ok: true });
}
