

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
import { IconLink } from "@tabler/icons-react"
import { Link2 } from "lucide-react"

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


  const [loader, setLoader] = useState(false)

  useEffect(() => {
    setLRItems(data.LRRequest)
    setTaxRate(data.taxRate)
    return () => reset()
  }, [data, setLRItems, setTaxRate, reset])



  return (
    <>
      <div className="p-8 mt-6 rounded-lg max-w-9xl mx-auto border border-gray-200 print:shadow-none print:border-0 print:p-0">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-x-6">BCN <Badge className=" bg-gray-100 text-blue-700 font-medium shadow-xs">      {data.status}</Badge></h1>
            <div className="text-gray-500 mt-1 flex">Refernce No: {data.refernceNumber} </div>
            <p className="text-gray-500">Date: {new Date(data.createdAt).toLocaleDateString()} </p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-800">{data.vendor.name}</h2>
            <p className="text-[13px] text-gray-500 max-w-[20rem]">{formatAddress(data.vendor.Address[0])}</p>
          </div>
        </header>


        <section className="grid grid-cols-2 gap-6 mt-6">
          <div className="space-y-4">

            <div className="overflow-x-auto w-full">
              <h3 className="font-semibold text-gray-800 border-b pb-1 ">Vendor</h3>

              <table className="w-full  text-sm">
                <tbody>
                  <tr className="even:bg-gray-50">
                    <td className="  px-4 py-2 font-medium text-gray-700">Invoice Number</td>
                    <td className="  px-4 py-2 text-gray-900">
                      {(data.invoiceNumber && data.invoiceURI) ? (
                        <Link target="_blank" href={data?.invoiceURI} className=" flex items-center gap-x-6"><span>
                      {data?.invoiceNumber || ""}     </span> <Link2 className=" w-4 h-4 rotate-125 text-primary" /> </Link>
                      )
                        :
                        ("NA")
                      }

                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="  px-4 py-2 font-medium text-gray-700">PAN No.</td>
                    <td className="  px-4 py-2 text-gray-900">
                      {data.vendor?.panNumber || "NA"}
                    </td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className="  px-4 py-2 font-medium text-gray-700">GSTIN</td>
                    <td className="  px-4 py-2 text-gray-900">
                      {data.vendor?.gstNumber || "NA"}
                    </td>
                  </tr>

                  <tr className="even:bg-gray-50">
                    <td className="  px-4 py-2 font-medium text-gray-700">Phone</td>
                    <td className="  px-4 py-2 text-gray-900">
                      {data.vendor?.contactPhone?.trim() || "NA"}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>


          <div className="space-y-4">


            <div className="overflow-x-auto w-full">
              <h3 className="font-semibold text-gray-800 border-b pb-1 ">Bill To</h3>

              <table className="w-full   text-sm">
                <tbody>
                  <tr className="even:bg-gray-50">
                    <td className="  px-4 py-2 text-gray-900">{data.billTo || "-"}</td>
                  </tr>
                  <tr className="even:bg-gray-50">
                    <td className=" px-4 py-2 text-gray-900">GSTIN: {data.billToGstin || "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </section>

        {/* LR DETAILS */}
        <div className="mt-8">
          <LRTable lrs={lrItems as any} status={data.status} />
        </div>
        <section className="mt-8 flex justify-between items-start">
          <div className="w-1/2">
            <h4 className="font-semibold text-gray-800 mb-2">Amount in Words</h4>
            <blockquote className="italic text-gray-700 text-md border-l-4 border-gray-300 pl-3">
              {amountToWords(grandTotal)}
            </blockquote>
            {data.status !== "SENT" && <form
              onSubmit={async (e) => {
                e.preventDefault()

                setLoader(true)
                // Get the input value
                const input = e.currentTarget.querySelector<HTMLInputElement>(
                  `#${data.id}-target`
                )
                if (!input) return

                const newTaxRate = parseFloat(input.value)
                if (isNaN(newTaxRate)) {
                  console.error("Invalid tax rate")
                  return
                }

                const { message, sucess } = await updateTaxRateForInvoice(data.id, newTaxRate)
                if (sucess) {
                  setLoader(false)

                  setTaxRate(newTaxRate)
                  toast.success(message)
                } else {
                  setLoader(false)
                  toast.error(message)

                }
              }}

              className="flex w-full max-w-sm items-center gap-3 mt-6"

            // onSubmit={handleTaxUpdate}
            >
              <Label htmlFor={`${data.id}-target`} className="font-semibold">
                Tax (%):
              </Label>
              {loader ? <Spinner /> :

                <Input
                  className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-20 border bg-transparent t shadow-none focus-visible:border dark:bg-transparent"
                  defaultValue={taxRate}
                  id={`${data.id}-target`}
                  type="number"
                  step="0.01"
                  min={0}
                  max={40}
                />}

            </form>
            }
          </div>

          <div className="w-1/3 bg-gray-50 p-4 rounded-md  text-sm">
            <div className="flex justify-between mb-1">
              <span>Subtotal</span>
              <span>{formatCurrency(subTotal)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Total Extra</span>
              <span>{formatCurrency(totalExtra)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax ({data.taxRate || 0}%)</span>
              <span>{formatCurrency(taxAmount)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-gray-800">
              <span>Grand Total</span>
              <span>{formatCurrency(subTotal + totalExtra + taxAmount)}</span>
            </div>


          </div>
        </section>
        {/* FOOTER */}
        <footer className="mt-10 border-t pt-4 text-sm text-gray-500 text-center">
          <p>This is a computer-generated Booking Cover Note and does not require a physical signature.</p>
          <p>Thank you for your business!</p>
        </footer>


        <style>{`
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
      `}</style>
      </div>
    </>
  )
}
