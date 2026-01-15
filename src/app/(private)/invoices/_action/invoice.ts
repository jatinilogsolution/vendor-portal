"use server";

import { prisma } from "@/lib/prisma";
import { getAWLWMSDBPOOLFINS } from "@/services/db";
import { auditCreate, auditUpdate } from "@/lib/audit-logger";

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


export const generateSingleInvoiceFromLorryPage = async (
  data: Invoice[],
  refernceNumber?: string
) => {
  try {
    if (data.length === 0) throw new Error("No files provided to create invoice.");

    // Get vendorId from first LR
    const firstLR = data[0].LRs[0];

    const vendorId = firstLR?.vendorId;
    if (!vendorId) throw new Error("Vendor ID is missing for invoice");

    let reference: any;

    if (refernceNumber) {
      // ✅ Try to find existing invoice
      reference = await prisma.invoice.findUnique({
        where: { refernceNumber },
        include: { LRRequest: true }, // include existing LRs
      });

      if (!reference) {
        console.log("1")
        // Invoice does not exist → create new
        reference = await prisma.invoice.create({
          data: {
            refernceNumber,
            invoiceDate: new Date(),
            vendorId,
            status: "DRAFT",
          },
        });


      }
    } else {


      const now = new Date();
      const refNo = `${vendorId.substring(0, 3).toUpperCase()}-${now.getFullYear()}${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
          Math.random() * 1000
        )
          .toString()
          .padStart(3, "0")}`;



      reference = await prisma.invoice.create({
        data: {
          refernceNumber: refNo,
          invoiceDate: new Date(),
          vendorId,
          status: "DRAFT",
        },
        include: { LRRequest: true },
      });

      // Log invoice creation
      await auditCreate(
        "Invoice",
        reference,
        `Created new invoice ${refNo}`,
        reference.id
      );

    }

    const existingLRNumbers = reference.LRRequest.map((lr: any) => lr.LRNumber);
    const newLRs = data
      .flatMap((file) => file.LRs)
      .filter((lr) => !existingLRNumbers.includes(lr.LRNumber));

    if (newLRs.length > 0) {
      const allLRNumbers = newLRs.map((lr) => lr.LRNumber);
      await prisma.lRRequest.updateMany({
        where: { LRNumber: { in: allLRNumbers } },
        data: {
          isInvoiced: true,
          invoiceId: reference.id,
        },
      });

      // Log LR association with invoice
      await auditUpdate(
        "Invoice",
        reference.id,
        { LRCount: existingLRNumbers.length },
        { LRCount: existingLRNumbers.length + newLRs.length },
        `Added ${newLRs.length} LR(s) to invoice ${reference.refernceNumber}`
      );

    }

    return { error: null, reference };
  } catch (err) {
    console.error("Error while generating invoice:", err);
    if (err instanceof Error) return { error: err.message };
    return { error: "Something went wrong" };
  }
};



export const getInvoiceDetailsById = async (invoiceId: string) => {


  try {
    const data = await prisma.invoice.findFirst({
      where: {
        id: invoiceId
      },
      select: {
        invoiceNumber: true,
        vendorId: true
      }
    })

    return {
      success: true,
      data: data
    }

  } catch (e) {
    console.log("Error in getInvoiceDetailsById: ", e)

    return { success: false, message: "Error in getting invoice Details" }
  }

}



export const updateTaxRateForInvoice = async (invoiceId: string, taxRate: number) => {


  try {
    // Get old invoice data before update
    const oldInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { taxRate: true, refernceNumber: true }
    });

    await prisma.invoice.updateMany({
      where: {
        id: invoiceId
      },
      data: {
        taxRate: taxRate
      }
    });

    // Log tax rate change
    if (oldInvoice) {
      await auditUpdate(
        "Invoice",
        invoiceId,
        { taxRate: oldInvoice.taxRate },
        { taxRate },
        `Updated tax rate from ${oldInvoice.taxRate}% to ${taxRate}% for invoice ${oldInvoice.refernceNumber}`
      );
    }

    return { sucess: true, message: "Tax rate updated" };
  } catch (e) {
    console.log("Error in updateTaxRateForInvoice", e);
    return { sucess: false, message: "Failed updated tax rate" };

  }
}

export const updateInvoiceNumberForInvoice = async (
  invoiceId: string,
  invoiceNumber: string,
  vendorId: string
) => {
  try {
    // 1️⃣ Check if invoiceNumber already exists for this vendor (ignore current invoice)
    const existing = await prisma.invoice.findFirst({
      where: {
        invoiceNumber,
        vendorId,
        NOT: { id: invoiceId },
      },
    });

    if (existing) {
      return { sucess: false, message: "Invoice Number already exists for this vendor" };
    }

    // Get old invoice data
    const oldInvoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      select: { invoiceNumber: true, refernceNumber: true }
    });

    // 2️⃣ Update the invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { invoiceNumber },
    });

    // Log invoice number change
    if (oldInvoice) {
      await auditUpdate(
        "Invoice",
        invoiceId,
        { invoiceNumber: oldInvoice.invoiceNumber },
        { invoiceNumber },
        `Updated invoice number from "${oldInvoice.invoiceNumber}" to "${invoiceNumber}" for ${oldInvoice.refernceNumber}`
      );
    }

    return { sucess: true, message: "Invoice Number updated successfully" };
  } catch (e) {
    console.error("Error updating Invoice Number:", e);
    return { sucess: false, message: "Failed to update Invoice Number" };
  }



}