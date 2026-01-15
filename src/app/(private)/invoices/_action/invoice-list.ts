
"use server"
import { getCustomSession } from "@/actions/auth.action"
import { Invoice } from "@/generated/prisma/client"
import { signOut } from "@/lib/auth-client"
import { prisma } from "@/lib/prisma"
import { InvoiceStatus, UserRoleEnum } from "@/utils/constant"
import { redirect } from "next/navigation"


export type InvoiceWithVendor = Invoice & { vendor: { name: string } }

export type GetInvoicesResult = {
  success: boolean
  data?: InvoiceWithVendor[]
  total?: number
  stats?: Record<string, number>
  page?: number
  limit?: number
  message?: string
}

export const getInvoices = async ({
  search,
  status,
  fromDate,
  toDate,
  page = 1,
  limit = 10,
}: {
  search?: string
  status?: string
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

    // 🔍 Status filter
    if (status && status !== "ALL") {
      if (status === "REJECTED") {
        baseFilter.OR = [
          { status: "REJECTED_BY_TADMIN" },
          { status: "REJECTED_BY_BOSS" }
        ];
      } else {
        baseFilter.status = status;
      }
    }

    let whereClause: any = {}
    if (user.role === UserRoleEnum.TVENDOR) {
      const vendor = await prisma.vendor.findFirst({
        where: { users: { some: { id: user.id } } },
      })
      if (!vendor) return { success: false, message: "Vendor not found." }
      whereClause = { vendorId: vendor.id, ...baseFilter }
    } else if ([UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(user?.role as any)) {
      // Admins/Boss see items needing review or those that are approved
      // If no explicit status filter, show everything relevant for workflow
      whereClause = { ...baseFilter }
      if (!status || status === "ALL") {
        // Default view for admins: things to review or recently approved?
        // Actually, better to show all sent ones initially
        whereClause.NOT = { status: "DRAFT" }
      }
    } else {
      return { success: false, message: "Unauthorized access." }
    }

    // ⚙️ Pagination
    const skip = (page - 1) * limit

    const [total, invoices, statusCounts] = await Promise.all([
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
      prisma.invoice.groupBy({
        by: ['status'],
        where: user.role === UserRoleEnum.TVENDOR ? {
          vendor: { users: { some: { id: user.id } } }
        } : { NOT: { status: "DRAFT" } },
        _count: { id: true }
      })
    ])

    const stats: Record<string, number> = {}
    statusCounts.forEach(c => {
      stats[c.status] = c._count.id;
    })

    return {
      success: true,
      data: invoices,
      total,
      stats,
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

    // Check if invoice is in SENT status (now PENDING_TADMIN_REVIEW)
    if (invoice.status !== InvoiceStatus.PENDING_TADMIN_REVIEW && invoice.status !== "SENT") {
      return { success: false, message: "Only sent invoices can be withdrawn." };
    }

    // Update status to DRAFT
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { status: InvoiceStatus.DRAFT },
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

    const isVendor = (user.role as any) === UserRoleEnum.TVENDOR;
    const isAdmin = (user.role as any) === UserRoleEnum.TADMIN;

    // --- NEW PERMISSION LOGIC ---
    // 1. Vendor can only delete if it's DRAFT and NEVER submitted
    if (isVendor) {
        if (invoice.submittedAt !== null) {
            return { success: false, message: "This invoice has already been submitted. Please 'Request Deletion' so that Traffic Admin can process it." };
        }
        if (invoice.status !== InvoiceStatus.DRAFT) {
            return { success: false, message: "Only DRAFT invoices that have not been submitted can be deleted by Vendors." };
        }
    }

    // 2. Admin can only delete if Vendor has requested deletion
    if (isAdmin) {
        if (!invoice.deletionRequested) {
            return { success: false, message: "Deletion can only be processed by Admin if the Vendor has requested it." };
        }
    }

    // 3. Block for other roles (BOSS etc)
    if (!isVendor && !isAdmin) {
        return { success: false, message: "Unauthorized to delete invoice." };
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

      // 2. Delete Workflow Comments
      await tx.workflowComment.deleteMany({
        where: { invoiceId: invoiceId },
      });

      // 3. Delete Invoice References
      if (invoice.refernceNumber) {
        await tx.invoiceReference.deleteMany({
          where: { refernceId: invoice.refernceNumber },
        });
      }

      // 4. Delete the invoice (this will cascade delete InvoiceItems)
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
        annexure: true, // include linked annexure
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


    // Recalculate totals to ensure integrity
    const calculatedTaxAmount = Number(((subTotal + totalExtra) * (taxRate / 100)).toFixed(2));
    const calculatedGrandTotal = Number((subTotal + totalExtra + calculatedTaxAmount).toFixed(2));

    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: InvoiceStatus.PENDING_TADMIN_REVIEW,
        submittedAt: new Date(),
        grandTotal: calculatedGrandTotal,
        subtotal: subTotal,
        taxAmount: calculatedTaxAmount,
        taxRate: taxRate,
        totalExtra: totalExtra,
        statusHistory: {
          create: {
            fromStatus: invoice.status,
            toStatus: InvoiceStatus.PENDING_TADMIN_REVIEW,
            changedBy: (await getCustomSession()).user.id,
            notes: "Invoice submitted for review"
          }
        }
      },
    })

    // 💬 CHAT INTEGRATION: Post professional submission message
    const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
    await prisma.workflowComment.create({
      data: {
        content: `[SUBMITTED] Invoice ${invoice.invoiceNumber || invoice.refernceNumber} has been submitted for review. [View Document](${invoiceLink})`,
        authorId: (await getCustomSession()).user.id,
        authorRole: UserRoleEnum.TVENDOR,
        invoiceId: invoiceId,
        annexureId: invoice.annexureId,
        isPrivate: false
      }
    });

    return {
      success: true,
      message: `Invoice ${invoice.invoiceNumber || invoice.refernceNumber} submitted successfully.`,
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
