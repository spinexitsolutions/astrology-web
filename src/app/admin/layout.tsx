import type { Metadata } from "next";

export const metadata: Metadata = { title: "Studio", robots: { index: false, follow: false } };

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 [color-scheme:light]">{children}</div>;
}
