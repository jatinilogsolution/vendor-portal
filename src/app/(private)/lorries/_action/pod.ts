"use server"

import { getCustomSession } from "@/actions/auth.action"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export const uploadPodForLr = async ({
    lrNumber,
    podLink,
    fileNumber
}: {
    lrNumber: string
    podLink: string
    fileNumber: string

}) => {
    try {
        // Validate inputs
        if (!lrNumber || lrNumber.trim() === "") {
            return { error: "LR Number is required" }
        }

        // Check if LR exists
        const existingLR = await prisma.lRRequest.findUnique({
            where: {
                LRNumber: lrNumber,
                fileNumber: fileNumber
            }
        })

        if (!existingLR) {
            return { error: "LR Number not found" }
        }

        // Update the POD link
        const LRData = await prisma.lRRequest.update({
            where: {
                LRNumber: lrNumber,
                fileNumber: fileNumber

            },
            data: {
                podlink: podLink || null,
            }
        })


        revalidatePath(`/lorries/${LRData.fileNumber}`)


        // sendEmail({
        //     to:""
        // })
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
        const session = await getCustomSession()
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
        // const updatedLRs, =
        await prisma.lRRequest.updateMany({
            where: { fileNumber },
            data: {
                priceSettled: settleCostValue,
                extraCost: extraCostValue,
                remark: descriptionForAttachment
            },
        })

        // Save attachment in Document table if provided
        if (attachmentUrl) {
            await prisma.document.upsert({
                where: {
                    linkedId_linkedCode: {
                        linkedId: fileNumber,
                        linkedCode: "EXTRA_COST_ATTACHMENT"
                    }
                },
                update: {
                    url: attachmentUrl,
                    description: descriptionForAttachment || undefined,
                    updatedAt: new Date(),
                    entryBy: session.user.id
                },
                create: {
                    linkedId: fileNumber,
                    linkedCode: "EXTRA_COST_ATTACHMENT",
                    label: `Attachment for ${fileNumber}`,
                    url: attachmentUrl,
                    description: descriptionForAttachment || undefined,
                    entryBy: session.user.id

                },
            })
        }

        // --- Update corresponding Invoice totals ---
        // 1. Find all LRs with the same fileNumber that are linked to an invoice
        const lrsWithInvoice = await prisma.lRRequest.findMany({
            where: { fileNumber, invoiceId: { not: null } },
            select: {
                invoiceId: true,
                priceSettled: true,
                extraCost: true,
                remark: true
            },
        })

        const invoiceIds = [...new Set(lrsWithInvoice.map(lr => lr.invoiceId!))]

        for (const invoiceId of invoiceIds) {
            // Sum up all priceSettled + extraCost for LRs in this invoice
            const lrsForInvoice = lrsWithInvoice.filter(lr => lr.invoiceId === invoiceId)

            const subtotal = lrsForInvoice.reduce((sum, lr) => {
                return sum + (lr.priceSettled || 0) + (lr.extraCost || 0)
            }, 0)

            // Fetch invoice to calculate tax
            const invoice = await prisma.invoice.findUnique({ where: { id: invoiceId } })
            if (invoice) {
                const taxAmount = subtotal * (invoice.taxRate / 100)
                const grandTotal = subtotal + taxAmount

                // Update invoice totals
                await prisma.invoice.update({
                    where: { id: invoiceId },
                    data: {
                        subtotal,
                        taxAmount,
                        grandTotal,
                        updatedAt: new Date(),
                    },
                })
            }
        }

        revalidatePath(`/lorries/${fileNumber}`)

        return { message: "Cost, attachment, and invoice updated successfully" }

    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message }
        }
        console.error('Error in addQuotationCostWithAttachment:', error)
        return { error: "Something went wrong" }
    }
}



export const getExtraCostDocumentByFileNumber = async (fileNumber: string) => {

    try {
        if (!fileNumber || fileNumber.trim() === "") {
            return { error: "Attchement File id not found" }
        }

        const getFile = await prisma.document.findFirst({
            where: {
                linkedId: fileNumber,
                linkedCode: "EXTRA_COST_ATTACHMENT"
            },
            select: {
                url: true,
                description: true
            }
        })
        if (!getFile?.url) {
            return { success: false, message: "File not found" }
        }

        return {
            data: getFile,
            success: true
        }

    } catch (error) {
        console.error("Error in getExtraCostDocumentByFileNumber:", error)

        if (error instanceof Error) {
            return { success: false, message: error.message }
        }

        return {
            success: false,
            message: "Something went wrong while uploading POD"
        }
    }
}