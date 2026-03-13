import { getCustomSession } from "@/actions/auth.action";
import { redirect } from "next/navigation";
import { isVendorPortalRole, VendorPortalRole } from "./roles";

export async function requireVendorPortalSession(
  allowedRoles?: VendorPortalRole[],
) {
  const session = await getCustomSession();
  const role = session.user.role as string;

  if (!isVendorPortalRole(role)) {
    redirect("/forbidden");
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    redirect("/forbidden");
  }

  return { session, role };
}
