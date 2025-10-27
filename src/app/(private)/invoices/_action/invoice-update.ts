"use server"
import { BillToAddressById, Warehouse } from "@/actions/wms/warehouse";
import { prisma } from "@/lib/prisma";

export const updateBillToAddress = async (invoiceId: string, billToId: string) => {
  try {

    // 1️⃣ Validate the ID
    if (!billToId || typeof billToId !== "string" || !billToId.trim()) {
      return { error: "Invalid warehouse ID provided" };
    }

    const warehouses: Warehouse[] = await BillToAddressById(billToId?.trim());



    if (!warehouses || !warehouses[0]) {
      return { error: "No address returned from API" };
    }

    const addr = warehouses[0];

    // Format address neatly
    const formattedAddress = [
      addr.addressLine1,
      addr.addressLine2,
      addr.city,
      addr.state,
      addr.pinCode,
      addr.country,
    ]
      .map((f) => f?.trim() || "")
      .filter((f) => f !== "")
      .join(", ");

    // Update invoice in DB
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        billToId,
        billTo: formattedAddress || "",
        billToGstin: addr.gstinNumber?.trim() || "",
      },
    });



    return updatedInvoice;
  } catch (err) {
    console.error("Error updating Bill To Address:", err);
    return { error: "Failed to update Bill to Address" };
  }
};





import { uploadAttachmentToAzure, deleteAttachmentFromAzure } from "@/services/azure-blob"


// export async function saveInvoiceFile(invoiceId: string, invoiceNumber: string, file: File) {
//   if (!invoiceId) throw new Error("Invoice ID is required")
//   if (!file) throw new Error("File is required")

//   try {
//     const path = `invoices/${invoiceId}/${file.name}`

//     // Prepare FormData
//     const formData = new FormData()
//     formData.append("file", file)

//     // Upload to Azure
//     const fileUrl = await uploadAttachmentToAzure(path, formData)

//     // Save file URL to invoice
//     await prisma.invoice.update({
//       where: { id: invoiceId },
//       data: {
//         invoiceURI: fileUrl,
//         invoiceNumber: invoiceNumber
//       },
//     })

//     return { id: path, name: file.name, fileUrl }
//   } catch (err) {
//     console.error("Error saving invoice file:", err)
//     throw new Error("Failed to save invoice file")
//   }
// }


export async function saveInvoiceFile(
  invoiceId: string,
  invoiceNumber: string,
  file: File,
  referenceNumber: string
) {
  if (!invoiceId) throw new Error("Invoice ID is required");
  if (!referenceNumber?.trim()) throw new Error("Reference number is required");
  if (!invoiceNumber?.trim()) throw new Error("Invoice number is required");
  if (!file) throw new Error("File is required");

  try {
    // Check if the invoiceNumber already exists for the same reference
    const existingInvoice = await prisma.invoice.findFirst({
      where: {
        refernceNumber: referenceNumber,
        invoiceNumber: invoiceNumber,
        NOT: { id: invoiceId }, // exclude current invoice
      },
    });

    if (existingInvoice) {
      throw new Error(
        `Invoice number "${invoiceNumber}" already exists for reference "${referenceNumber}"`
      );
    }

    const path = `invoices/${invoiceId}/${file.name}`;

    // Prepare FormData
    const formData = new FormData();
    formData.append("file", file);

    // Upload to Azure
    const fileUrl = await uploadAttachmentToAzure(path, formData);

    // Save file URL and invoice number
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        invoiceURI: fileUrl,
        invoiceNumber: invoiceNumber,
        refernceNumber: referenceNumber,
      },
    });

    return { id: path, name: file.name, fileUrl };
  } catch (err: any) {
    console.error("Error saving invoice file:", err);
    throw new Error(err.message || "Failed to save invoice file");
  }
}

export async function deleteInvoiceFile(invoiceId: string, fileUrl: string) {
  if (!invoiceId) throw new Error("Invoice ID is required")
  if (!fileUrl) throw new Error("File URL is required")

  try {
    // Delete from Azure
    await deleteAttachmentFromAzure(fileUrl)

    // Remove from invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { invoiceURI: null },
    })
  } catch (err) {
    console.error("Error deleting invoice file:", err)
    throw new Error("Failed to delete invoice file")
  }
}
