import { NextResponse } from "next/server";
import { createItem, getDB, logActivity, touchCustomer, uid } from "@/lib/db";
import type { Booking, Inquiry, Order } from "@/lib/types";

const s = (v: unknown, max = 500) => String(v ?? "").slice(0, max).trim();

export async function POST(req: Request, ctx: { params: Promise<{ kind: string }> }) {
  const { kind } = await ctx.params;
  const b = await req.json().catch(() => ({}));
  const now = new Date().toISOString();
  const db = getDB();
  const cur = db.settings.currency;

  if (kind === "booking") {
    if (!s(b.name) || !s(b.phone)) return NextResponse.json({ error: "Name and phone are required" }, { status: 400 });
    const svc = db.services.find((x) => x.title === b.service);
    const booking: Booking = {
      id: uid("bk_"), name: s(b.name, 80), phone: s(b.phone, 30), email: s(b.email, 120), service: s(b.service, 120) || "General consultation",
      astrologer: s(b.astrologer, 120) || "Any available", mode: (["Call", "Video", "Chat", "In-person"].includes(b.mode) ? b.mode : "Call"),
      date: s(b.date, 10), time: s(b.time, 5), dob: s(b.dob, 10), tob: s(b.tob, 5), pob: s(b.pob, 120), message: s(b.message, 1000),
      amount: svc?.price ?? 999, status: "pending", paid: false, createdAt: now,
    };
    createItem("bookings", booking);
    touchCustomer({ name: booking.name, phone: booking.phone, email: booking.email, source: "Booking", dob: booking.dob });
    logActivity("booking", `${booking.name} booked ${booking.service}`);
    return NextResponse.json({ ok: true, id: booking.id });
  }

  if (kind === "order") {
    const items = Array.isArray(b.items) ? b.items : [];
    const lines = items
      .map((it: { productId: string; qty: number }) => {
        const p = db.products.find((x) => x.id === it.productId);
        return p ? { productId: p.id, name: p.name, price: p.price, qty: Math.max(1, Math.min(20, Number(it.qty) || 1)) } : null;
      })
      .filter(Boolean) as Order["items"];
    if (!lines.length || !s(b.name) || !s(b.phone)) return NextResponse.json({ error: "Missing details" }, { status: 400 });
    const total = lines.reduce((a, x) => a + x.price * x.qty, 0);
    const order: Order = {
      id: uid("o_"), name: s(b.name, 80), phone: s(b.phone, 30), email: s(b.email, 120), address: s(b.address, 400), items: lines, total,
      status: "placed", payment: (["COD", "UPI", "Card"].includes(b.payment) ? b.payment : "COD"), createdAt: now,
    };
    createItem("orders", order);
    for (const l of lines) {
      const p = db.products.find((x) => x.id === l.productId);
      if (p) p.stock = Math.max(0, p.stock - l.qty);
    }
    touchCustomer({ name: order.name, phone: order.phone, email: order.email, source: "Order", value: total });
    logActivity("order", `New order from ${order.name} — ${cur}${total.toLocaleString("en-IN")}`);
    return NextResponse.json({ ok: true, id: order.id });
  }

  if (kind === "inquiry") {
    if (!s(b.name) || !(s(b.phone) || s(b.email))) return NextResponse.json({ error: "Name and phone/email are required" }, { status: 400 });
    const inq: Inquiry = {
      id: uid("i_"), name: s(b.name, 80), phone: s(b.phone, 30), email: s(b.email, 120), subject: s(b.subject, 120) || "General",
      message: s(b.message, 2000), source: s(b.source, 40) || "Contact form", status: "new", createdAt: now,
    };
    createItem("inquiries", inq);
    touchCustomer({ name: inq.name, phone: inq.phone, email: inq.email, source: inq.source });
    logActivity("inquiry", `${inq.name}: ${inq.subject}`);
    return NextResponse.json({ ok: true });
  }

  if (kind === "subscribe") {
    const email = s(b.email, 120).toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) return NextResponse.json({ error: "Enter a valid email" }, { status: 400 });
    if (!db.subscribers.some((x) => x.email === email)) {
      createItem("subscribers", { id: uid("sub_"), email, sign: s(b.sign, 20), createdAt: now });
      logActivity("subscriber", `${email} subscribed`);
    }
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "Unknown" }, { status: 404 });
}
