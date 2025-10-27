

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // ShadCN Table components
import { InvoiceWithVendor } from "../_action/invoice-list"
import { formatCurrency } from "@/utils/calculations"
import { LazyDate } from "@/components/lazzy-date"
import { Badge } from "@/components/ui/badge"

export const InvoiceTable = ({ data }: { data: InvoiceWithVendor[] }) => {



  return (

    <div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Refernce Number</TableHead>
            <TableHead>Invoice Number</TableHead>

            <TableHead>Vendor</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className=" text-center">Grand Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-gray-50">
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
              <TableCell>{invoice.vendor?.name || "-"}</TableCell>
              <TableCell>
                <LazyDate date={invoice.invoiceDate.toString()} />
                {/* {invoice.invoiceDate
                  ? new Date(invoice.invoiceDate).toLocaleDateString()
                  : "-"} */}
              </TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell className=" text-center">{invoice.status !== "DRAFT" ? formatCurrency(invoice.grandTotal) : "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>

  )
}
