

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { InvoiceWithVendor } from "../_action/invoice-list"
import { formatCurrency } from "@/utils/calculations"
import { LazyDate } from "@/components/lazzy-date"
import { Badge } from "@/components/ui/badge"
import { IconExternalLink, IconTrash } from "@tabler/icons-react"
import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { deleteInvoice } from "../_action/invoice-list"
import { toast } from "sonner"
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
import { useRouter } from "next/navigation"
import { useSession } from "@/lib/auth-client"
import { UserRoleEnum } from "@/utils/constant"

export const InvoiceTable = ({ data }: { data: InvoiceWithVendor[] }) => {
  const router = useRouter()
  const session = useSession()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isTVendor = session.data?.user.role === UserRoleEnum.TVENDOR

  // Create a map of invoice ID to annexure info
  const invoiceAnnexureMap = useMemo(() => {
    const map = new Map<string, { id: string; name: string } | null>()

    data.forEach((invoice: any) => {
      if (invoice.LRRequest && invoice.LRRequest.length > 0) {
        // Get the first LR's annexure (they should all have the same annexure)
        const firstLR = invoice.LRRequest[0]
        if (firstLR.Annexure) {
          map.set(invoice.id, {
            id: firstLR.Annexure.id,
            name: firstLR.Annexure.name,
          })
        } else {
          map.set(invoice.id, null)
        }
      } else {
        map.set(invoice.id, null)
      }
    })

    return map
  }, [data])

  const handleDelete = async (invoiceId: string) => {
    try {
      setDeletingId(invoiceId)
      const result = await deleteInvoice(invoiceId)

      if (result.success) {
        toast.success(result.message)
        router.replace("/invoices")
      } else {
        toast.error(result.message)
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message)
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (

    <div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Refernce Number</TableHead>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Annexure</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className=" text-center">Grand Total</TableHead>
            {isTVendor && <TableHead className="text-center">Actions</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => {
            const annexure = invoiceAnnexureMap.get(invoice.id)
            const isDraft = invoice.status === "DRAFT"

            return (
              <TableRow key={invoice.id} >
                <TableCell>
                  <Badge variant={"secondary"} className=" w-36">

                    <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                      {invoice.refernceNumber}
                    </Link>
                  </Badge>

                </TableCell>
                <TableCell>
                  <Badge variant={"secondary"} className=" w-36">


                    {invoice.invoiceNumber ?? "No Invoice Attached"}

                  </Badge>

                </TableCell>

                {/* Annexure Column */}
                <TableCell>
                  {annexure ? (
                    <Link
                      href={`/lorries/annexure?annexureId=${annexure.id}`}
                      className="text-blue-600 hover:underline flex items-center gap-1"
                    >
                      {annexure.name}
                      <IconExternalLink className="w-3 h-3" />
                    </Link>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>

                <TableCell>{invoice.vendor?.name || "-"}</TableCell>
                <TableCell>
                  <LazyDate date={invoice.invoiceDate.toString()} />
                </TableCell>
                <TableCell>
                  <Badge variant={invoice.status === "SENT" ? "default" : "secondary"}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className=" text-center">{invoice.status !== "DRAFT" ? formatCurrency(invoice.grandTotal) : "-"}</TableCell>

                {/* Actions Column - only for TVENDOR and DRAFT invoices */}
                {isTVendor && (
                  <TableCell className="text-center">
                    {isDraft && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            disabled={deletingId === invoice.id}
                          >
                            <IconTrash className="w-4 h-4 text-destructive" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This will permanently delete invoice {invoice.refernceNumber} and free all linked LR requests.
                              The LRs will be available for adding to other invoices/annexures. This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(invoice.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete Invoice
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </TableCell>
                )}
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>

  )
}
