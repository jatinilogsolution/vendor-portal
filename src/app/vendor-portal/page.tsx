import { redirect } from "next/navigation";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import { getVendorPortalHome } from "@/lib/vendor-portal/roles";

export default async function VendorPortalIndexPage() {
  const { role } = await requireVendorPortalSession();
  redirect(getVendorPortalHome(role));
}
