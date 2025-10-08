"use server"

import { prisma } from "@/lib/prisma" // adjust import path as needed
import { revalidatePath } from "next/cache"

export const uploadPodForLr = async ({
    lrNumber,
    podLink
}: {
    lrNumber: string
    podLink: string
}) => {
    try {
        // Validate inputs
        if (!lrNumber || lrNumber.trim() === "") {
            return { error: "LR Number is required" }
        }

        // Check if LR exists
        const existingLR = await prisma.lRRequest.findUnique({
            where: {
                LRNumber: lrNumber
            }
        })

        if (!existingLR) {
            return { error: "LR Number not found" }
        }

        // Update the POD link
        const LRData = await prisma.lRRequest.update({
            where: {
                LRNumber: lrNumber
            },
            data: {
                podlink: podLink || null,
            }
        })


        revalidatePath(`/lorries/${LRData.fileNumber}`)

        return {
            data: LRData.podlink,
            success: true
        }

    } catch (error) {
        console.error("Error in Upload POD:", error)

        if (error instanceof Error) {
            return { error: error.message }
        }

        return {
            error: "Something went wrong while uploading POD"
        }
    }
}
 
export const addQuotationCostWithAttachment = async ({
    fileNumber,
    settleCost,
    extraCost,
    attachmentUrl,
    descriptionForAttachment,
}: {
    fileNumber: string
    settleCost: string
    extraCost?: string
    attachmentUrl?: string
    descriptionForAttachment?: string
}) => {
    try {
        // Input validation
        if (!fileNumber) {
            return { error: 'Invalid or missing File number' }
        }
        if (!settleCost || isNaN(Number(settleCost))) {
            return { error: 'Invalid or missing settle cost; must be a valid number' }
        }
        if (extraCost && isNaN(Number(extraCost))) {
            return { error: 'Extra cost must be a valid number' }
        }

        const settleCostValue = Number(settleCost)
        const extraCostValue = extraCost ? Number(extraCost) : null

        // Update LRRequest with settleCost and extraCost
        await prisma.lRRequest.updateMany({
            where: { fileNumber },
            data: {
                priceSettled: settleCostValue,
                extraCost: extraCostValue,
            },
        })

        // Save attachment in Document table if provided
        if (attachmentUrl) {
            // Upsert document by linkedId = fileNumber
            await prisma.document.upsert({
                where: { linkedId: fileNumber },
                update: {
                    url: attachmentUrl,
                    description: descriptionForAttachment || undefined,
                    updatedAt: new Date(),
                },
                create: {
                    linkedId: fileNumber,
                    label: `Attachment for ${fileNumber}`,
                    url: attachmentUrl,
                    description: descriptionForAttachment || undefined,
                    entryBy: "system", // adjust if you have user info
                },
            })
        }

               revalidatePath(`/lorries/${fileNumber}`)

        return { message: "Cost and attachment updated successfully" }

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message }
        }
        console.error('Error in addQuotationCostWithAttachment:', error)
        return { error: "Something went wrong" }
    }
}
