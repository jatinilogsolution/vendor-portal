"use server"

import { BillToAddressByNameId } from "@/actions/wms/warehouse"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cache } from "react"

export const getVendor = cache(async ({ id }: { id: string }) => {

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
  pod: boolean;
  userId?: string;
}




export const getAllLRforVendorById = async ({
  vendorId,
  page = 1,
  limit = 10,
  search = "",
  fromDate,
  toDate,
  pod,
  userId,
}: GetAllLRParams) => {
  try {
    const skip = (page - 1) * limit;

    // Check user role if userId is provided
    let userRole: string | null = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      userRole = user?.role || null;
    }

    const filters: any = {
      tvendorId: vendorId,
    };

    // Role-based filtering for TVENDOR
    if (userRole === "TVENDOR") {
      // For TVENDOR, only show LRs that are annexed OR invoiced
      filters.OR = [
        { annexureId: { not: null } },
        { isInvoiced: true }
      ];
    } else {
      // For other roles, show only non-invoiced LRs (original behavior)
      filters.isInvoiced = false;
      filters.invoiceId = null;
    }

    // Date filter
    if (fromDate && toDate) {
      filters.outDate = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    } else if (fromDate) {
      filters.outDate = { gte: new Date(fromDate) };
    } else if (toDate) {
      filters.outDate = { lte: new Date(toDate) };
    }

    // Search
    if (search?.trim()) {
      const s = search.trim();
      filters.AND = [
        {
          OR: [
            { LRNumber: { contains: s } },
            { vehicleNo: { contains: s } },
            { vehicleType: { contains: s } },
            { origin: { contains: s } },
            { destination: { contains: s } },
            { tvendor: { name: { contains: s } } },
          ],
        },
      ];
    }

    // POD filter
    if (pod === true) {
      filters.podlink = { not: null };
      filters.AND = [...(filters.AND || []), { podlink: { not: "" } }];
    }

    // 1️⃣ Get DISTINCT fileNumbers
    const fileGroups = await prisma.lRRequest.findMany({
      where: filters,
      distinct: ["fileNumber"],
      select: { fileNumber: true },
      orderBy: {
        outDate: "desc",
      },
    });

    const totalFiles = fileGroups.length;
    const totalPages = Math.ceil(totalFiles / limit);

    // 2️⃣ Paginate based on file groups
    const paginatedFileNumbers = fileGroups
      .slice(skip, skip + limit)
      .map((f) => f.fileNumber);

    // 3️⃣ Fetch ALL LRs for those fileNumbers
    const data = await prisma.lRRequest.findMany({
      where: {
        ...filters,
        fileNumber: { in: paginatedFileNumbers },
      },
      include: {
        tvendor: { select: { id: true, name: true } },
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
        },
        Invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            refernceNumber: true,
            status: true
          }
        }
      },
      orderBy: { outDate: "desc" },
    });

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
      totalFiles,
      totalPages: Math.ceil(totalFiles / limit),
      currentPage: page,
    }
    // return {
    //   data,
    //   totalFiles,
    //   totalPages,
    //   currentPage: page,
    // };
  } catch (err) {
    console.error("❌ Error fetching LRs:", err);
    throw new Error("Failed to fetch lorry receipts");
  }
};


// export const getAllLRforVendorById = async ({
//   vendorId,
//   page = 1,
//   limit = 10,
//   search = "",
//   fromDate,
//   toDate,
//   pod,
// }: GetAllLRParams) => {
//   try {
//     const skip = (page - 1) * limit



//     const filters: any = {
//       tvendorId: vendorId,
//       isInvoiced: false,
//       invoiceId: null,
//     }

//     // POD filter

//     // 📅 Date filter
//     if (fromDate && toDate) {
//       filters.outDate = {
//         gte: new Date(fromDate),
//         lte: new Date(toDate),
//       }
//     } else if (fromDate) {
//       filters.outDate = { gte: new Date(fromDate) }
//     } else if (toDate) {
//       filters.outDate = { lte: new Date(toDate) }
//     }


//     if (search?.trim()) {
//       const searchTerm = search.trim()
//       filters.AND = [
//         {
//           OR: [
//             { LRNumber: { contains: searchTerm } },
//             { vehicleNo: { contains: searchTerm } },
//             { vehicleType: { contains: searchTerm } },
//             { origin: { contains: searchTerm } },
//             { destination: { contains: searchTerm } },
//             {
//               tvendor: {
//                 name: { contains: searchTerm },
//               },
//             },
//           ],
//         },
//       ]
//     }
//     if (pod === true) {
//       filters.podlink = { not: null }  

//       filters.AND = [
//         ...(filters.AND || []),
//         { podlink: { not: "" } },  
//       ]
//     }

//     // 🧮 Total count
//     const totalItems = await prisma.lRRequest.count({ where: filters })

//     // 📋 Fetch paginated data
//     const data = await prisma.lRRequest.findMany({
//       where: filters,
//       include: {
//         tvendor: { select: { id: true, name: true } },
//       },
//       skip,
//       take: limit,
//       orderBy: { outDate: "desc" },
//     })

//     // 🏭 Resolve warehouse names for origins (with caching)
//     const warehouseCache: Record<string, string> = {}

//     const enhancedData = await Promise.all(
//       data.map(async (item) => {
//         const originName = item.origin

//         if (originName && !warehouseCache[originName]) {
//           try {
//             const { warehouseName } = await BillToAddressByNameId(originName)
//             warehouseCache[originName] = warehouseName || originName
//           } catch (err) {
//             console.warn(`Failed to fetch warehouse name for ID: ${originName}`, err)
//             warehouseCache[originName] = originName
//           }
//         }

//         return {
//           ...item,
//           origin: warehouseCache[originName!] || originName,
//         }
//       })
//     )

//     return {
//       data: enhancedData,
//       totalItems,
//       totalPages: Math.ceil(totalItems / limit),
//       currentPage: page,
//     }
//   } catch (err) {
//     console.error("❌ Error fetching LRs:", err)
//     throw new Error("Failed to fetch lorry receipts")
//   }
// }




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
