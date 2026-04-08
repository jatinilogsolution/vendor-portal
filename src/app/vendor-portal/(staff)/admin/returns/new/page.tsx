import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { Button } from "@/components/ui/button"
import { ReturnForm } from "../_components/return-form"

export default async function AdminNewReturnPage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Record Return"
                description="Schedule a vendor return pickup and notify the vendor."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/admin/returns">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <ReturnForm />
        </div>
    )
}
