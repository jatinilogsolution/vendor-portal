// src/app/vendor-portal/(admin)/admin/purchase-orders/[id]/edit/page.tsx
import { notFound } from "next/navigation"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpPurchaseOrderById } from "@/actions/vp/purchase-order.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { PoForm } from "../../_components/po-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function EditPurchaseOrderPage({ params }: { params: Promise<{ id: string }> }) {

    const { id } = await params
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    const res = await getVpPurchaseOrderById(id)
    if (!res.success || res.data.status !== "DRAFT") notFound()

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={`Edit ${res.data.poNumber}`}
                description="Make changes to this draft purchase order."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/vendor-portal/admin/purchase-orders/${id}`}>
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <PoForm editing={res.data} />
        </div>
    )
}