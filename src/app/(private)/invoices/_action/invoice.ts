"use server";

import { prisma } from "@/lib/prisma";

interface LR {
  LRNumber: string;
  vehicleNo: string;
  vehicleType: string;
  origin: string;
  destination: string;
  vendorId: string | undefined;
}

interface Invoice {
  fileNumber: string;
  LRs: LR[];
}

export const generateSingleInvoiceFromLorryPage = async (data: Invoice[]) => {
  try {
    if (data.length === 0) throw new Error("No files provided to create invoice.");

    // Use vendorId from first LR of first file
    const firstLR = data[0].LRs[0];
    const vendorId = firstLR?.vendorId;
    if (!vendorId) throw new Error("Vendor ID is missing for invoice");

    const now = new Date();
    const invoiceNumber = `${vendorId.substring(0, 3).toUpperCase()}-${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")}`;

    let subtotal = 0;

    // Iterate over each file
    for (const file of data) {
      const firstLROfFile = file.LRs[0];
      if (!firstLROfFile) continue;

      const lrRecord = await prisma.lRRequest.findUnique({
        where: { LRNumber: firstLROfFile.LRNumber },
      });

      if (lrRecord && lrRecord.priceSettled) {
        subtotal += lrRecord.priceSettled + (lrRecord.extraCost || 0);
      }
    }

    const taxRate = 0; // modify if needed
    const taxAmount = subtotal * taxRate;
    const grandTotal = subtotal + taxAmount;

    // Create invoice
    const createdInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        invoiceDate: new Date(),
        vendorId,
        subtotal,
        taxRate,
        taxAmount,
        grandTotal,
        status: "DRAFT",
      },
    });

    // Update all LRs to attach invoice and mark as invoiced
    const allLRNumbers = data.flatMap((file) => file.LRs.map((lr) => lr.LRNumber));

    await prisma.lRRequest.updateMany({
      where: { LRNumber: { in: allLRNumbers } },
      data: {
        isInvoiced: true,
        invoiceId: createdInvoice.id,
      },
    });

    return { error: null, invoice: createdInvoice };
  } catch (err) {
    console.error("Error while generating invoice:", err);
    if (err instanceof Error) return { error: err.message };
    return { error: "Something went wrong" };
  }
};
