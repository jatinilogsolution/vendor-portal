"use server"

import { BillToAddressByNameId } from "@/actions/wms/warehouse"
import { prisma } from "@/lib/prisma"
import { cache } from "react"

export const getLRInfo = cache(async (fileNumber: string) => {
  try {

    const LRData = await prisma.lRRequest.findMany({
      where: { fileNumber },
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
