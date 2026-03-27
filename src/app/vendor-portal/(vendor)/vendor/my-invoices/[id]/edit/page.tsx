// src/app/vendor-portal/(vendor)/vendor/my-invoices/[id]/edit/page.tsx
import { notFound } from "next/navigation"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpInvoiceById } from "@/actions/vp/invoice.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { InvoiceForm } from "../../_components/invoice-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function EditVendorInvoicePage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    await requireVendorPortalSession([UserRoleEnum.VENDOR])
    const { id } = await params
    const res = await getVpInvoiceById(id)
    if (!res.success || res.data.status !== "DRAFT") notFound()

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={`Edit Invoice ${res.data.invoiceNumber ?? ""}`}
                description="Update your draft invoice before submitting."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/vendor-portal/vendor/my-invoices/${id}`}>
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <InvoiceForm editing={res.data} />
        </div>
    )
}