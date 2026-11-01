import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { list } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  return <CollectionEditor name="horoscopes" initial={JSON.parse(JSON.stringify(list("horoscopes")))} />;
}
