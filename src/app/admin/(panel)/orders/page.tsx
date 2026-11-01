import { Orders } from "@/components/admin/Orders";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  const db = getDB();
  return <Orders initial={JSON.parse(JSON.stringify(db.orders))} currency={db.settings.currency} />;
}
