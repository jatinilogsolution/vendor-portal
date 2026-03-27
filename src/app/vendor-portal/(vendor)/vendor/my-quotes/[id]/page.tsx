// src/app/(vendor)/vendor/my-quotes/[id]/page.tsx
"use client"

import { useEffect, useState, useTransition } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "sonner"
import { IconArrowLeft, IconArrowRight, IconSend } from "@tabler/icons-react"
import { Button }    from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton }  from "@/components/ui/skeleton"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { VpPageHeader }      from "@/components/ui/vp-page-header"
import { VpStatusBadge }     from "@/components/ui/vp-status-badge"
import { VpPiStatusStepper } from "@/components/ui/vp-pi-status-stepper"
import {
  getVpProformaInvoiceById,
  VpPiDetail,
} from "@/actions/vp/proforma-invoice.action"

export default function VendorQuoteDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id     = params.id as string

  const [pi, setPi]           = useState<VpPiDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [convertOpen, setConvertOpen] = useState(false)
  const [isPending, startTransition]  = useTransition()

  const load = async () => {
    setLoading(true)
    const res = await getVpProformaInvoiceById(id)
    if (!res.success) { toast.error(res.error); setLoading(false); return }
    setPi(res.data)
    setLoading(false)
  }

  useEffect(() => { load() }, [id])

  // Vendor can request conversion to PO by submitting a regular invoice
  // referencing this PI — the actual PO conversion is done by admin
  const handleRaiseInvoice = () => {
    router.push(`/vendor-portal/vendor/my-invoices/new?piId=${id}`)
  }

  if (loading) return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-72" />
      <Skeleton className="h-32 w-full" />
    </div>
  )
  if (!pi) return (
    <p className="py-20 text-center text-muted-foreground">Quote not found.</p>
  )

  // Vendor can raise an invoice if their quote was ACCEPTED
  const canRaiseInvoice = pi.status === "ACCEPTED"

  return (
    <div className="space-y-6">
      <VpPageHeader
        title={pi.piNumber}
        description={`Submitted ${pi.submittedAt
          ? new Date(pi.submittedAt).toLocaleDateString("en-IN")
          : "—"}`}
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href="/vendor-portal/vendor/my-quotes">
                <IconArrowLeft size={14} className="mr-1.5" />
                Back
              </Link>
            </Button>
            {canRaiseInvoice && (
              <Button
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700 text-white"
                onClick={handleRaiseInvoice}
              >
                <IconSend size={14} className="mr-1.5" />
                Raise Invoice Against This Quote
              </Button>
            )}
          </div>
        }
      />

      {/* Status stepper */}
      <div className="overflow-x-auto rounded-md border bg-muted/20 px-4 py-4">
        <VpPiStatusStepper status={pi.status} />
        {pi.status === "ACCEPTED" && (
          <p className="mt-3 text-sm text-emerald-600 font-medium">
            ✅ Your quote has been accepted. You can now raise an invoice.
          </p>
        )}
        {pi.status === "DECLINED" && (
          <p className="mt-3 text-sm text-orange-600 font-medium">
            Your quote was declined. You may submit a revised quote if needed.
          </p>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Meta */}
        <div className="space-y-4 lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Quote Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2.5 text-sm">
              <Row label="Status">  <VpStatusBadge status={pi.status} /></Row>
              <Row label="Valid Until">
                {pi.validityDate
                  ? new Date(pi.validityDate).toLocaleDateString("en-IN")
                  : "—"}
              </Row>
              {(pi as any).fulfillmentDate && (
                <Row label="Fulfillment">
                  {new Date((pi as any).fulfillmentDate).toLocaleDateString("en-IN")}
                </Row>
              )}
              {pi.paymentTerms && <Row label="Payment Terms">{pi.paymentTerms}</Row>}
              {pi.notes && (
                <>
                  <Separator />
                  <p className="text-xs text-muted-foreground">{pi.notes}</p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Financials</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <Row label="Subtotal">₹{pi.subtotal.toLocaleString("en-IN")}</Row>
              <Row label={`GST (${pi.taxRate}%)`}>₹{pi.taxAmount.toLocaleString("en-IN")}</Row>
              <Separator />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>₹{pi.grandTotal.toLocaleString("en-IN")}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Line items */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Your Quoted Items ({pi.items.length})</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b bg-muted/30">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">Description</th>
                    <th className="px-4 py-2 text-right font-medium">Qty</th>
                    <th className="px-4 py-2 text-right font-medium">Your Price</th>
                    <th className="px-4 py-2 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {pi.items.map((item, index) => (
                    <tr key={item.description + index}>
                      <td className="px-4 py-2.5 font-medium">{item.description}</td>
                      <td className="px-4 py-2.5 text-right">{item.qty}</td>
                      <td className="px-4 py-2.5 text-right">
                        ₹{item.unitPrice.toLocaleString("en-IN")}
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold">
                        ₹{item.total.toLocaleString("en-IN")}
                      </td>
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