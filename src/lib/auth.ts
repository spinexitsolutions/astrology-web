import crypto from "node:crypto";

export const ADMIN_COOKIE = "taarak_admin";

const SECRET = process.env.ADMIN_SECRET || "taarak-dev-secret-change-me";
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@taarak.in";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "taarak@123";

export function signToken(email: string) {
  const exp = Date.now() + 1000 * 60 * 60 * 24 * 7;
  const payload = Buffer.from(JSON.stringify({ email, exp })).toString("base64url");
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

export function verifyToken(token?: string | null) {
  if (!token) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (sig.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (data.exp < Date.now()) return null;
    return data as { email: string; exp: number };
  } catch {
    return null;
  }
}
