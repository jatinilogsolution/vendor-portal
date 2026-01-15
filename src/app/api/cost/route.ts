import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/**
 * GET /api/cost?fileNumber=string
 */
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const fileNumber = searchParams.get("fileNumber")

        if (!fileNumber) {
            return NextResponse.json({ error: "fileNumber is required" }, { status: 400 })
        }

        const extraCosts = await prisma.extraCostList.findMany({
            where: { docNo: fileNumber },
            orderBy: { createdAt: "desc" },
        })

        // Fetch associated documents to get URLs
        const docIds = extraCosts.map(item => item.docId).filter(Boolean)
        const documents = await prisma.document.findMany({
            where: { id: { in: docIds } }
        })

        const itemsWithUrls = extraCosts.map(item => {
            const doc = documents.find(d => d.id === item.docId)
            return {
                ...item,
                url: doc?.url || ""
            }
        })

        return NextResponse.json(itemsWithUrls)
    } catch (error) {
        console.error("Error fetching extra costs:", error)
        return NextResponse.json({ error: "Internal server error" }, { status: 500 })
    }
}

/**
 * POST /api/cost
 * Body: {
 *   fileNumber: string,
 *   items: Array<{ description, amount, url }>,
 *   totalExtraCost: number
 * }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { fileNumber, items, totalExtraCost } = body

        if (!fileNumber || !Array.isArray(items)) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
        }

        // Start a transaction to save all extra costs and update LRRequests and AnnexureFileGroup
        const result = await prisma.$transaction(async (tx) => {
            // 1. Delete existing extra costs for this file number
            await tx.extraCostList.deleteMany({
                where: { docNo: fileNumber },
            })

            // 2. Create new extra cost records and corresponding Document records
            const createdCosts = await Promise.all(
                items.map(async (item: any) => {
                    const extraCost = await tx.extraCostList.create({
                        data: {
                            docNo: fileNumber,
                            description: item.description,
                            amount: item.amount,
                            docId: "", // Will update after document creation
                        },
                    })

                    // Create or update Document record
                    const doc = await tx.document.create({
                        data: {
                            label: `Extra Cost: ${item.description}`,
                            url: item.url || "",
                            entryBy: "SYSTEM",
                            description: `Extra cost for file ${fileNumber}`,
                            linkedId: extraCost.id,
                            linkedCode: "EXTRA_COST",
                        },
                    })

                    // Update extraCostList with the doc's ID (or URL if preferred, but ID is better)
                    return tx.extraCostList.update({
                        where: { id: extraCost.id },
                        data: { docId: doc.id },
                    })
                }),
            )

            // 3. Update all LRRequests with this fileNumber
            await tx.lRRequest.updateMany({
                where: { fileNumber: fileNumber },
                data: { extraCost: totalExtraCost },
            })

            // 4. Update the AnnexureFileGroup
            const updatedGroup = await tx.annexureFileGroup.updateMany({
                where: { fileNumber: fileNumber },
                data: { extraCost: totalExtraCost },
            })

            return {
                extraCosts: createdCosts,
                updatedCount: updatedGroup.count,
            }
        })

        return NextResponse.json(result, { status: 201 })
    } catch (error) {
        console.error("Error saving extra costs:", error)
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Internal server error" },
            { status: 500 },
        )
    }
}
