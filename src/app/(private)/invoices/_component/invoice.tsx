"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { formatCurrency } from "@/utils/calculations"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { amountToWords } from "@/utils/amountToWords"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import { DownloadInvoiceButton, PreviewInvoiceButton } from "./download-invoice-pdf"
import { PDFViewer } from "@react-pdf/renderer"
import { InvoicePDF } from "./InvoicePDF"

export const Invoice = ({ id }: { id: string }) => {
  const [invoice, setInvoice] = useState<any>()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/invoices/${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.error) setError(data.error)
        else setInvoice(data)
      })
      .catch(() => setError("Error fetching invoice"))
  }, [id])

  if (error) return <div className="p-6 text-center text-gray-500">{error}</div>
  if (!invoice) return <div className="p-6 text-center text-gray-500">Loading...</div>


  return (
    <>
      {/* <DownloadInvoiceButton invoice={invoice} /> */}
      {/* <PreviewInvoiceButton invoice={invoice} /> */}
      <PDFViewer style={{ width: "100%", height: "720px" }}>
        <InvoicePDF invoice={invoice} />
      </PDFViewer>

      <div className="p-8 bg-white shadow-xl rounded-lg max-w-5xl mx-auto border border-gray-200 print:shadow-none print:border-0 print:p-0">
        {/* HEADER */}
        <header className="flex items-center justify-between border-b pb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">INVOICE</h1>
            <p className="text-gray-500 mt-1">Invoice #: {invoice.invoiceNumber}</p>
            <p className="text-gray-500">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <h2 className="text-lg font-semibold text-gray-800">AWL India Pvt. Ltd.</h2>
            <p className="text-sm text-gray-500">Gurgaon, Haryana</p>
            <p className="text-sm text-gray-500">GSTIN: 06AAICA1234L1ZK</p>
          </div>
        </header>

        {/* BILLING INFO */}
        <section className="grid grid-cols-2 gap-6 mt-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800 border-b pb-1">Vendor Details</h3>
            <p><span className="font-medium">Name:</span> {invoice.vendor?.name}</p>
            <p><span className="font-medium">Email:</span> {invoice.vendor?.contactEmail || "-"}</p>
            <p><span className="font-medium">Phone:</span> {invoice.vendor?.contactPhone || "-"}</p>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-gray-800 border-b pb-1">Bill To</h3>
            <p>{invoice.billTo}</p>
            <p>{invoice.billToId}</p>
            <p>GSTIN: {invoice.billToGstin}</p>
          </div>
        </section>

        {/* LR DETAILS */}
        <section className="mt-8">
          <h3 className="font-semibold text-gray-800 mb-2 border-b pb-1">LRs Included in this Invoice</h3>

          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>LR Number</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Origin</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Price Settled</TableHead>
                <TableHead className="text-right">Extra Cost</TableHead>
                <TableHead className="text-center">POD</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoice.LRRequest?.map((lr: any) => (
                <TableRow key={lr.id}>
                  <TableCell>{lr.LRNumber}</TableCell>
                  <TableCell>{lr.vehicleType} ({lr.vehicleNo})</TableCell>
                  <TableCell>{lr.origin}</TableCell>
                  <TableCell>{lr.destination}</TableCell>
                  <TableCell className="text-right">{formatCurrency(lr.priceSettled || 0)}</TableCell>
                  <TableCell className="text-right">{formatCurrency(lr.extraCost || 0)}</TableCell>
                  <TableCell className="text-center">
                    {lr.podlink ? (
                      <Button variant="secondary" size="sm" asChild>
                        <Link href={lr.podlink} target="_blank">View</Link>
                      </Button>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </section>

        {/* TOTAL SECTION */}
        <section className="mt-8 flex justify-between items-start">
          <div className="w-1/2">
            <h4 className="font-semibold text-gray-800 mb-2">Amount in Words</h4>
            <blockquote className="italic text-gray-700 text-md border-l-4 border-gray-300 pl-3">
              {amountToWords(invoice.grandTotal)}
            </blockquote>
          </div>

          <div className="w-1/3 bg-gray-50 p-4 rounded-md border text-sm">
            <div className="flex justify-between mb-1">
              <span>Subtotal</span>
              <span>{formatCurrency(invoice.subtotal || 0)}</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>Tax ({invoice.taxRate || 0}%)</span>
              <span>{formatCurrency(invoice.taxAmount || 0)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between font-bold text-gray-800">
              <span>Grand Total</span>
              <span>{formatCurrency(invoice.grandTotal || 0)}</span>
            </div>
            <div className="text-right text-sm mt-1">
              <span className={`inline-block px-2 py-1 rounded ${invoice.status === "Paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {invoice.status}
              </span>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="mt-10 border-t pt-4 text-sm text-gray-500 text-center">
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
          <p>Thank you for your business!</p>
        </footer>
      </div>
    </>

  )
}

