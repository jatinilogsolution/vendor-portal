import { notFound } from "next/navigation"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpProformaInvoiceById } from "@/actions/vp/proforma-invoice.action"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { PiForm } from "../../_components/pi-form"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { IconArrowLeft } from "@tabler/icons-react"

export default async function EditProformaInvoicePage({ params }: { params: Promise<{ id: string }> }) {
    await requireVendorPortalSession([UserRoleEnum.ADMIN, UserRoleEnum.BOSS])
    const { id } = (await params)
    const res = await getVpProformaInvoiceById(id)
    if (!res.success || res.data.status !== "DRAFT") notFound()

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={`Edit ${res.data.piNumber}`}
                description="Make changes to this draft proforma invoice."
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href={`/vendor-portal/admin/proforma-invoices/${id}`}>
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />
            <PiForm editing={res.data} />
        </div>
    )
}