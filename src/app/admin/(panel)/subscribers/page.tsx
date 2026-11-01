import { Subscribers } from "@/components/admin/Inquiries";
import { list } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  return <Subscribers initial={JSON.parse(JSON.stringify(list("subscribers")))} />;
}
