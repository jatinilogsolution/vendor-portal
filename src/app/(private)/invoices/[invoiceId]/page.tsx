

"use client"

import { Invoice } from "../_component/invoice"
import { useParams } from "next/navigation"
import { InvoiceAddOnSheet } from "../_component/edit-sheet"
import { AddLrButtonToInvoice } from "../_component/add-lr-button"
import { useEffect, useState, useCallback } from "react"
import { ErrorCard } from "@/components/error"
import ScreenSkeleton from "@/components/modules/screen-skeleton"
import { Button } from "@/components/ui/button"
import { InvoiceFileUploadSingle } from "../_component/invoice-file-upload"
import { toast } from "sonner"
import { BackToPage } from "@/components/back-to-page"
import { Separator } from "@/components/ui/separator"
import { sendInvoiceById } from "../_action/invoice-list"
import { useInvoiceStore } from "@/components/modules/invoice-context"

const InvoiceIdPage = () => {
  const params = useParams<{ invoiceId: string }>()
  const invoiceId = params.invoiceId
  // const router = useRouter()

  const {
    taxRate,
    subTotal,
    totalExtra,
    taxAmount,
    grandTotal,
  } = useInvoiceStore()


  const [error, setError] = useState<string | null>(null)
  const [invoice, setInvoice] = useState<any>()
  const [loading, setLoading] = useState<boolean>(true)

  const fetchInvoice = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`/api/invoices/${invoiceId}`)

      const data = await res.json()

      if (data.error) {
        setError(data.error)
      } else {
        setInvoice(data)
      }
    } catch (err) {
      console.error(err)
      setError("Error fetching invoice")
    } finally {
      setLoading(false)
    }
  }, [invoiceId])

  useEffect(() => {
    if (!invoiceId) return
    fetchInvoice()
  }, [invoiceId, fetchInvoice])

  const handleSubmit = async () => {


    try {
      const sendPromise = await sendInvoiceById({
        invoiceId, taxRate,
        subTotal,
        totalExtra,
        taxAmount,
        grandTotal,
      })

      if (sendPromise.success) {
        toast.success(sendPromise.message)

        fetchInvoice()
      }

      // toast.promise(sendPromise, {
      //   loading: "Sending invoice...",
      //   success: (ctx) => {

      //     return ctx.message
      //   },
      //   finally: () =>
      //     fetchInvoice()


      // error: (err) => {err.message || "Error sending invoice ❌"},
      // })

    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    }



    // router.refresh()
  }
  if (error)
    return (
      <div className="p-8 w-full mt-6 flex items-center justify-center">
        <ErrorCard message={error} title="Something Went Wrong" />
      </div>
    )

  if (loading)
    return (
      <div className="p-8 w-full flex items-center justify-center">
        <ScreenSkeleton />
      </div>
    )



  return (
    <div className="relative">
      <div className="flex w-full  items-center justify-between  px-6">
        <h4 className="scroll-m-20 text-xl font-semibold tracking-tight flex gap-x-4 items-center">
          <BackToPage title="Back to Invoices" location="/invoices" /> <span>
            Booking Cover Note </span>
        </h4>
        {invoice.status !== "SENT" &&

          <div className=" flex justify-end gap-6 items-center">

            <InvoiceAddOnSheet fun={fetchInvoice} invoiceId={invoiceId} />

            <AddLrButtonToInvoice onClose={fetchInvoice} refernceNo={invoice.refernceNumber} vendorId={invoice.vendor.id} />

            <InvoiceFileUploadSingle referenceNumber={invoice.refernceNumber} invoiceId={invoice.id} invoiceNumber={invoice.invoiceNumber} initialFile={{
              fileUrl: invoice.invoiceURI,
              id: "1",
              name: "Invoice"
            }} />

            <Button onClick={handleSubmit}>Send Invoice</Button>
          </div>
        }
      </div>

      <Separator className="mt-3" />

      <Invoice data={invoice} />
    </div>
  )
}

export default InvoiceIdPage
