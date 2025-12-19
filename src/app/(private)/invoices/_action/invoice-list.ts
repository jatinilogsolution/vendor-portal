
"use server"
import { getCustomSession } from "@/actions/auth.action"
import { Invoice } from "@/generated/prisma/client"
import { signOut } from "@/lib/auth-client"
import { prisma } from "@/lib/prisma"
import { UserRoleEnum } from "@/utils/constant"
import { redirect } from "next/navigation"


export type InvoiceWithVendor = Invoice & { vendor: { name: string } }

type GetInvoicesResult = {
  success: boolean
  data?: InvoiceWithVendor[]
  total?: number
  page?: number
  limit?: number
  message?: string
}

export const getInvoices = async ({
  search,
  fromDate,
  toDate,
  page = 1,
  limit = 10,
}: {
  search?: string
  fromDate?: Date
  toDate?: Date
  page?: number
  limit?: number
} = {}): Promise<GetInvoicesResult> => {
  try {
    const { user, session } = await getCustomSession()

    if (!session) {
      await signOut()
      redirect("/")
      return { success: false, message: "Session expired. Please sign in again." }
    }

    const baseFilter: any = {}

    // 🔍 Date filter
    if (fromDate && toDate) {
      baseFilter.invoiceDate = { gte: fromDate, lte: toDate }
    }

    // 🔍 Search filter
    if (search) {
      baseFilter.OR = [
        { invoiceNumber: { contains: search } },
        { refernceNumber: { contains: search } },
        { vendor: { name: { contains: search } } },
      ]
    }

    let whereClause: any = {}
    if (user.role === UserRoleEnum.TVENDOR) {
      const vendor = await prisma.vendor.findFirst({
        where: { users: { some: { id: user.id } } },
      })
      if (!vendor) return { success: false, message: "Vendor not found." }
      whereClause = { vendorId: vendor.id, ...baseFilter }
    } else if ([UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(user?.role as any)) {
      whereClause = { status: "SENT", ...baseFilter }
    } else {
      return { success: false, message: "Unauthorized access." }
    }

    // ⚙️ Pagination
    const skip = (page - 1) * limit

    const [total, invoices] = await Promise.all([
      prisma.invoice.count({ where: whereClause }),
      prisma.invoice.findMany({
        where: whereClause,
        include: {
          vendor: { select: { name: true } },
          LRRequest: {
            include: {
              Annexure: true,
            },
          },
        },
        orderBy: { invoiceDate: "desc" },
        skip,
        take: limit,
      }),
    ])

    return {
      success: true,
      data: invoices,
      total,
      page,
      limit,
    }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return { success: false, message: "Failed to fetch invoices." }
  }
}







export const getVendorData = async () => {

  const session = await getCustomSession()
  const data = await prisma.vendor.findFirst({
    where: {
      users: {
        some: {
          id: session.user.id
        }
      }
    }
  })
  return data

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

    // 2️⃣ Update the invoice
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { invoiceNumber },
    });

    return { sucess: true, message: "Invoice Number updated successfully" };
  } catch (e) {
    console.error("Error updating Invoice Number:", e);
    return { sucess: false, message: "Failed to update Invoice Number" };
  }
};

/**
 * Withdraw a SENT invoice back to DRAFT status
 * Only allowed for vendors and only for SENT invoices
 */
export const withdrawInvoice = async (invoiceId: string) => {
  try {
    if (!invoiceId) {
      throw new Error("Invoice ID is required");
    }

    const { user, session } = await getCustomSession();

    if (!session) {
      await signOut();
      redirect("/");
      return { success: false, message: "Session expired. Please sign in again." };
    }

    // Only TVENDOR can withdraw
    if (user.role !== UserRoleEnum.TVENDOR) {
      return { success: false, message: "Unauthorized. Only vendors can withdraw invoices." };
    }

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Check if invoice belongs to the vendor
    const vendor = await prisma.vendor.findFirst({
      where: { users: { some: { id: user.id } } },
    });

    if (!vendor || invoice.vendorId !== vendor.id) {
      return { success: false, message: "Unauthorized. This invoice does not belong to you." };
    }

    // Check if invoice is in SENT status
    if (invoice.status !== "SENT") {
      return { success: false, message: "Only sent invoices can be withdrawn." };
    }

    // Update status to DRAFT
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: "DRAFT" },
    });

    return {
      success: true,
      message: "Invoice withdrawn successfully. You can now edit it.",
    };
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "Unknown error while withdrawing invoice";

    console.error("❌ Error while withdrawing invoice:", errMsg);
    throw new Error(errMsg);
  }
};

/**
 * Delete a DRAFT invoice and free all linked LR requests
 * Only allowed for DRAFT invoices
 */
export const deleteInvoice = async (invoiceId: string) => {
  try {
    if (!invoiceId) {
      throw new Error("Invoice ID is required");
    }

    const { user, session } = await getCustomSession();

    if (!session) {
      await signOut();
      redirect("/");
      return { success: false, message: "Session expired. Please sign in again." };
    }

    // Only TVENDOR can delete
    if (user.role !== UserRoleEnum.TVENDOR) {
      return { success: false, message: "Unauthorized. Only vendors can delete invoices." };
    }

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { LRRequest: true },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Check if invoice belongs to the vendor
    const vendor = await prisma.vendor.findFirst({
      where: { users: { some: { id: user.id } } },
    });

    if (!vendor || invoice.vendorId !== vendor.id) {
      return { success: false, message: "Unauthorized. This invoice does not belong to you." };
    }

    // Check if invoice is in DRAFT status
    if (invoice.status !== "DRAFT") {
      return { success: false, message: "Only draft invoices can be deleted." };
    }

    // Free all linked LR requests in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Free all LR requests
      await tx.lRRequest.updateMany({
        where: { invoiceId: invoiceId },
        data: {
          invoiceId: null,
          annexureId: null,
          groupId: null,
          isInvoiced: false,
        },
      });

      // 2. Delete the invoice (this will cascade delete InvoiceItems and InvoiceReferences)
      await tx.invoice.delete({
        where: { id: invoiceId },
      });
    });

    return {
      success: true,
      message: `Invoice deleted successfully. ${invoice.LRRequest.length} LR(s) have been freed.`,
    };
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "Unknown error while deleting invoice";

    console.error("❌ Error while deleting invoice:", errMsg);
    throw new Error(errMsg);
  }
};

