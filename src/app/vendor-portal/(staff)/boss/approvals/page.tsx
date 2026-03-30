// src/app/vendor-portal/(boss)/boss/approvals/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconCheckbox, IconRefresh,
    IconCheck, IconX,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { getVpPurchaseOrders, VpPoRow } from "@/actions/vp/purchase-order.action"
import { getVpProformaInvoices, VpPiRow } from "@/actions/vp/proforma-invoice.action"
import {
    getVpInvoices, approveVpInvoice, rejectVpInvoice, VpInvoiceRow,
} from "@/actions/vp/invoice.action"
import { getVpProcurements, VpProcurementRow } from "@/actions/vp/procurement.action"

export default function BossApprovalsPage() {
    const [pos, setPos] = useState<VpPoRow[]>([])
    const [pis, setPis] = useState<VpPiRow[]>([])
    const [invoices, setInvoices] = useState<VpInvoiceRow[]>([])
    const [prs, setPrs] = useState<VpProcurementRow[]>([])
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [rejectTarget, setRejectTarget] = useState<string | null>(null)
    const [rejectReason, setRejectReason] = useState("")
    const [selected, setSelected] = useState<string[]>([])

    const load = useCallback(async () => {
        setLoading(true)
        const [poRes, piRes, invRes, prRes] = await Promise.all([
            getVpPurchaseOrders({ status: "SUBMITTED", per_page: 50 }),
            getVpProformaInvoices({ status: "SUBMITTED", per_page: 50 }),
            getVpInvoices({ status: "UNDER_REVIEW", per_page: 50 }),
            getVpProcurements({ status: "SUBMITTED", per_page: 50 }),
        ])
        if (poRes.success) setPos(poRes.data.data)
        if (piRes.success) setPis(piRes.data.data)
        if (invRes.success) setInvoices(invRes.data.data)
        if (prRes.success) setPrs(prRes.data.data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [])

    const handleApproveInvoice = (id: string) =>
        startTransition(async () => {
            const res = await approveVpInvoice(id)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Invoice approved")
            load()
        })

    const handleRejectInvoice = () => {
        if (!rejectTarget) return
        startTransition(async () => {
            const res = await rejectVpInvoice(rejectTarget, rejectReason)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Invoice rejected")
            setRejectTarget(null)
            setRejectReason("")
            load()
        })
    }

    const totalPending = pos.length + pis.length + invoices.length + prs.length

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Approval Queue"
                description={`${totalPending} item${totalPending !== 1 ? "s" : ""} awaiting review`}
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />

            <Tabs defaultValue="invoice" >
                <TabsList>

                    <TabsTrigger value="po">
                        POs
                        {pos.length > 0 && <Badge className="ml-2 h-5 min-w-5 px-1.5 text-[10px]">{pos.length}</Badge>}
                    </TabsTrigger>

                    <TabsTrigger value="invoice">
                        Vendor Bills
                        {invoices.length > 0 && <Badge className="ml-2 h-5 min-w-5 px-1.5 text-[10px]">{invoices.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="pi">
                        Proforma Invoices
                        {pis.length > 0 && <Badge className="ml-2 h-5 min-w-5 px-1.5 text-[10px]">{pis.length}</Badge>}
                    </TabsTrigger>
                    <TabsTrigger value="pr">
                        Procurements
                        {prs.length > 0 && <Badge className="ml-2 h-5 min-w-5 px-1.5 text-[10px]">{prs.length}</Badge>}
                    </TabsTrigger>
                </TabsList>

                {/* ── Procurement tab ── */}
                <TabsContent value="pr" className="mt-4">
                    {loading ? <LoadingSkeleton /> : prs.length === 0 ? (
                        <VpEmptyState icon={IconCheckbox} title="No procurements pending approval" />
                    ) : (
                        <GenericApprovalTable
                            rows={prs.map((pr) => ({
                                id: pr.id, number: pr.prNumber, vendor: `${pr._count.vendorInvites} Invited`,
                                category: pr.categoryName, amount: pr.grandTotal,
                                submitted: pr.createdAt, createdBy: pr.createdBy.name,
                                href: `/vendor-portal/admin/procurement/${pr.id}`,
                            }))}
                        />
                    )}
                </TabsContent>

                {/* ── PO tab ── */}
                <TabsContent value="po" className="mt-4">
                    {loading ? <LoadingSkeleton /> : pos.length === 0 ? (
                        <VpEmptyState icon={IconCheckbox} title="No POs pending approval" />
                    ) : (
                        <GenericApprovalTable
                            rows={pos.map((po) => ({
                                id: po.id, number: po.poNumber, vendor: po.vendor.vendorName,
                                category: po.categoryName, amount: po.grandTotal,
                                submitted: po.submittedAt, createdBy: po.createdBy.name,
                                href: `/vendor-portal/admin/purchase-orders/${po.id}`,
                            }))}
                        />
                    )}
                </TabsContent>

                {/* ── PI tab ── */}
                <TabsContent value="pi" className="mt-4">
                    {loading ? <LoadingSkeleton /> : pis.length === 0 ? (
                        <VpEmptyState icon={IconCheckbox} title="No proforma invoices pending approval" />
                    ) : (
                        <GenericApprovalTable
                            rows={pis.map((pi) => ({
                                id: pi.id, number: pi.piNumber, vendor: pi.vendor.vendorName,
                                category: pi.categoryName, amount: pi.grandTotal,
                                submitted: pi.submittedAt, createdBy: pi.createdBy.name,
                                href: `/vendor-portal/admin/proforma-invoices/${pi.id}`,
                            }))}
                        />
                    )}
                </TabsContent>

                {/* ── Invoice tab ── */}
                <TabsContent value="invoice" className="mt-4">
                    {loading ? <LoadingSkeleton /> : invoices.length === 0 ? (
                        <VpEmptyState icon={IconCheckbox} title="No vendor bills under review" />
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice No.</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Docs</TableHead>
                                        <TableHead className="w-44" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {invoices.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/vendor-portal/boss/approvals/invoice/${inv.id}`}
                                                    className="font-mono text-sm font-semibold hover:underline"
                                                >
                                                    {inv.invoiceNumber ?? "—"}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-sm">{inv.vendor.vendorName}</TableCell>
                                            <TableCell>
                                                {inv.poNumber
                                                    ? <Badge variant="outline" className="text-xs">PO: {inv.poNumber}</Badge>
                                                    : inv.piNumber
                                                        ? <Badge variant="outline" className="text-xs">PI: {inv.piNumber}</Badge>
                                                        : <span className="text-xs text-muted-foreground">Open</span>
                                                }
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                ₹{inv.totalAmount.toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {inv.submittedAt
                                                    ? new Date(inv.submittedAt).toLocaleDateString("en-IN")
                                                    : "—"
                                                }
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">{inv.type}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-1.5">
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="text-emerald-600 hover:text-emerald-700 border-emerald-200"
                                                        onClick={() => handleApproveInvoice(inv.id)}
                                                        disabled={isPending}
                                                    >
                                                        <IconCheck size={14} className="mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="text-destructive hover:text-destructive border-red-200"
                                                        onClick={() => { setRejectTarget(inv.id); setRejectReason("") }}
                                                    >
                                                        <IconX size={14} className="mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </TabsContent>
            </Tabs>

            {/* Reject dialog */}
            <Dialog
                open={!!rejectTarget}
                onOpenChange={(v) => { if (!v) { setRejectTarget(null); setRejectReason("") } }}
            >
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle>Reject Invoice</DialogTitle>
                    </DialogHeader>
                    <Textarea
                        placeholder="Reason for rejection (required)…"
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                    <DialogFooter className="gap-2">
                        <Button variant="secondary" onClick={() => setRejectTarget(null)}>Cancel</Button>
                        <Button
                            variant="destructive"
                            disabled={!rejectReason.trim() || isPending}
                            onClick={handleRejectInvoice}
                        >
                            Confirm Reject
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}

function GenericApprovalTable({ rows }: {
    rows: {
        id: string
        number: string
        vendor: string
        category: string | null
        amount: number
        submitted: Date | null
        createdBy: string
        href: string
    }[]
}) {
    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Number</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Submitted</TableHead>
                        <TableHead>Created By</TableHead>
                        <TableHead className="w-28" />
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell className="font-mono text-sm font-semibold">{row.number}</TableCell>
                            <TableCell className="text-sm">{row.vendor}</TableCell>
                            <TableCell>
                                {row.category
                                    ? <Badge variant="outline" className="text-xs">{row.category}</Badge>
                                    : <span className="text-xs text-muted-foreground">—</span>
                                }
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                ₹{row.amount.toLocaleString("en-IN")}
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                                {row.submitted ? new Date(row.submitted).toLocaleDateString("en-IN") : "—"}
                            </TableCell>
                            <TableCell className="text-sm">{row.createdBy}</TableCell>
                            <TableCell>
                                <Button size="sm" asChild>
                                    <Link href={row.href}>Review</Link>
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

function LoadingSkeleton() {
    return (
        <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
    )
}