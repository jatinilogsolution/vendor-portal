import { VpShell } from "@/components/vendor-portal/page-shell"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"

const ADMIN_NAV = [
    { title: "Dashboard", href: "/vendor-portal/admin", icon: "dashboard" },
    { title: "Companies", href: "/vendor-portal/admin/companies", icon: "companies" },
    { title: "Vendors", href: "/vendor-portal/admin/vendors", icon: "vendors" },
    { title: "Categories", href: "/vendor-portal/admin/categories", icon: "categories" },
    { title: "Item Master", href: "/vendor-portal/admin/items", icon: "items" },
    // ── Procurement section ──
    { title: "Procurement", href: "/vendor-portal/admin/procurement", icon: "procurement" },
    { title: "Purchase Orders", href: "/vendor-portal/admin/purchase-orders", icon: "pos" },
    { title: "Proforma Invoices", href: "/vendor-portal/admin/proforma-invoices", icon: "pis" },
    // ── Operations section ──
    { title: "Vendor Bills", href: "/vendor-portal/admin/invoices", icon: "invoices" },
    { title: "Deliveries", href: "/vendor-portal/admin/deliveries", icon: "deliveries" },
    { title: "Returns", href: "/vendor-portal/admin/returns", icon: "returns" },
    { title: "Recurring", href: "/vendor-portal/admin/recurring", icon: "recurring" },
    // ── System ──
    { title: "Users", href: "/vendor-portal/admin/users", icon: "users" },
    { title: "Profile", href: "/vendor-portal/profile", icon: "user" },
    { title: "Settings", href: "/vendor-portal/admin/settings", icon: "settings" },
]

const BOSS_NAV = [
    { title: "Dashboard", href: "/vendor-portal/boss", icon: "dashboard" },
    // ── Approval queue ──
    { title: "Approval Queue", href: "/vendor-portal/boss/approvals", icon: "approvals" },
    { title: "Companies", href: "/vendor-portal/admin/companies", icon: "companies" },
    // ── View all (same admin pages — boss can see them via admin layout) ──
    { title: "Procurement", href: "/vendor-portal/admin/procurement", icon: "procurement" },
    { title: "Purchase Orders", href: "/vendor-portal/admin/purchase-orders", icon: "pos" },
    { title: "Vendor Bills", href: "/vendor-portal/admin/invoices", icon: "invoices" },
    // ── Finance ──
    { title: "Payments", href: "/vendor-portal/boss/payments", icon: "payments" },
    { title: "Reports", href: "/vendor-portal/boss/reports", icon: "reports" },
    { title: "Audit Logs", href: "/vendor-portal/boss/logs", icon: "logs" },
    // ── Vendors ──
    { title: "Vendors", href: "/vendor-portal/admin/vendors", icon: "vendors" },
    { title: "Users", href: "/vendor-portal/admin/users", icon: "users" },
    { title: "Profile", href: "/vendor-portal/profile", icon: "user" },

]

export default async function CombinedStaffLayout({ children }: { children: React.ReactNode }) {
    const { role } = await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])

    const isBoss = role === UserRoleEnum.BOSS
    const nav = isBoss ? BOSS_NAV : ADMIN_NAV
    const shellRole = isBoss ? "BOSS" : "ADMIN"
    const sidebarTitle = isBoss ? "Management" : "Admin Portal"

    return (
        <VpShell nav={nav} role={shellRole} sidebarTitle={sidebarTitle}>
            {children}
        </VpShell>
    )
}
