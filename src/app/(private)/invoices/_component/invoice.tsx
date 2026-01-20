"use client"

import React, { useEffect, useState } from "react"
import { LRTable } from "./lr-table"
import { formatAddress, formatCurrency } from "@/utils/calculations"
import { amountToWords } from "@/utils/amountToWords"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { toast } from "sonner"
import { updateTaxRateForInvoice } from "../_action/invoice"
import { Badge } from "@/components/ui/badge"
import { useInvoiceStore } from "@/components/modules/invoice-context"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import Link from "next/link"
import { Link2 } from "lucide-react"
import { WorkflowStatusBadge } from "@/components/modules/workflow/workflow-status-badge"
import { useSession } from "@/lib/auth-client"

export const Invoice = ({ data }: { data: any }) => {
  const {
    lrItems,
    taxRate,
    subTotal,
    totalExtra,
    taxAmount,
    grandTotal,
    setLRItems,
    setTaxRate,
    reset,
  } = useInvoiceStore()

  const { data: session } = useSession()
  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLRItems(data.LRRequest)
    setTaxRate(data.taxRate)
    return () => reset()
  }, [data, setLRItems, setTaxRate, reset])

  return (
    <>
      <div className="p-8 mt-6 rounded-lg max-w-9xl mx-auto border border-border bg-card print:shadow-none print:border-0 print:p-0">

        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-x-6">
              BCN{" "}
              <WorkflowStatusBadge 
                status={data.status} 
                type="invoice" 
                role={session?.user?.role} 
              />
            </h1>

            <div className="text-muted-foreground mt-1">
              Reference No: {data.refernceNumber}
            </div>

            <p className="text-muted-foreground">
              Date: {new Date(data.invoiceDate).toLocaleDateString()}
            </p>
          </div>

          <div className="text-right">
            <h2 className="text-lg font-semibold text-foreground">
              {data.vendor.name}
            </h2>
            <p className="text-sm text-muted-foreground max-w-[20rem]">
              {formatAddress(data.vendor.Address[0])}
            </p>
          </div>
        </header>

        {/* MAIN DETAILS */}
        <section className="grid grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">
            <div className="overflow-x-auto w-full">
              <h3 className="font-semibold text-foreground border-b border-border pb-1">
                Vendor
              </h3>

              <table className="w-full text-sm">
                <tbody>
                  <tr className="even:bg-muted">
                    <td className="px-4 py-2 font-medium text-foreground">
                      Invoice Number
                    </td>
                    <td className="px-4 py-2 text-foreground">
                      {data.invoiceNumber && data.invoiceURI ? (
                        <Link
                          target="_blank"
                          href={data?.invoiceURI}
                          className="flex items-center gap-x-2 text-primary"
                        >
                          <span>{data?.invoiceNumber}</span>
                          <Link2 className="w-4 h-4 rotate-125" />
                        </Link>
                      ) : (
                        "NA"
                      )}
                    </td>
                  </tr>

                  <tr className="even:bg-muted">
                    <td className="px-4 py-2 font-medium text-foreground">PAN No.</td>
                    <td className="px-4 py-2 text-foreground">
                      {data.vendor?.panNumber || "NA"}
                    </td>
                  </tr>

                  <tr className="even:bg-muted">
                    <td className="px-4 py-2 font-medium text-foreground">GSTIN</td>
                    <td className="px-4 py-2 text-foreground">
                      {data.vendor?.gstNumber || "NA"}
                    </td>
                  </tr>

                  <tr className="even:bg-muted">
                    <td className="px-4 py-2 font-medium text-foreground">Phone</td>
                    <td className="px-4 py-2 text-foreground">
                      {data.vendor?.contactPhone?.trim() || "NA"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-4">
            <div className="overflow-x-auto w-full">
              <h3 className="font-semibold text-foreground border-b border-border pb-1">
                Bill To
              </h3>

              <table className="w-full text-sm">
                <tbody>
                  <tr className="even:bg-muted">
                    <td className="px-4 py-2 text-foreground">
                      {data.billTo || "-"}
                    </td>
                  </tr>
                  <tr className="even:bg-muted">
                    <td className="px-4 py-2 text-foreground">
                      GSTIN: {data.billToGstin || "-"}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* LR TABLE */}
        <div className="mt-8">
          <LRTable lrs={lrItems as any} status={data.status} />
        </div>

        {/* AMOUNT & SUMMARY */}
        <section className="mt-8 flex justify-between items-start">
          {/* AMOUNT IN WORDS */}
          <div className="w-1/2">
            <h4 className="font-semibold text-foreground mb-2">Amount in Words</h4>

            <blockquote className="italic text-muted-foreground text-md border-l-4 border-border pl-3">
              {amountToWords(grandTotal)}
            </blockquote>

            {data.status !== "SENT" && (
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  setLoader(true)

                  const input = e.currentTarget.querySelector<HTMLInputElement>(
                    `#${data.id}-target`
                  )
                  if (!input) return

                  const newTaxRate = parseFloat(input.value)
                  if (isNaN(newTaxRate)) return

                  const { message, sucess } = await updateTaxRateForInvoice(
                    data.id,
                    newTaxRate
                  )

                  setLoader(false)
                  sucess ? setTaxRate(newTaxRate) : null
                  sucess ? toast.success(message) : toast.error(message)
                }}
                className="flex w-full max-w-sm items-center gap-3 mt-6"
              >
                <Label htmlFor={`${data.id}-target`} className="font-semibold">
                  Tax (%):
                </Label>

                {loader ? (
                  <Spinner />
                ) : (
                  <Input
                    className="h-8 w-20 border border-input bg-background shadow-none"
                    defaultValue={taxRate}
                    id={`${data.id}-target`}
                    type="number"
                    step="0.01"
                    min={0}
                    max={40}
                  />
                )}
              </form>
            )}
          </div>

          {/* PRICE SUMMARY */}
          <div className="w-1/3 bg-muted p-4 rounded-md text-sm">
            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatCurrency(subTotal)}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">Total Extra</span>
              <span className="text-foreground">{formatCurrency(totalExtra)}</span>
            </div>

            <div className="flex justify-between mb-1">
              <span className="text-muted-foreground">
                Tax ({data.taxRate || 0}%)
              </span>
              <span className="text-foreground">{formatCurrency(taxAmount)}</span>
            </div>

            <Separator className="my-2" />

            <div className="flex justify-between font-bold text-foreground">
              <span>Grand Total</span>
              <span>{formatCurrency(subTotal + totalExtra + taxAmount)}</span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t border-border pt-4 text-sm text-muted-foreground text-center">
          <p>
            This is a computer-generated Booking Cover Note and does not require a
            physical signature.
          </p>
          <p>Thank you for your business!</p>
        </footer>

        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              .print\\:shadow-none,
              .print\\:shadow-none * {
                visibility: visible;
              }
              .print\\:shadow-none {
                position: absolute;
                left: 0;
                top: 0;
              }
            }
        `}
        </style>
      </div>
    </>
  )
}
