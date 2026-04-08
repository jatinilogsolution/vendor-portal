// src/app/vendor-portal/(vendor)/layout.tsx
import { VpShell } from "@/components/vendor-portal/page-shell"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"

const NAV = [
  { title: "Dashboard",       href: "/vendor-portal/vendor",                    icon: "dashboard" },
  // ── Quote / Procurement ──
  { title: "My Quotes (PIs)", href: "/vendor-portal/vendor/my-quotes",          icon: "pis" },
  // ── Orders ──
  { title: "My POs",          href: "/vendor-portal/vendor/my-pos",             icon: "pos" },
  // ── Billing ──
  { title: "My Invoices",     href: "/vendor-portal/vendor/my-invoices",        icon: "invoices" },
  { title: "Recurring Bills", href: "/vendor-portal/vendor/recurring",          icon: "recurring" },
  // ── Logistics ──
  { title: "My Deliveries",   href: "/vendor-portal/vendor/my-deliveries",      icon: "deliveries" },
  { title: "My Returns",      href: "/vendor-portal/vendor/my-returns",         icon: "returns" },
  // ── Notifications ──
  { title: "Notifications",   href: "/vendor-portal/vendor/notifications",      icon: "bell" },
  { title: "My Profile", href: "/vendor-portal/vendor/profile", icon: "user" },

]
export default async function VendorLayout({ children }: { children: React.ReactNode }) {
    await requireVendorPortalSession([UserRoleEnum.VENDOR])
    return <VpShell nav={NAV} role="VENDOR" sidebarTitle="Vendor Portal">{children}</VpShell>
}
