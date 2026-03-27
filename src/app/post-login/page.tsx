// src/app/post-login/page.tsx
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { isVendorPortalRole, getVendorPortalHome } from "@/lib/vendor-portal"

export default async function PostLoginPage() {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch {
    session = null
  }

  if (!session) redirect("/auth/login")

  const role = session.user?.role

  // Vendor portal roles → go straight to their portal home
  if (isVendorPortalRole(role)) {
    redirect(getVendorPortalHome(role))
  }

  // All other roles (TADMIN, TVENDOR, etc.) → transport dashboard
  redirect("/dashboard")
}
