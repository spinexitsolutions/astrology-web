import { AdminShell } from "@/components/admin/Shell";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const s = getSettings();
  return (
    <AdminShell brand={s.brandName} glyph={s.logoGlyph}>
      {children}
    </AdminShell>
  );
}
