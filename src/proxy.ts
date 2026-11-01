import { NextResponse, type NextRequest } from "next/server";
import { ADMIN_COOKIE, verifyToken } from "@/lib/auth";

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const ok = verifyToken(req.cookies.get(ADMIN_COOKIE)?.value);
  if (pathname.startsWith("/api/admin")) {
    if (pathname.startsWith("/api/admin/login")) return NextResponse.next();
    if (!ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    return NextResponse.next();
  }
  if (pathname === "/admin/login") {
    return ok ? NextResponse.redirect(new URL("/admin", req.url)) : NextResponse.next();
  }
  if (!ok) {
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
