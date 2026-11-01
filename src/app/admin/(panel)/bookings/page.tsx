import { Bookings } from "@/components/admin/Bookings";
import { getDB } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  const db = getDB();
  return (
    <Bookings
      initial={JSON.parse(JSON.stringify(db.bookings))}
      services={db.services.map((s) => s.title)}
      astrologers={db.astrologers.map((a) => a.name)}
      currency={db.settings.currency}
    />
  );
}
