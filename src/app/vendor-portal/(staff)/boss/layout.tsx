import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"

export default async function BossRestrictLayout({ children }: { children: React.ReactNode }) {
    // Only BOSS allowed in this directory
    await requireVendorPortalSession([UserRoleEnum.BOSS])
    return <>{children}</>
}
