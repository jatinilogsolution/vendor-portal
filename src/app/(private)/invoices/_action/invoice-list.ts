
"use server"
import { getCustomSession } from "@/actions/auth.action"
import type { Invoice } from "@/generated/prisma"
import { signOut } from "@/lib/auth-client"
import { prisma } from "@/lib/prisma" // adjust path
import { UserRoleEnum } from "@/utils/constant"


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
        include: { vendor: { select: { name: true } } },
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
