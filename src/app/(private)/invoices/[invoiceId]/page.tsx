
"use client"

import { Invoice } from "../_component/invoice"
import { useParams, useRouter } from "next/navigation"
// import { InvoiceAddOnSheet } from "../_component/edit-sheet"
// import { AddLrButtonToInvoice } from "../_component/add-lr-button"
import { InvoiceManagement } from "../_component/invoice-management"
import { useEffect, useState, useCallback } from "react"
import { ErrorCard } from "@/components/error"
import ScreenSkeleton from "@/components/modules/screen-skeleton"
import { Button } from "@/components/ui/button"
// import { InvoiceFileUploadSingle } from "../_component/invoice-file-upload"
import { toast } from "sonner"
import { BackToPage } from "@/components/back-to-page"
import { Separator } from "@/components/ui/separator"
import { sendInvoiceById, withdrawInvoice, deleteInvoice, saveDraftInvoice } from "../_action/invoice-list"
import { useInvoiceStore } from "@/components/modules/invoice-context"
import Link from "next/link"
import { IconChartColumn, IconTrash, IconDeviceFloppy, IconSend, IconArrowBack } from "@tabler/icons-react"
import { UserRoleEnum } from "@/utils/constant"
import { useSession } from "@/lib/auth-client"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const InvoiceIdPage = () => {
  const params = useParams<{ invoiceId: string }>()
  const invoiceId = params.invoiceId
  const router = useRouter()

  const session = useSession()


  useEffect(() => {
    if (!session.data) {
      session.refetch()
    }
  }, [])
  const role = session.data?.user.role;
  const isAuthorized =
    role !== undefined &&
    role !== null &&
    [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(role as UserRoleEnum);

  const isTVendor = role === UserRoleEnum.TVENDOR;

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
  const [actionLoading, setActionLoading] = useState<boolean>(false)

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

  const handleSaveDraft = async () => {
    try {
      setActionLoading(true)
      const result = await saveDraftInvoice({
        invoiceId,
        taxRate,
        subTotal,
        totalExtra,
        taxAmount,
        grandTotal,
      })

      if (result.success) {
        toast.success(result.message)
        fetchInvoice()
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleSendInvoice = async () => {

    try {
      setActionLoading(true)
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


    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setActionLoading(false)
    }

  }

  const handleWithdraw = async () => {
    try {
      setActionLoading(true)
      const result = await withdrawInvoice(invoiceId)

      if (result.success) {
        toast.success(result.message)
        fetchInvoice()
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      setActionLoading(true)
      const result = await deleteInvoice(invoiceId)

      if (result.success) {
        toast.success(result.message)
        router.push("/invoices")
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setActionLoading(false)
    }
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

        {/* DRAFT Status - Show edit controls */}
        {invoice.status === "DRAFT" && isTVendor && (
          <div className=" flex justify-end gap-3 items-center">
            {/* Merged Invoice Management Component */}
            <InvoiceManagement
              invoiceId={invoiceId}
              referenceNumber={invoice.refernceNumber}
              invoiceNumber={invoice.invoiceNumber}
              initialFile={{
                fileUrl: invoice.invoiceURI,
                id: "1",
                name: "Invoice"
              }}
              initialInvoiceDate={invoice.invoiceDate.split("T")[0]}
              onUpdate={fetchInvoice}
            />

            {/* Commented out as per request */}
            {/* <AddLrButtonToInvoice onClose={fetchInvoice} refernceNo={invoice.refernceNumber} vendorId={invoice.vendor.id} /> */}

            {/* Save as Draft Button */}
            <Button
              onClick={handleSaveDraft}
              variant="outline"
              disabled={actionLoading}
            >
              <IconDeviceFloppy className="w-4 h-4 mr-2" />
              Save Draft
            </Button>

            {/* Send Invoice Button */}
            <Button
              onClick={handleSendInvoice}
              disabled={actionLoading}
            >
              <IconSend className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>

            {/* Delete moved to listing page */}
          </div>
        )}

        {/* SENT Status - Show withdraw and compare buttons */}
        {invoice.status === "SENT" && (
          <div className="flex justify-end gap-3 items-center">
            {/* Withdraw Button (only for TVENDOR) */}
            {isTVendor && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" disabled={actionLoading}>
                    <IconArrowBack className="w-4 h-4 mr-2" />
                    Withdraw
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Withdraw Invoice?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will change the invoice status back to DRAFT, allowing you to edit it again.
                      The invoice will need to be re-sent after making changes.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleWithdraw}>
                      Withdraw Invoice
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {/* Compare Button (for admins) */}
            {isAuthorized && (
              <Button variant="link" className=" bg-muted">
                <Link href={`/ invoices / ${invoiceId}/compare`} className=" flex items-center justify-center gap-x-2" >
                  <IconChartColumn className="w-4 h-4" />  Compare
                </Link >
              </Button >
            )}
          </div >
        )}
      </div >

      <Separator className="mt-3" />

      <Invoice data={invoice} />
    </div >
  )
}

export default InvoiceIdPage
