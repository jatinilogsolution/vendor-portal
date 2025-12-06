"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type UpsertDocumentParams = {
    linkedId: string
    linkedCode: string
    url: string
    label: string
    description?: string
    entryBy: string
}

export async function upsertDocument(data: UpsertDocumentParams) {
    try {
        const { linkedId, linkedCode, url, label, description, entryBy } = data

        const document = await prisma.document.upsert({
            where: {
                linkedId_linkedCode: {
                    linkedId,
                    linkedCode,
                },
            },
            update: {
                url,
                label,
                description,
                entryBy,
            },
            create: {
                linkedId,
                linkedCode,
                url,
                label,
                description,
                entryBy,
            },
        })

        revalidatePath("/profile")
        return { success: true, document }
    } catch (error) {
        console.error("Error upserting document:", error)
        return { success: false, error: "Failed to save document" }
    }
}

export async function getDocumentsByEntity(linkedId: string) {
    try {
        const documents = await prisma.document.findMany({
            where: {
                linkedId,
            },
        })
        return { success: true, documents }
    } catch (error) {
        console.error("Error fetching documents:", error)
        return { success: false, error: "Failed to fetch documents" }
    }
}
