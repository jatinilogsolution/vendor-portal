"use server"

import { getAWLWMSDBPOOL } from "@/services/db"
import { prisma } from "@/lib/prisma"




// export const getCostByFileNumber = async (fileNumber: string) => {


//     try {


//         const pool = await getAWLWMSDBPOOL()

//         const request = pool.request();
//         request.input("fileNumber", fileNumber);
 
//          const query = "SELECT distinct M.FileNo, M.OutLRNo, M.City, M.OutTPT, M.WH, M.OutLRDate, M.OutVehType, M.OutVehNo, M.PartyName, D.veh_cost FROM NEWAWLDB.dbo.tbl_MDN AS M WITH (NOLOCK) LEFT JOIN ( SELECT Ref_No, WH, CustID, MAX(veh_cost) AS veh_cost  FROM NEWAWLDB.dbo.tbl_DN WITH (NOLOCK) GROUP BY Ref_No, WH, CustID ) AS D ON D.Ref_No = M.Ref_no AND D.WH = M.WH AND D.CustID = M.CustID WHERE M.CustID <> 'sberlc01' AND M.OutLRDate >= '2025-07-01' and m.OutTransportBy='AWL' AND M.FileNo = @fileNumber"
//         const response = await request.query(query)
//         console.log("Cost Data", JSON.stringify(response.recordset[0]))
//         if (response.recordset[0].veh_cost === null || response.recordset[0].veh_cost === "") {
//             return {
//                 success: false,
//                 message: `Cost not found for FileNumber: ${fileNumber} in WMS`,
//             }
//         }
//         return {
//             success: true,
//             message: "Cost retrived sucessfully",
//             price: response.recordset[0].veh_cost
//         }
//     } catch (e) {
//         console.error("Error in getCostByFileNumber", e)
//         throw new Error("Something went wrong")
//         // return {
//         //     success: false,
//         //     message: "Something went wrong"
//         // }
//     }
// }

 

export const getCostByFileNumber = async (fileNumber: string) => {
  try {
    const pool = await getAWLWMSDBPOOL()
    const request = pool.request()
    request.input("fileNumber", fileNumber)

    const query = `
      SELECT DISTINCT 
        M.FileNo, M.OutLRNo, M.City, M.OutTPT, M.WH, M.OutLRDate, 
        M.OutVehType, M.OutVehNo, M.PartyName, D.veh_cost
      FROM NEWAWLDB.dbo.tbl_MDN AS M WITH (NOLOCK)
      LEFT JOIN (
        SELECT Ref_No, WH, CustID, MAX(veh_cost) AS veh_cost
        FROM NEWAWLDB.dbo.tbl_DN WITH (NOLOCK)
        GROUP BY Ref_No, WH, CustID
      ) AS D 
      ON D.Ref_No = M.Ref_no 
      AND D.WH = M.WH 
      AND D.CustID = M.CustID
      WHERE 
        M.CustID <> 'sberlc01' 
        AND M.OutLRDate >= '2025-05-31'
        AND M.OutTransportBy = 'AWL' 
        AND M.FileNo = @fileNumber
    `

    const response = await request.query(query)
    const record = response.recordset?.[0]

    console.log("WMS Cost Query Result:", JSON.stringify(record))

    if (!record) {
      return {
        success: false,
        message: `No record found for FileNumber: ${fileNumber} in WMS.`,
      }
    }

    if (!record.veh_cost) {
      return {
        success: false,
        message: `Cost not found for FileNumber: ${fileNumber} in WMS.`,
      }
    }

    return {
      success: true,
      message: "Cost retrieved successfully.",
      price: record.veh_cost,
    }
  } catch (e) {
    console.error("Error in getCostByFileNumber:", e)
    return {
      success: false,
      message: "Something went wrong while fetching cost from WMS.",
    }
  }
}


 

 
interface FileInput {
  fileNumber: string
}

interface FileUpdateResult {
  fileNumber: string
  price?: number
  status: "UPDATED" | "NOT_FOUND" | "NO_COST" | "ERROR"
  message: string
}

/**
 * Updates priceOffered in LRRequest for all provided file numbers
 */
export const updateOfferedPricesForFiles = async (files: FileInput[]) => {
  if (!Array.isArray(files) || files.length === 0) {
    return {
      success: false,
      message: "No file numbers provided.",
      results: [],
    }
  }

  const results: FileUpdateResult[] = []

  // Limit concurrency (max 5 at once)
  const CONCURRENCY_LIMIT = 5
  const chunks = chunkArray(files, CONCURRENCY_LIMIT)

  for (const chunk of chunks) {
    const chunkResults = await Promise.all(
      chunk.map(async ({ fileNumber }) => {
        if (!fileNumber || typeof fileNumber !== "string") {
          return {
            fileNumber: String(fileNumber),
            status: "ERROR" as const,
            message: "Invalid or missing file number.",
          }
        }

        try {
          // Step 1: Get cost from WMS
          const costResponse = await getCostByFileNumber(fileNumber)

          if (!costResponse.success || !costResponse.price) {
            return {
              fileNumber,
              status: "NO_COST" as const,
              message: costResponse.message ?? "No cost data found in WMS.",
            }
          }

          const vehCost = Number(costResponse.price)
          if (isNaN(vehCost) || vehCost <= 0) {
            return {
              fileNumber,
              status: "NO_COST" as const,
              message: `Invalid cost value (${costResponse.price}) from WMS.`,
            }
          }

          // Step 2: Update LRRequest
          const updated = await prisma.lRRequest.updateMany({
            where: { fileNumber },
            data: { priceOffered: vehCost },
          })

          if (updated.count === 0) {
            return {
              fileNumber,
              status: "NOT_FOUND" as const,
              message: "No LRRequest found for this file number.",
            }
          }

          return {
            fileNumber,
            price: vehCost,
            status: "UPDATED" as const,
            message: "Updated successfully.",
          }
        } catch (err: any) {
          console.error(`❌ Error updating fileNumber: ${fileNumber}`, err)
          return {
            fileNumber,
            status: "ERROR" as const,
            message: err?.message || "Unexpected error occurred.",
          }
        }
      })
    )

    results.push(...chunkResults)
  }

  const updatedCount = results.filter((r) => r.status === "UPDATED").length
  const failedCount = results.filter((r) => r.status !== "UPDATED").length

  return {
    success: true,
    message: `Processed ${results.length} file(s): ${updatedCount} updated, ${failedCount} failed.`,
    results,
  }
}

/**
 * Utility: Split an array into chunks of N elements
 */
function chunkArray<T>(array: T[], size: number): T[][] {
  const result: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size))
  }
  return result
}
