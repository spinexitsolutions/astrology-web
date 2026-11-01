import { Suspense } from "react";
import { Customers } from "@/components/admin/Customers";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  const db = getDB();
  const plain = <T,>(x: T): T => JSON.parse(JSON.stringify(x));
  return (
    <Suspense>
      <Customers initial={plain(db.customers)} bookings={plain(db.bookings)} orders={plain(db.orders)} currency={db.settings.currency} />
    </Suspense>
  );
}
