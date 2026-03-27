// src/app/vendor-portal/layout.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"

export default async function VendorPortalRootLayout({ children }: { children: React.ReactNode }) {
    await requireVendorPortalSession() // any VP role — sub-layouts filter further
    return <>{children}</>
}