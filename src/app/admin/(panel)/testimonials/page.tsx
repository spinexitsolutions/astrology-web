import { CollectionEditor } from "@/components/admin/CollectionEditor";
import { list } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  return <CollectionEditor name="testimonials" initial={JSON.parse(JSON.stringify(list("testimonials")))} />;
}
