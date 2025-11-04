"use server"

import { BillToAddressByNameId } from "@/actions/wms/warehouse"
import { LRRequest, Vendor } from "@/generated/prisma"
import { prisma } from "@/lib/prisma"

export type EnrichedLRRequest = LRRequest & {
  warehouseName: string,
  tvendor: Vendor
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
        podlink:{not: null}
      },
      include: {
        tvendor: true,
        // Invoice: true,
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

