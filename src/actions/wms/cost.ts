"use server"

import { prisma } from "@/lib/prisma"
import { ConnectionPool } from "mssql"

const WMS_COST_MIN_DATE = "2025-05-31"
const WMS_REQUEST_TIMEOUT_MS = 60000
const WMS_CONNECTION_TIMEOUT_MS = 30000
const WMS_REFRESH_CONCURRENCY = 1

interface FileInput {
  fileNumber: string
}

interface FileUpdateResult {
  fileNumber: string
  price?: number
  status: "UPDATED" | "NOT_FOUND" | "NO_COST" | "ERROR"
  message: string
}

const createWmsPool = () =>
  new ConnectionPool({
    user: process.env.DB_USER_NAME || "app_dbadmin",
    password: process.env.DB_PASSWORD || "#@)#n%^$4?#?$",
    server: process.env.DB_HOST || "182.76.62.178",
    database: process.env.DB_1 || "NEWAWLDB",
    port: 1433,
    requestTimeout: WMS_REQUEST_TIMEOUT_MS,
    connectionTimeout: WMS_CONNECTION_TIMEOUT_MS,
    options: {
      encrypt: false,
      trustServerCertificate: true,
      requestTimeout: WMS_REQUEST_TIMEOUT_MS,
      connectTimeout: WMS_CONNECTION_TIMEOUT_MS,
    },
    pool: {
      max: 3,
      min: 0,
      idleTimeoutMillis: 30000,
    },
  })

async function getCostRecordByFileNumber(
  pool: ConnectionPool,
  fileNumber: string,
) {
  const request = pool.request()
  request.input("fileNumber", fileNumber)
  request.input("minDate", WMS_COST_MIN_DATE)

  const query = `
    ;WITH FileContext AS (
      SELECT TOP (1)
        M.Ref_no,
        M.WH,
        M.CustID
      FROM NEWAWLDB.dbo.tbl_MDN AS M WITH (NOLOCK)
      WHERE
        M.FileNo = @fileNumber
        AND M.CustID <> 'sberlc01'
        AND M.OutLRDate >= @minDate
        AND M.OutTransportBy = 'AWL'
      ORDER BY M.OutLRDate DESC
    )
    SELECT
      @fileNumber AS FileNo,
      (
        SELECT MAX(D.veh_cost)
        FROM NEWAWLDB.dbo.tbl_DN AS D WITH (NOLOCK)
        INNER JOIN FileContext AS FC
          ON FC.Ref_no = D.Ref_No
          AND FC.WH = D.WH
          AND FC.CustID = D.CustID
      ) AS veh_cost
  `

  const response = await request.query(query)
  const record = response.recordset?.[0]

  if (!record) {
    return undefined
  }

  return {
    veh_cost: record.veh_cost == null ? null : Number(record.veh_cost),
  }
}

async function getCostsByFileNumbers(fileNumbers: string[]) {
  const normalizedFileNumbers = Array.from(
    new Set(fileNumbers.map((fileNumber) => fileNumber?.trim()).filter(Boolean)),
  )

  const results = new Map<string, { veh_cost: number | null } | undefined>()

  if (!normalizedFileNumbers.length) {
    return results
  }

  const pool = createWmsPool()

  try {
    await pool.connect()

    for (let index = 0; index < normalizedFileNumbers.length; index += WMS_REFRESH_CONCURRENCY) {
      const chunk = normalizedFileNumbers.slice(index, index + WMS_REFRESH_CONCURRENCY)

      const chunkResults = await Promise.all(
        chunk.map(async (fileNumber) => [
          fileNumber,
          await getCostRecordByFileNumber(pool, fileNumber),
        ] as const),
      )

      for (const [fileNumber, record] of chunkResults) {
        results.set(fileNumber, record)
      }
    }

    return results
  } finally {
    await pool.close().catch(() => undefined)
  }
}

export const getCostByFileNumber = async (fileNumber: string) => {
  try {
    const normalizedFileNumber = fileNumber?.trim()

    if (!normalizedFileNumber) {
      return {
        success: false,
        message: "No file number provided.",
      }
    }

    const costsByFile = await getCostsByFileNumbers([normalizedFileNumber])
    const record = costsByFile.get(normalizedFileNumber)

    if (record === undefined) {
      return {
        success: false,
        message: `No record found for FileNumber: ${normalizedFileNumber} in WMS.`,
      }
    }

    if (!record?.veh_cost) {
      return {
        success: false,
        message: `Cost not found for FileNumber: ${normalizedFileNumber} in WMS.`,
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

export const updateOfferedPricesForFiles = async (files: FileInput[]) => {
  if (!Array.isArray(files) || files.length === 0) {
    return {
      success: false,
      message: "No file numbers provided.",
      results: [],
    }
  }

  const results: FileUpdateResult[] = []
  const normalizedFiles = Array.from(
    new Set(
      files
        .map(({ fileNumber }) => fileNumber?.trim())
        .filter((fileNumber): fileNumber is string => Boolean(fileNumber)),
    ),
  )

  const invalidFiles = files.filter(
    ({ fileNumber }) => !fileNumber || typeof fileNumber !== "string" || !fileNumber.trim(),
  )

  results.push(
    ...invalidFiles.map(({ fileNumber }) => ({
      fileNumber: String(fileNumber),
      status: "ERROR" as const,
      message: "Invalid or missing file number.",
    })),
  )

  if (!normalizedFiles.length) {
    return {
      success: false,
      message: "No valid file numbers available for refresh.",
      results,
    }
  }

  let costsByFile: Map<string, { veh_cost: number | null } | null | undefined>

  try {
    costsByFile = await getCostsByFileNumbers(normalizedFiles)
  } catch (err: any) {
    console.error("❌ Error fetching WMS costs in batch:", err)
    return {
      success: false,
      message: err?.message || "Failed to fetch offered prices from WMS.",
      results,
    }
  }

  for (const fileNumber of normalizedFiles) {
    try {
      const record = costsByFile.get(fileNumber)

      if (record === undefined) {
        results.push({
          fileNumber,
          status: "NO_COST",
          message: "No record found for this file number in WMS.",
        })
        continue
      }

      if (!record?.veh_cost) {
        results.push({
          fileNumber,
          status: "NO_COST",
          message: "No cost data found in WMS.",
        })
        continue
      }

      const vehCost = Number(record.veh_cost)
      if (isNaN(vehCost) || vehCost <= 0) {
        results.push({
          fileNumber,
          status: "NO_COST",
          message: `Invalid cost value (${record.veh_cost}) from WMS.`,
        })
        continue
      }

      const updated = await prisma.lRRequest.updateMany({
        where: { fileNumber },
        data: { priceOffered: vehCost },
      })

      if (updated.count === 0) {
        results.push({
          fileNumber,
          status: "NOT_FOUND",
          message: "No LRRequest found for this file number.",
        })
        continue
      }

      results.push({
        fileNumber,
        price: vehCost,
        status: "UPDATED",
        message: "Updated successfully.",
      })
    } catch (err: any) {
      console.error(`❌ Error updating fileNumber: ${fileNumber}`, err)
      results.push({
        fileNumber,
        status: "ERROR",
        message: err?.message || "Unexpected error occurred.",
      })
    }
  }

  const updatedCount = results.filter((r) => r.status === "UPDATED").length
  const failedCount = results.filter((r) => r.status !== "UPDATED").length

  return {
    success: updatedCount > 0,
    message: `Processed ${results.length} file(s): ${updatedCount} updated, ${failedCount} failed.`,
    results,
  }
}
