import { notFound } from "next/navigation"
import Link from "next/link"
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard"
import { UserRoleEnum } from "@/utils/constant"
import { getVpReturnById } from "@/actions/vp/return.action"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { IconArrowLeft } from "@tabler/icons-react"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VendorReturnScheduleCard } from "./_components/vendor-return-schedule-card"

export default async function VendorReturnDetailPage({ params }: { params: Promise<{ id: string }> }) {
    await requireVendorPortalSession([UserRoleEnum.VENDOR])
    const { id } = await params
    const result = await getVpReturnById(id)
    if (!result.success) notFound()

    const returnRecord = result.data

    return (
        <div className="space-y-6">
            <VpPageHeader
                title={`Return — ${returnRecord.invoice?.invoiceNumber ?? returnRecord.vendor.name}`}
                description={`${returnRecord.expectedPickupDate
                    ? new Date(returnRecord.expectedPickupDate).toLocaleDateString("en-IN")
                    : "Date not set"} · ${returnRecord.status.replaceAll("_", " ")}`}
                actions={
                    <Button variant="outline" size="sm" asChild>
                        <Link href="/vendor-portal/vendor/my-returns">
                            <IconArrowLeft size={14} className="mr-1.5" />
                            Back
                        </Link>
                    </Button>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-4 lg:col-span-1">
                    <Card>
                        <CardHeader className="pb-3"><CardTitle className="text-sm">Pickup Details</CardTitle></CardHeader>
                        <CardContent className="space-y-2.5 text-sm">
                            <Row label="Status"><VpStatusBadge status={returnRecord.status} /></Row>
                            <Row label="Vendor">{returnRecord.vendor.name}</Row>
                            <Row label="Invoice">
                                {returnRecord.invoice ? (
                                    <Link
                                        href={`/vendor-portal/vendor/my-invoices/${returnRecord.invoice.id}`}
                                        className="font-mono text-xs text-primary hover:underline"
                                    >
                                        {returnRecord.invoice.invoiceNumber ?? returnRecord.invoice.id}
                                    </Link>
                                ) : "—"}
                            </Row>
                            <Row label="Invoice Status">
                                {returnRecord.invoiceStatus ? <VpStatusBadge status={returnRecord.invoiceStatus} /> : "—"}
                            </Row>
                            <Row label="Invoice Amount">
                                {typeof returnRecord.invoiceTotalAmount === "number"
                                    ? `₹${returnRecord.invoiceTotalAmount.toLocaleString("en-IN")}`
                                    : "—"}
                            </Row>
                            <Row label="PO Reference">
                                {returnRecord.po ? (
                                    <Link
                                        href={`/vendor-portal/vendor/my-pos/${returnRecord.po.id}`}
                                        className="font-mono text-xs text-primary hover:underline"
                                    >
                                        {returnRecord.po.poNumber}
                                    </Link>
                                ) : "Not linked to an invoice PO"}
                            </Row>
                            <Row label="PO Status">
                                {returnRecord.po ? <VpStatusBadge status={returnRecord.po.status} /> : "Not linked"}
                            </Row>
                            <Row label="Pickup Date">
                                {returnRecord.expectedPickupDate
                                    ? new Date(returnRecord.expectedPickupDate).toLocaleDateString("en-IN")
                                    : "—"}
                            </Row>
                            <Row label="Pickup Person">{returnRecord.pickupPersonName ?? "—"}</Row>
                            <Row label="Pickup Contact">{returnRecord.pickupPersonPhone ?? "—"}</Row>
                            <Row label="Completed At">
                                {returnRecord.completedAt
                                    ? new Date(returnRecord.completedAt).toLocaleDateString("en-IN")
                                    : "—"}
                            </Row>
                            <Row label="Created By">{returnRecord.createdBy?.name ?? "—"}</Row>
                            {returnRecord.notes && (
                                <>
                                    <Separator />
                                    <p className="text-xs text-muted-foreground">{returnRecord.notes}</p>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    <VendorReturnScheduleCard
                        returnId={returnRecord.id}
                        status={returnRecord.status}
                        expectedPickupDate={returnRecord.expectedPickupDate}
                        pickupPersonName={returnRecord.pickupPersonName}
                        pickupPersonPhone={returnRecord.pickupPersonPhone}
                        notes={returnRecord.notes}
                    />

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Invoice Documents ({returnRecord.documents.length})</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            {returnRecord.documents.length === 0 ? (
                                <p className="text-xs text-muted-foreground">No invoice documents linked to this return.</p>
                            ) : returnRecord.documents.map((document) => (
                                <a
                                    key={document.id}
                                    href={document.filePath}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block rounded-md border px-3 py-2 text-xs hover:bg-muted/40"
                                >
                                    <p className="truncate font-medium">
                                        {document.filePath.split("/").pop()}
                                    </p>
                                    <p className="text-muted-foreground">
                                        {new Date(document.uploadedAt).toLocaleDateString("en-IN")}
                                    </p>
                                </a>
                            ))}
                        </CardContent>
                    </Card>
                </div>

                <Card className="lg:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-sm">Items to Return ({returnRecord.items.length})</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="border-b bg-muted/30">
                                    <tr>
                                        <th className="px-4 py-2 text-left font-medium">Description</th>
                                        <th className="px-4 py-2 text-left font-medium">Item</th>
                                        <th className="px-4 py-2 text-right font-medium">Qty</th>
                                        <th className="px-4 py-2 text-left font-medium">Reason</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y">
                                    {returnRecord.items.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-3">
                                                <p className="font-medium">{item.description}</p>
                                                {item.invoiceLineDescription && (
                                                    <p className="text-xs text-muted-foreground">
                                                        Invoice row: {item.invoiceLineDescription}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3">
                                                <p>{item.itemName ?? "—"}</p>
                                                {(item.itemCode || item.itemId) && (
                                                    <p className="text-xs font-mono text-muted-foreground">
                                                        {[item.itemCode, item.itemId].filter(Boolean).join(" · ")}
                                                    </p>
                                                )}
                                            </td>
                                            <td className="px-4 py-3 text-right font-semibold">{item.qty}</td>
                                            <td className="px-4 py-3">{item.reason ?? "—"}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex items-start justify-between gap-2">
            <span className="shrink-0 text-muted-foreground">{label}</span>
            <span className="text-right">{children}</span>
        </div>
    )
}
