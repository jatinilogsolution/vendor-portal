"use client"

import { PDFDownloadLink } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { InvoicePDF } from "./InvoicePDF"

export const DownloadInvoiceButton = ({ invoice }: { invoice: any }) => (
  <div className="mt-4">
    <PDFDownloadLink
      document={<InvoicePDF invoice={invoice} />}
      fileName={`Invoice-${invoice.invoiceNumber}.pdf`}
    >
      {({ loading }) =>
        loading ? (
          <Button variant="outline" disabled>
            Generating PDF...
          </Button>
        ) : (
          <Button variant="default">Download Invoice PDF</Button>
        )
      }
    </PDFDownloadLink>
  </div>
)

 
import React, { useState } from "react"
import { PDFViewer } from "@react-pdf/renderer"
 

export const PreviewInvoiceButton = ({ invoice }: { invoice: any }) => {
  const [show, setShow] = useState(false)
  return (
    <>
      <Button onClick={() => setShow(true)}>Preview Invoice</Button>

      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-5xl h-[90vh] rounded shadow-lg relative">
            <button
              className="absolute top-2 right-2 p-2 text-white bg-red-500 rounded"
              onClick={() => setShow(false)}
            >
              Close
            </button>
            <PDFViewer style={{ width: "100%", height: "100%" }}>
              <InvoicePDF invoice={invoice} />
            </PDFViewer>
          </div>
        </div>
      )}
    </>
  )
}
