"use server"

import { BillToAddressByNameId } from "@/actions/wms/warehouse"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cache } from "react"

export const getVendor = cache( async ({ id }: { id: string }) => {

  try {

    const user = await prisma.user.findUnique({
      where: {
        id: id
      },
      select: {
        name: true,
        email: true,
        image: true,
        role: true,
        vendorId: true,
        id: true,
        Vendor: {
          include: {
            Address: true,
            
          }
        }
      }
    })

    return { data: user }

  } catch (error) {
    console.log("Error in getting vendor by id: ", error)
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "Something went wrong" }
  }
}
)




interface GetAllLRParams {
  vendorId?: string;
  page?: number;
  limit?: number;
  search?: string;
  fromDate?: string;
  toDate?: string;
  pod: boolean
}


 


export const getAllLRforVendorById = async ({
  vendorId,
  page = 1,
  limit = 10,
  search = "",
  fromDate,
  toDate,
  pod,
}: GetAllLRParams) => {
  try {
    const skip = (page - 1) * limit



    const filters: any = {
      tvendorId: vendorId,
      isInvoiced: false,
      invoiceId: null,
    }

    // POD filter

    // 📅 Date filter
    if (fromDate && toDate) {
      filters.outDate = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      }
    } else if (fromDate) {
      filters.outDate = { gte: new Date(fromDate) }
    } else if (toDate) {
      filters.outDate = { lte: new Date(toDate) }
    }

 
    if (search?.trim()) {
      const searchTerm = search.trim()
      filters.AND = [
        {
          OR: [
            { LRNumber: { contains: searchTerm } },
            { vehicleNo: { contains: searchTerm } },
            { vehicleType: { contains: searchTerm } },
            { origin: { contains: searchTerm } },
            { destination: { contains: searchTerm } },
            {
              tvendor: {
                name: { contains: searchTerm },
              },
            },
          ],
        },
      ]
    }
    if (pod === true) {
      filters.podlink = { not: null }  

      filters.AND = [
        ...(filters.AND || []),
        { podlink: { not: "" } },  
      ]
    }

    // 🧮 Total count
    const totalItems = await prisma.lRRequest.count({ where: filters })

    // 📋 Fetch paginated data
    const data = await prisma.lRRequest.findMany({
      where: filters,
      include: {
        tvendor: { select: { id: true, name: true } },
      },
      skip,
      take: limit,
      orderBy: { outDate: "desc" },
    })

    // 🏭 Resolve warehouse names for origins (with caching)
    const warehouseCache: Record<string, string> = {}

    const enhancedData = await Promise.all(
      data.map(async (item) => {
        const originName = item.origin

        if (originName && !warehouseCache[originName]) {
          try {
            const { warehouseName } = await BillToAddressByNameId(originName)
            warehouseCache[originName] = warehouseName || originName
          } catch (err) {
            console.warn(`Failed to fetch warehouse name for ID: ${originName}`, err)
            warehouseCache[originName] = originName
          }
        }

        return {
          ...item,
          origin: warehouseCache[originName!] || originName,
        }
      })
    )

    return {
      data: enhancedData,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    }
  } catch (err) {
    console.error("❌ Error fetching LRs:", err)
    throw new Error("Failed to fetch lorry receipts")
  }
}




export const getAddressByVendorId = async (id: string) => {
  try {

    const address = await prisma.address.findFirst({
      where: {
        vendorId: id
      },
      select: {
        city: true,
        country: true,
        line1: true,
        line2: true,
        postal: true,
        state: true,
      }
    })
    return { data: address }

  } catch (error) {
    console.log("Error in getting Address by id: ", error)
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "Something went wrong" }
  }
}



export const updateAddressByVendorId = async (
  { data, id }: {
    id: string,
    data: {
      line1: string
      line2?: string
      city: string
      state?: string
      postal?: string
      country: string
    }
  }
) => {
  try {
    const updated = await prisma.address.update({
      where: {
        vendorId: id,
      },
      data: {
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postal: data.postal,
        country: data.country,
      },
    })

    revalidatePath("/profile")

    return { data: updated }
  } catch (error) {
    console.log("Error in updating Address by vendorId: ", error)
    if (error instanceof Error) {
      return { error: error.message }
    }

    return { error: "Something went wrong" }
  }
}
