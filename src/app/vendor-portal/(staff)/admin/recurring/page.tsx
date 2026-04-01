"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { IconRefresh, IconRepeat } from "@tabler/icons-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  getAllRecurringInvoices,
  VpRecurringInvoiceRow,
} from "@/actions/vp/recurring.action"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"

type PaymentFilter = "ALL" | VpRecurringInvoiceRow["paymentState"]

function PaymentBadge({
  paymentState,
  isOverdue,
}: Pick<VpRecurringInvoiceRow, "paymentState" | "isOverdue">) {
  if (isOverdue) {
    return <Badge className="border-red-200 bg-red-100 text-red-700">Overdue</Badge>
  }

  if (paymentState === "PAID") {
    return <Badge className="border-emerald-200 bg-emerald-100 text-emerald-700">Paid</Badge>
  }

  if (paymentState === "IN_PROGRESS") {
    return <Badge className="border-blue-200 bg-blue-100 text-blue-700">In Process</Badge>
  }

  return <Badge variant="outline">Unpaid</Badge>
}

export default function AdminRecurringPage() {
  const [invoices, setInvoices] = useState<VpRecurringInvoiceRow[]>([])
  const [loading, setLoading] = useState(true)
  const [cycleFilter, setCycleFilter] = useState("ALL")
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>("ALL")

  const load = useCallback(async () => {
    setLoading(true)
    const res = await getAllRecurringInvoices()
    if (!res.success) {
      toast.error(res.error)
      setLoading(false)
      return
    }

    setInvoices(res.data)
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesCycle = cycleFilter === "ALL" || invoice.recurringCycle === cycleFilter
    const matchesPayment = paymentFilter === "ALL" || invoice.paymentState === paymentFilter
    return matchesCycle && matchesPayment
  })

  const paidCount = filteredInvoices.filter((invoice) => invoice.paymentState === "PAID").length
  const unpaidCount = filteredInvoices.filter((invoice) => invoice.paymentState === "UNPAID").length
  const overdueCount = filteredInvoices.filter((invoice) => invoice.isOverdue).length

  return (
    <div className="space-y-6">
      <VpPageHeader
        title="Recurring Bills"
        description={`${filteredInvoices.length} recurring invoice${filteredInvoices.length !== 1 ? "s" : ""}`}
        actions={
          <div className="flex items-center gap-2">
            <Select value={cycleFilter} onValueChange={setCycleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Frequencies" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Frequencies</SelectItem>
                <SelectItem value="MONTHLY">Monthly</SelectItem>
                <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                <SelectItem value="YEARLY">Yearly</SelectItem>
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={(value) => setPaymentFilter(value as PaymentFilter)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All Payments" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Payments</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="IN_PROGRESS">In Process</SelectItem>
                <SelectItem value="UNPAID">Unpaid</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" size="sm" onClick={load} disabled={loading}>
              <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
            </Button>
          </div>
        }
      />

      {!loading && (
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{paidCount} paid</Badge>
          <Badge variant="outline">{unpaidCount} unpaid</Badge>
          <Badge variant="outline">{overdueCount} overdue</Badge>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-12 w-full" />
          ))}
        </div>
      ) : filteredInvoices.length === 0 ? (
        <VpEmptyState
          icon={IconRepeat}
          title="No recurring invoices"
          description="Only invoices raised with the recurring bill type appear here."
        />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Recurring</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Invoice Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead className="w-28">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <Link
                      href={`/vendor-portal/admin/invoices/${invoice.id}`}
                      className="font-mono text-sm font-medium hover:underline"
                    >
                      {invoice.invoiceNumber ?? "Draft Invoice"}
                    </Link>
                  </TableCell>
                  <TableCell className="text-sm">{invoice.vendorName}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {invoice.recurringCycle && (
                        <Badge variant="secondary" className="text-xs">
                          {VP_RECURRING_CYCLE_LABELS[invoice.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS] ?? invoice.recurringCycle}
                        </Badge>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {invoice.recurringTitle ?? "Vendor recurring invoice"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {format(new Date(invoice.createdAt), "d MMM yyyy")}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-sm">
                    ₹{invoice.totalAmount.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <VpStatusBadge status={invoice.status} />
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <PaymentBadge
                        paymentState={invoice.paymentState}
                        isOverdue={invoice.isOverdue}
                      />
                      {invoice.latestPaymentStatus && invoice.paymentState !== "PAID" && (
                        <p className="text-[11px] text-muted-foreground">
                          Payment: {invoice.latestPaymentStatus.replaceAll("_", " ")}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/vendor-portal/admin/invoices/${invoice.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
