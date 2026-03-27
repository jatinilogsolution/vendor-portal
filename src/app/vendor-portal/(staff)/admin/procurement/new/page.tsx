import { UserRoleEnum } from "@/utils/constant"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { ProcurementForm } from "../_components/procurement-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"

export default async function NewProcurementPage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    return (
        <div className="space-y-6 pb-20">
            <VpPageHeader
                title="New Procurement Request"
                description="Raise a request, get boss approval, then invite vendors to submit quotes."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/admin/procurement">
                            <IconArrowLeft size={14} className="mr-1.5" />Back
                        </Link>
                    </Button>
                }
            />
            <ProcurementForm />
        </div>
    )
}