

// import React from "react";
// import Link from "next/link";
// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table"; // ShadCN Table components
// import { getInvoices } from "../_action/invoice-list";
// import { formatCurrency } from "@/utils/calculations";
// import { LazyDate } from "@/components/lazzy-date";

// export const InvoiceTable = async () => {
//     const invoices = await getInvoices();

//     if (!invoices || invoices.length === 0) {
//         return (
//             <div className="p-6 text-center text-gray-500">
//                 No invoices found
//             </div>
//         );
//     }

//     return (
//         <div className="p-6 max-w-6xl mx-auto">
//             <h1 className="text-2xl font-bold mb-4">All Invoices</h1>
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         <TableHead>Invoice Number</TableHead>
//                         <TableHead>Vendor</TableHead>
//                         <TableHead>Invoice Date</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Grand Total</TableHead>
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {invoices.map((invoice) => (
//                         <TableRow key={invoice.id} className="hover:bg-gray-50">
//                             <TableCell>
//                                 <Link
//                                     href={`/invoices/${invoice.id}`}
//                                     className="text-blue-600 hover:underline"
//                                 >
//                                     {invoice.invoiceNumber}
//                                 </Link>
//                             </TableCell>
//                             <TableCell>{invoice.vendor?.name || "-"}</TableCell>
//                             <TableCell>
//                                 <LazyDate date={invoice.invoiceDate.toString()} />
//                                 {/* {invoice.invoiceDate
//                   ? new Date(invoice.invoiceDate).toLocaleDateString()
//                   : "-"} */}
//                             </TableCell>
//                             <TableCell>{invoice.status}</TableCell>
//                             <TableCell>{formatCurrency(invoice.grandTotal)}</TableCell>
//                         </TableRow>
//                     ))}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };

import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table" // ShadCN Table components
import { getInvoices } from "../_action/invoice-list"
import { formatCurrency } from "@/utils/calculations"
import { LazyDate } from "@/components/lazzy-date"

export const InvoiceTable = async () => {
  const invoices = await getInvoices()

  if (!invoices || invoices.length === 0) {
    return <div className="p-6 text-center text-gray-500">No invoices found</div>
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">All Invoices</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Invoice Number</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Invoice Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Grand Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.id} className="hover:bg-gray-50">
              <TableCell>
                <Link href={`/invoices/${invoice.id}`} className="text-blue-600 hover:underline">
                  {invoice.invoiceNumber}
                </Link>
              </TableCell>
              <TableCell>{invoice.vendor?.name || "-"}</TableCell>
              <TableCell>
                <LazyDate date={invoice.invoiceDate.toString()} />
                {/* {invoice.invoiceDate
                  ? new Date(invoice.invoiceDate).toLocaleDateString()
                  : "-"} */}
              </TableCell>
              <TableCell>{invoice.status}</TableCell>
              <TableCell>{formatCurrency(invoice.grandTotal)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
