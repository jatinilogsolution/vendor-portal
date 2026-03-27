// src/app/vendor-portal/(vendor)/vendor/my-invoices/new/page.tsx
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { InvoiceForm } from "../_components/invoice-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function NewVendorInvoicePage() {
    await requireVendorPortalSession([UserRoleEnum.VENDOR])
    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Submit Invoice"
                description="Create and submit an invoice for payment processing."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/vendor/my-invoices">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <InvoiceForm />
        </div>
    )
}