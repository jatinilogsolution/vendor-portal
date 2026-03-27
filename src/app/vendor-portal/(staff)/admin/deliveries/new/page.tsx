// src/app/vendor-portal/(admin)/admin/deliveries/new/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { DeliveryForm } from "../_components/delivery-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function NewDeliveryPage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Record Delivery"
                description="Log goods received against an acknowledged purchase order."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/admin/deliveries">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <DeliveryForm />
        </div>
    )
}