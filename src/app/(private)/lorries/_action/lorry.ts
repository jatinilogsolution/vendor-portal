"use server"

import { BillToAddressByNameId } from "@/actions/wms/warehouse"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
// import { revalidatePath } from "next/cache"
import { cache } from "react"

export const getLRInfo = cache(async (fileNumber: string, userId?: string) => {
  try {
    // Check user role if userId is provided
    let userRole: string | null = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      userRole = user?.role || null;
    }

    // Build where clause based on role
    const whereClause: any = { fileNumber };

    // Role-based filtering for TVENDOR
    if (userRole === "TVENDOR") {
      whereClause.OR = [
        { annexureId: { not: null } },
        { isInvoiced: true }
      ];
    }

    const LRData = await prisma.lRRequest.findMany({
      where: whereClause,
      include: {
        tvendor: {
          include: {
            users: {
              select: {
                email: true,
                name: true,
                phone: true,
                image: true,
              },
            },
          },
        },
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
    })

    // 2️⃣ No results check
    if (!LRData || LRData.length === 0) {
      return { error: `No LR found for file number: ${fileNumber}` }
    }

    // 3️⃣ Replace `origin` with warehouse name
    const enrichedData = await Promise.all(
      LRData.map(async (lr) => {
        try {
          if (lr.origin) {
            const warehouseInfo = await BillToAddressByNameId(lr.origin)
            return {
              ...lr,
              origin: warehouseInfo.warehouseName || lr.origin,
              whId: lr.origin
            }
          }
          return lr
        } catch (err) {
          console.error(`Failed to fetch warehouse name for origin: ${lr.origin}`, err)
          return lr
        }
      })
    )

    // 4️⃣ Return final data
    return { data: enrichedData }
  } catch (error) {
    console.error("Error fetching document:", error)
    if (error instanceof Error) {
      return { error: error.message }
    }
    return { error: "Something went wrong" }
  }
})

export type LRData = Awaited<ReturnType<typeof getLRInfo>>["data"]





export const updateOfferedPriceForFileNo = async (

  fileNumber: string,
  newPrice: string

) => {
  try {


    await prisma.lRRequest.updateMany({
      where: {
        fileNumber: fileNumber
      },
      data: {
        priceOffered: Number(newPrice)
      }
    })


    // revalidatePath(`/lorries/[id]`)
    return { sucess: true, message: "Cost updated successfully" };
  } catch (e) {
    console.error("Error updating Cost:", e);
    return { sucess: false, message: "Failed to update Cost" };
  }
};



export async function setLrPrice({
  lrNumber,
  lrPrice,

  // extraCost = 0,
}: {
  lrNumber: string;
  lrPrice: number;
  // extraCost?: number;
  // pathToRevalidate?: string;
}) {
  try {
    // update LRRequest based on LRNumber
    const updatedLR = await prisma.lRRequest.update({
      where: { LRNumber: lrNumber },
      data: {
        lrPrice: lrPrice
        // priceSettled: settledPrice,
        // extraCost: extraCost,
      },
    });



    return { success: true, data: updatedLR };
  } catch (err: any) {
    console.error("Error Settling LR:", err);
    return { success: false, message: err.message };
  }
}
