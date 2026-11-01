import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettings, logActivity, updateSettings } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getSettings());
}

export async function PUT(req: Request) {
  const patch = await req.json();
  const s = updateSettings(patch);
  logActivity("cms", "Site settings updated");
  revalidatePath("/", "layout");
  return NextResponse.json(s);
}
