"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { inputCls, Label } from "./ui";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@taarak.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, password }) });
    if (res.ok) {
      const next = params.get("next");
      router.push(next && next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } else {
      setError((await res.json().catch(() => ({}))).error || "Login failed");
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-8 space-y-4">
      <div>
        <Label>Email</Label>
        <input className={inputCls} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required />
      </div>
      <div>
        <Label>Password</Label>
        <input className={inputCls} type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="••••••••" required />
      </div>
      {error && (
        <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-600">
          {error}
        </motion.p>
      )}
      <button disabled={loading} className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-neutral-900 text-sm font-medium text-white transition hover:bg-neutral-700 active:scale-[0.98] disabled:opacity-60">
        {loading ? <Loader2 className="size-4 animate-spin" /> : <>Sign in <ArrowUpRight className="size-4" /></>}
      </button>
      <div className="rounded-2xl bg-[#C9963F]/10 p-4 text-[13px] text-[#8a6426]">
        <div className="font-medium">Demo credentials</div>
        <div className="mt-1 font-mono text-[12px]">admin@taarak.in · taarak@123</div>
      </div>
    </form>
  );
}