/**
 * Save invoice as draft without validation
 * Allows partial data to be saved
 */
export const saveDraftInvoice = async ({
  invoiceId,
  taxRate,
  subTotal,
  totalExtra,
  taxAmount,
  grandTotal,
}: {
  invoiceId: string;
  taxRate?: number;
  subTotal?: number;
  totalExtra?: number;
  taxAmount?: number;
  grandTotal?: number;
}) => {
  try {
    if (!invoiceId) {
      throw new Error("Invoice ID is required");
    }

    const { user, session } = await getCustomSession();

    if (!session) {
      await signOut();
      redirect("/");
      return { success: false, message: "Session expired. Please sign in again." };
    }

    // Only TVENDOR can save drafts
    if (user.role !== UserRoleEnum.TVENDOR) {
      return { success: false, message: "Unauthorized. Only vendors can save draft invoices." };
    }

    // Get the invoice
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      throw new Error("Invoice not found");
    }

    // Check if invoice belongs to the vendor
    const vendor = await prisma.vendor.findFirst({
      where: { users: { some: { id: user.id } } },
    });

    if (!vendor || invoice.vendorId !== vendor.id) {
      return { success: false, message: "Unauthorized. This invoice does not belong to you." };
    }

    // Update invoice (only provided fields)
    const updateData: any = {};
    if (taxRate !== undefined) updateData.taxRate = taxRate;
    if (subTotal !== undefined) updateData.subtotal = subTotal;
    if (totalExtra !== undefined) updateData.totalExtra = totalExtra;
    if (taxAmount !== undefined) updateData.taxAmount = taxAmount;
    if (grandTotal !== undefined) updateData.grandTotal = grandTotal;

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: updateData,
    });

    return {
      success: true,
      message: "Draft saved successfully",
    };
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "Unknown error while saving draft";

    console.error("❌ Error while saving draft:", errMsg);
    throw new Error(errMsg);
  }
};

export const getInvoiceById = async ({ id }: { id: string }) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: {
        vendor: true, // include vendor details
        LRRequest: true, // include all linked LRs
      },
    })

    if (!invoice) {
      console.warn("No invoices found in the database.")
      return { error: "No invoices found" }
    }

    return { data: invoice }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return { error: "Error fetching invoices" }
  }
}

export const getInvoiceOnlyById = async ({ id }: { id: string }) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
    })

    if (!invoice) {
      console.warn("No invoices found in the database.")
      return { error: "No invoices found" }
    }

    return { data: invoice }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return { error: "Error fetching invoices" }
  }
}

// const checktDescr


export const sendInvoiceById = async ({
  invoiceId,
  taxRate,
  subTotal,
  totalExtra,
  taxAmount,
  grandTotal,
}: {
  invoiceId: string,
  taxRate: number,
  subTotal: number,
  totalExtra: number,
  taxAmount: number,
  grandTotal: number,
}) => {
  if (!invoiceId) {
    throw new Error("Invoice ID is required")
  }

  try {

    const failedThings = await prisma.invoice.findMany({
      where: { id: invoiceId },
      include: { LRRequest: true },
    });

    if (!failedThings || failedThings.length === 0) {
      throw new Error("Invoice not found for the provided invoice ID.");
    }

    const invoice = failedThings[0];

    // Define required invoice-level fields with friendly names
    const requiredInvoiceFields: Record<string, { value: any; message: string }> = {
      invoiceNumber: {
        value: invoice.invoiceNumber,
        message: "Invoice number is missing. Please add invoice number via 'Upload Invoice'",
      },
      billToId: {
        value: invoice.billToId,
        message: "Bill To ID is missing. Please link the invoice to a valid Bill To address.",
      },
      billTo: {
        value: invoice.billTo,
        message: "Bill To details are missing. Please provide billing address information.",
      },
      invoiceURI: {
        value: invoice.invoiceURI,
        message: "Invoice file link (invoiceURI) is missing. Please upload or generate the invoice document.",
      },
    };

    // Collect missing field messages
    const missingMessages: string[] = [];

    for (const { value, message } of Object.values(requiredInvoiceFields)) {
      if (!value) missingMessages.push(message);
    }

    // Check LRRequest for missing priceSettled values
    for (const lr of invoice.LRRequest) {
      if (!lr.priceSettled) {
        missingMessages.push(
          `Price settled amount is missing for LR Number '${lr.LRNumber || lr.id}'. Please update the settled price before proceeding.`
        );
      }
    }

    // Throw combined error if any issues exist
    if (missingMessages.length > 0) {
      throw new Error(missingMessages[0]);
    }


    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "SENT",
        grandTotal: grandTotal,
        subtotal: subTotal,
        taxAmount: taxAmount,
        taxRate: taxRate,
        totalExtra: totalExtra
      },
    })

    return {
      success: true,
      message: `${failedThings[0].invoiceNumber}: Invoice sent successfully`,
    }
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "Unknown error while sending invoice"

    console.error("❌ Error while sending invoice:", errMsg)

    throw new Error(errMsg)
    // throw new Error("Unable to send invoice. Please try again later.")
  }
}
