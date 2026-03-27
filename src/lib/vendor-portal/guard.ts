// src/lib/vendor-portal/guard.ts
import { redirect } from "next/navigation"
import { getCustomSession } from "@/actions/auth.action"
import { isVendorPortalRole, VendorPortalRole } from "./roles"

export async function requireVendorPortalSession(allowedRoles?: VendorPortalRole[]) {
  const session = await getCustomSession()
  const role = session.user.role as string

  if (!isVendorPortalRole(role)) redirect("/dashboard")
  if (allowedRoles && !allowedRoles.includes(role as VendorPortalRole)) redirect("/forbidden")

  return {
    session,
    role: role as VendorPortalRole,
    userId: session.user.id,
    vendorId: (session.user as any).vendorId as string | undefined,
  }
}