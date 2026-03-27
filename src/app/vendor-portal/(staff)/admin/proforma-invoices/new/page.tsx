// src/app/vendor-portal/(admin)/admin/proforma-invoices/new/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { PiForm } from "../_components/pi-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function NewProformaInvoicePage() {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    return (
        <div className="space-y-6">
            <VpPageHeader
                title="New Proforma Invoice"
                description="Create a quote for a vendor and submit it for management approval."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/admin/proforma-invoices">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <PiForm />
        </div>
    )
}