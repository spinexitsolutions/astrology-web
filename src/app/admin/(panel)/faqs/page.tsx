import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { list } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  return <CollectionEditor name="faqs" initial={JSON.parse(JSON.stringify(list("faqs")))} />;
}
