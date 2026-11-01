import { Inquiries } from "@/components/admin/Inquiries";
import { list } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function Page() {
  return <Inquiries initial={JSON.parse(JSON.stringify(list("inquiries")))} />;
}
