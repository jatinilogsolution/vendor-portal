"use server"

import { BillToAddressByNameId } from "@/actions/wms/warehouse"
import { LRRequest, Vendor, Invoice, Annexure, AnnexureFileGroup } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"

export type EnrichedLRRequest = LRRequest & {
  warehouseName: string
  tvendor: Vendor
  Invoice: {
    id: string
    invoiceNumber: string | null
    refernceNumber: string
    status: string
  } | null
  Annexure: {
    id: string
    name: string
    fromDate: Date
    toDate: Date
  } | null
  group: {
    id: string
    fileNumber: string
    status: string | null
    totalPrice: number | null
    extraCost: number | null
    remark: string | null
    annexureId: string
  } | null
}


// Simple in-memory cache
let cachedData: EnrichedLRRequest[] | null = null
let cacheTime: number | null = null
const CACHE_DURATION = 2 * 60 * 1000

export const getAllPodsForAllVendors = async ({
  fromDate,
  toDate,
}: {
  fromDate?: string
  toDate?: string
} = {}): Promise<EnrichedLRRequest[]> => {
  try {
    const now = Date.now()

    if (cachedData && cacheTime && now - cacheTime < CACHE_DURATION) {
      return cachedData
    }

    const whereClause: any = { podlink: { not: null } }

    if (fromDate || toDate) {
      whereClause.outDate = {}
      if (fromDate) whereClause.outDate.gte = new Date(fromDate)
      if (toDate) whereClause.outDate.lte = new Date(toDate)
    }

    const data = await prisma.lRRequest.findMany({
      where: {
        podlink: { not: null }
      },
      include: {
        tvendor: true,
        Invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            refernceNumber: true,
            status: true
          }
        },
        Annexure: {
          select: {
            id: true,
            name: true,
            fromDate: true,
            toDate: true
          }
        },
        group: {
          select: {
            id: true,
            fileNumber: true,
            status: true,
            totalPrice: true,
            extraCost: true,
            remark: true,
            annexureId: true
          }
        }
      },
      orderBy: { outDate: "desc" },
    })

    const enrichedData = await Promise.all(
      data.map(async (lr) => {
        const { warehouseName } = await BillToAddressByNameId(lr.origin || "")
        return { ...lr, warehouseName }
      })
    )

    // console.log("><><><<<><><><><><><><><>", JSON.stringify(data, null, 2))

    // Store in cache
    cachedData = enrichedData
    cacheTime = now

    return enrichedData
  } catch (err) {
    console.error("❌ Error fetching PODs with warehouse names:", err)
    return []
  }
}

// Fetch all LRs by fileNumber with detailed information
export async function getDetailedLRsByFileNumber(fileNumber: string) {
  try {
    const lrs = await prisma.lRRequest.findMany({
      where: { fileNumber },
      include: {
        tvendor: {
          select: {
            id: true,
            name: true,
            contactEmail: true,
            contactPhone: true
          }
        },
        Invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            refernceNumber: true,
            status: true,
            invoiceDate: true
          }
        },
        Annexure: {
          select: {
            id: true,
            name: true,
            fromDate: true,
            toDate: true
          }
        },
        group: {
          select: {
            id: true,
            fileNumber: true,
            status: true,
            totalPrice: true,
            extraCost: true,
            remark: true,
            annexureId: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    })

    if (!lrs || lrs.length === 0) {
      return { error: "No LR Requests found for this file number." }
    }

    // Enrich with warehouse names
    const enrichedLRs = await Promise.all(
      lrs.map(async (lr) => {
        const { warehouseName } = await BillToAddressByNameId(lr.origin || "")
        return { ...lr, warehouseName }
      })
    )

    // Calculate status counts
    const statusCounts = {
      total: enrichedLRs.length,
      verified: enrichedLRs.filter(lr => lr.status === 'VERIFIED').length,
      pending: enrichedLRs.filter(lr => !lr.status || lr.status === 'PENDING').length,
      wrong: enrichedLRs.filter(lr => lr.status === 'WRONG').length,
    }

    return { data: enrichedLRs, statusCounts }
  } catch (err) {
    console.error("Error fetching detailed LR Requests:", err)
    return { error: "Something went wrong while fetching the LR requests." }
  }
}

// Fetch LR by fileNumber
export async function getLRRequestByFileNumber(fileNumber: string) {
  try {
    const lr = await prisma.lRRequest.findFirst({
      where: { fileNumber },
      select: {
        id: true,
        LRNumber: true,
        status: true,
        remark: true,
        tvendor: { select: { name: true } },
        podlink: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!lr) return { error: "LR Request not found." }

    return { data: lr }
  } catch (err) {
    console.error("Error fetching LR Request:", err)
    return { error: "Something went wrong while fetching the LR request." }
  }
}

