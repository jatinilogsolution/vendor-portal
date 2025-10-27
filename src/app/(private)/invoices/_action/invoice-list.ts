
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
        { refernceNumber: { contains: search} },
        { vendor: { name: { contains: search} } },
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


export const sendInvoiceById = async (id: string) => {
  if (!id) {
    throw new Error("Invoice ID is required")
  }

  try {
    await prisma.invoice.update({
      where: { id },
      data: { status: "SENT" },
    })

    return {
      success: true,
      message: "Invoice marked as sent successfully",
    }
  } catch (error: unknown) {
    const errMsg =
      error instanceof Error
        ? error.message
        : "Unknown error while sending invoice"

    console.error("❌ Error while sending invoice:", errMsg)

    throw new Error("Unable to send invoice. Please try again later.")
  }
}
