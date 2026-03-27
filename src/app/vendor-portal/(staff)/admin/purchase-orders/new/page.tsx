// src/app/vendor-portal/(admin)/admin/purchase-orders/new/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { PoForm } from "../_components/po-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function NewPurchaseOrderPage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    return (
        <div className="space-y-6">
            <VpPageHeader
                title="New Purchase Order"
                description="Create a purchase order and submit it for management approval."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/admin/purchase-orders">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <PoForm />
        </div>
    )
}