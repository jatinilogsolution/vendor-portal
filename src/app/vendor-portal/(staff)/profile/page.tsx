import { ProfileContent } from "@/app/(private)/profile/_components/profile-content"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"

export default async function StaffProfilePage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])

    return <ProfileContent portalSource="vendor" />
}
