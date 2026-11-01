import { SettingsEditor } from "@/components/admin/Settings";
import { getSettings } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  return <SettingsEditor initial={JSON.parse(JSON.stringify(getSettings()))} />;
}
