// src/app/vendor-portal/(boss)/boss/payments/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition, useRef } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { IconCash, IconRefresh, IconCheck, IconUpload, IconFile, IconX } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogFooter,
    DialogHeader, DialogTitle, DialogDescription,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { getVpInvoices, VpInvoiceRow } from "@/actions/vp/invoice.action"
import { getVpPayments, initiateVpPayment, confirmVpPayment, VpPaymentRow } from "@/actions/vp/payment.action"
import { vpPaymentSchema, VpPaymentFormValues } from "@/validations/vp/invoice"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpDateFilter } from "@/components/ui/vp-date-filter"
import { VpPagination } from "@/components/ui/vp-pagination"
import type { VpPaginationMeta } from "@/types/vendor-portal"
import { VpExportButton } from "@/components/ui/vp-export-button"
import { uploadAttachmentToAzure, deleteAttachmentFromAzure } from "@/services/azure-blob"



export default function BossPaymentsPage() {
    const [tab, setTab] = useState("pending")
    const [approved, setApproved] = useState<VpInvoiceRow[]>([])
    const [approvedMeta, setApprovedMeta] = useState<VpPaginationMeta | null>(null)
    const [payments, setPayments] = useState<VpPaymentRow[]>([])
    const [paymentsMeta, setPaymentsMeta] = useState<VpPaginationMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [isPending, startTransition] = useTransition()
    const [payTarget, setPayTarget] = useState<VpInvoiceRow | null>(null)
    const [confirmId, setConfirmId] = useState<string | null>(null)
    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [approvedPage, setApprovedPage] = useState(1)
    const [approvedPerPage, setApprovedPerPage] = useState(20)
    const [paymentsPage, setPaymentsPage] = useState(1)
    const [paymentsPerPage, setPaymentsPerPage] = useState(20)
    const fileRef = useRef<HTMLInputElement>(null)
    const [uploading, setUploading] = useState(false)


    const load = useCallback(async () => {
        setLoading(true)
        const [invRes, payRes] = await Promise.all([
            getVpInvoices({
                status: "APPROVED",
                from: from || undefined,
                to: to || undefined,
                page: approvedPage,
                per_page: approvedPerPage,
            }),
            getVpPayments({
                from: from || undefined,
                to: to || undefined,
                page: paymentsPage,
                per_page: paymentsPerPage,
            }),
        ])
        if (invRes.success) {
            setApproved(invRes.data.data)
            setApprovedMeta(invRes.data.meta)
        }
        if (payRes.success) {
            setPayments(payRes.data.data)
            setPaymentsMeta(payRes.data.meta)
        }
        setLoading(false)
    }, [approvedPage, approvedPerPage, from, paymentsPage, paymentsPerPage, to])

    useEffect(() => { load() }, [load])

    const form = useForm<VpPaymentFormValues>({
        resolver: zodResolver(vpPaymentSchema) as any,
        defaultValues: {
            amount: 0,
            paymentMode: "NEFT",  // must be exactly "NEFT" | "RTGS" | "CHEQUE" | "UPI"
            transactionRef: "",
            notes: "",
            paymentDate: new Date().toISOString().split("T")[0],
            proofUrl: "",
        },
    })

    // Prefill amount when target changes
    useEffect(() => {
        if (payTarget) form.setValue("amount", payTarget.totalAmount)
    }, [payTarget])

    const handleInitiate = (values: VpPaymentFormValues) => {
        if (!payTarget) return
        startTransition(async () => {
            const res = await initiateVpPayment(payTarget.id, values)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Payment initiated successfully")
            setPayTarget(null)
            form.reset()
            load()
        })
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        try {
            // Delete previously uploaded proof if any
            const prevUrl = form.getValues("proofUrl")
            if (prevUrl) {
                await deleteAttachmentFromAzure(prevUrl)
            }

            const formData = new FormData()
            formData.append("file", file)
            const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
            const path = `vp/payments/${Date.now()}_${safeName}`
            const url = await uploadAttachmentToAzure(path, formData)
            form.setValue("proofUrl", url)
            toast.success("Payment proof uploaded")
        } catch (err) {
            console.error("Upload error:", err)
            toast.error("Failed to upload file")
        } finally {
            setUploading(false)
            if (fileRef.current) fileRef.current.value = ""
        }
    }


    const handleConfirm = (paymentId: string) =>
        startTransition(async () => {
            const res = await confirmVpPayment(paymentId)
            if (!res.success) { toast.error(res.error); return }
            toast.success("Payment confirmed")
            setConfirmId(null)
            load()
        })

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Payments"
                description="Initiate and track vendor payments."
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {tab === "pending" ? (
                            <VpExportButton
                                data={approved}
                                filename="awaiting-payments"
                                disabled={loading}
                                columns={[
                                    { header: "Invoice No.", accessor: (r) => r.invoiceNumber ?? "" },
                                    { header: "Vendor", accessor: (r) => r.vendor.vendorName },
                                    { header: "Amount", accessor: (r) => r.totalAmount },
                                    { header: "Status", accessor: (r) => r.status },
                                    {
                                        header: "Approved",
                                        accessor: (r) => r.approvedAt
                                            ? new Date(r.approvedAt).toLocaleDateString("en-IN")
                                            : "",
                                    },
                                ]}
                            />
                        ) : (
                            <VpExportButton
                                data={payments}
                                filename="payment-history"
                                disabled={loading}
                                columns={[
                                    { header: "Invoice No.", accessor: (r) => r.invoice.invoiceNumber ?? "" },
                                    { header: "Vendor", accessor: (r) => r.invoice.vendor.vendorName },
                                    { header: "Amount", accessor: (r) => r.amount },
                                    { header: "Mode", accessor: (r) => r.paymentMode ?? "" },
                                    { header: "Status", accessor: (r) => r.status },
                                    {
                                        header: "Payment Date",
                                        accessor: (r) => r.paymentDate
                                            ? new Date(r.paymentDate).toLocaleDateString("en-IN")
                                            : "",
                                    },
                                ]}
                            />
                        )}
                    </div>
                }
            />
            
            <div className=" absolute  right-10">

              <VpDateFilter
                from={from}
                to={to}
                onFrom={(v) => { setFrom(v); setApprovedPage(1); setPaymentsPage(1) }}
                onTo={(v) => { setTo(v); setApprovedPage(1); setPaymentsPage(1) }}
                onClear={() => { setFrom(""); setTo(""); setApprovedPage(1); setPaymentsPage(1) }}
            />
            </div>


            <Tabs value={tab} onValueChange={setTab}>
                <TabsList>
                    <TabsTrigger value="pending">
                        Awaiting Payment
                        {(approvedMeta?.total ?? approved.length) > 0 && (
                            <Badge className="ml-2 h-5 min-w-5 px-1.5 text-[10px]">
                                {approvedMeta?.total ?? approved.length}
                            </Badge>
                        )}
                    </TabsTrigger>
                    <TabsTrigger value="history">Payment History</TabsTrigger>

                </TabsList>


                {/* ── Approved invoices awaiting payment ── */}
                <TabsContent value="pending" className="mt-4">
                    {loading ? <LoadingSkeleton /> : approved.length === 0 ? (
                        <VpEmptyState icon={IconCash} title="No invoices awaiting payment" description="Approved invoices will appear here." />
                    ) : (
                        <div className="rounded-md border mb-4">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Invoice No.</TableHead>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Reference</TableHead>
                                        <TableHead>Delivery</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Approved</TableHead>
                                        <TableHead className="w-36" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {approved.map((inv) => (
                                        <TableRow key={inv.id}>
                                            <TableCell>
                                                <Link
                                                    href={`/vendor-portal/admin/invoices/${inv.id}`}
                                                    className="font-mono text-sm font-medium hover:underline"
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
                                            <TableCell>
                                                {inv.deliveryStatus
                                                    ? <VpStatusBadge status={inv.deliveryStatus} />
                                                    : <span className="text-xs text-muted-foreground">—</span>
                                                }
                                            </TableCell>
                                            <TableCell className="text-right font-bold text-sm">
                                                ₹{inv.totalAmount.toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {inv.approvedAt
                                                    ? new Date(inv.approvedAt).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    size="sm"
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                                                    onClick={() => setPayTarget(inv)}
                                                    disabled={!!inv.poId && !["PARTIAL_DELIVERY", "FULLY_DELIVERED", "APPROVED"].includes(inv.deliveryStatus ?? "")}
                                                >
                                                    <IconCash size={14} className="mr-1.5" />
                                                    {!!inv.poId && !["PARTIAL_DELIVERY", "FULLY_DELIVERED", "APPROVED"].includes(inv.deliveryStatus ?? "")
                                                        ? "Await Delivery"
                                                        : "Pay Now"}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {approvedMeta && (
                        <VpPagination
                            meta={approvedMeta}
                            onPage={setApprovedPage}
                            onPerPage={(v) => { setApprovedPerPage(v); setApprovedPage(1) }}
                        />
                    )}
                </TabsContent>

                {/* ── Payment history ── */}
                <TabsContent value="history" className="mt-4">
                    {loading ? <LoadingSkeleton /> : payments.length === 0 ? (
                        <VpEmptyState icon={IconCash} title="No payment history yet" />
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Vendor</TableHead>
                                        <TableHead>Invoice</TableHead>
                                        <TableHead className="text-right">Amount</TableHead>
                                        <TableHead>Mode</TableHead>
                                        <TableHead>Ref No.</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="w-32" />
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {payments.map((p) => (
                                        <TableRow key={p.id}>
                                            <TableCell className="text-sm font-medium">
                                                {p.invoice.vendor.vendorName}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    href={`/vendor-portal/admin/invoices/${p.invoice.id}`}
                                                    className="font-mono text-xs text-primary hover:underline"
                                                >
                                                    {p.invoice.invoiceNumber ?? "—"}
                                                </Link>
                                            </TableCell>
                                            <TableCell className="text-right font-semibold text-sm">
                                                ₹{p.amount.toLocaleString("en-IN")}
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant="secondary" className="text-xs">{p.paymentMode ?? "—"}</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <code className="text-xs">{p.transactionRef ?? "—"}</code>
                                                {p.notes && (
                                                    <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{p.notes}</p>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-xs text-muted-foreground">
                                                {p.paymentDate
                                                    ? new Date(p.paymentDate).toLocaleDateString("en-IN")
                                                    : "—"}
                                            </TableCell>
                                            <TableCell><VpStatusBadge status={p.status} /></TableCell>
                                            <TableCell>
                                                {p.status === "INITIATED" && (
                                                    <Button
                                                        size="sm" variant="outline"
                                                        className="text-emerald-600 hover:text-emerald-700"
                                                        onClick={() => setConfirmId(p.id)}
                                                        disabled={isPending}
                                                    >
                                                        <IconCheck size={14} className="mr-1" />
                                                        Confirm
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                    {paymentsMeta && (
                        <VpPagination
                            meta={paymentsMeta}
                            onPage={setPaymentsPage}
                            onPerPage={(v) => { setPaymentsPerPage(v); setPaymentsPage(1) }}
                        />
                    )}
                </TabsContent>
            </Tabs>

            {/* Payment initiation dialog */}
            <Dialog open={!!payTarget} onOpenChange={(v) => { if (!v) { setPayTarget(null); form.reset() } }}>
                <DialogContent className="min-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Initiate Payment</DialogTitle>
                        <DialogDescription>
                            {payTarget && (
                                <>
                                    Invoice <span className="font-mono font-semibold">{payTarget.invoiceNumber}</span>
                                    {" · "}<span className="font-semibold">{payTarget.vendor.vendorName}</span>
                                    {" · ₹"}{payTarget.totalAmount.toLocaleString("en-IN")}
                                </>
                            )}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleInitiate)} className="space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <FormField control={form.control} name="amount" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount (₹) <span className="text-destructive">*</span></FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min={1}
                                                step={0.01}
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(
                                                    e.target.value === ""
                                                        ? ""
                                                        : Number(e.target.value),
                                                )}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />

                                <FormField control={form.control} name="paymentMode" render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Mode <span className="text-destructive">*</span></FormLabel>
                                        <Select value={field.value} onValueChange={field.onChange}>
                                            <FormControl>
                                                <SelectTrigger className="w-full"><SelectValue /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="NEFT">NEFT (National Electronic Funds Transfer)</SelectItem>
                                                <SelectItem value="RTGS">RTGS (Real Time Gross Settlement)</SelectItem>
                                                <SelectItem value="CHEQUE">Cheque</SelectItem>
                                                <SelectItem value="UPI">UPI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>

                            <FormField control={form.control} name="paymentDate" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Date <span className="text-destructive">*</span></FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="transactionRef" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction / UTR</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g. UTR123456789" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="notes" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Payment Note</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            rows={3}
                                            placeholder="Optional note for admin, boss, and vendor context"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="proofUrl" render={({ field }) => (
                                <FormItem className="space-y-2">
                                    <FormLabel>Payment Proof (Optional)</FormLabel>
                                    {field.value ? (
                                        <div className="flex items-center gap-3 rounded-md border bg-muted/30 px-4 py-3">
                                            <IconFile size={18} className="shrink-0 text-muted-foreground" />
                                            <a
                                                href={field.value}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex-1 truncate text-sm text-primary hover:underline"
                                            >
                                                {field.value.split("/").pop()}
                                            </a>
                                            <Button
                                                type="button" variant="ghost" size="sm" className="h-7 gap-1"
                                                onClick={() => fileRef.current?.click()}
                                                title="Replace"
                                            >
                                                <IconRefresh size={13} /> Replace
                                            </Button>
                                            <Button
                                                type="button" variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10"
                                                onClick={async () => {
                                                    const url = field.value
                                                    if (url) await deleteAttachmentFromAzure(url)
                                                    field.onChange("")
                                                }}
                                            >
                                                <IconX size={13} />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed py-6 transition-colors hover:bg-muted/30"
                                            onClick={() => fileRef.current?.click()}
                                        >
                                            <IconUpload size={22} className="mb-2 text-muted-foreground" />
                                            <p className="text-sm font-medium">
                                                {uploading ? "Uploading…" : "Click to upload payment proof"}
                                            </p>
                                            <p className="mt-0.5 text-xs text-muted-foreground">
                                                Screenshot or PDF · max 10 MB
                                            </p>
                                        </div>
                                    )}
                                    <input
                                        ref={fileRef}
                                        type="file"
                                        accept=".pdf,.jpg,.jpeg,.png"
                                        className="hidden"
                                        onChange={handleFileUpload}
                                        disabled={uploading}
                                    />
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <DialogFooter className="gap-2 pt-2">
                                <Button type="button" variant="secondary" onClick={() => { setPayTarget(null); form.reset() }}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? "Processing…" : "Initiate Payment"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Confirm payment dialog */}
            <Dialog open={!!confirmId} onOpenChange={(v) => { if (!v) setConfirmId(null) }}>
                <DialogContent className="sm:max-w-sm">
                    <DialogHeader>
                        <DialogTitle>Confirm Payment Completed?</DialogTitle>
                        <DialogDescription>
                            This will mark the payment as COMPLETED and close the invoice.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="gap-2">
                        <Button variant="secondary" onClick={() => setConfirmId(null)}>Cancel</Button>
                        <Button
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                            disabled={isPending}
                            onClick={() => confirmId && handleConfirm(confirmId)}
                        >
                            {isPending ? "Confirming…" : "Confirm Completed"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
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
