"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auditCreate, auditUpdate } from "@/lib/audit-logger"
import type { ProfilePortalSource } from "./profile"

export type UpsertDocumentParams = {
    linkedId: string
    linkedCode: string
    url: string
    label: string
    description?: string
    entryBy: string
    source?: ProfilePortalSource
}

function getPortalPrefix(source: ProfilePortalSource = "transport") {
    return source === "vendor" ? "[Vendor Portal]" : "[Transport Portal]"
}

export async function upsertDocument(data: UpsertDocumentParams) {
    try {
        const { linkedId, linkedCode, url, label, description, entryBy, source = "transport" } = data

        const existingDocument = await prisma.document.findUnique({
            where: {
                linkedId_linkedCode: {
                    linkedId,
                    linkedCode,
                },
            },
        })

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

        if (existingDocument) {
            await auditUpdate(
                "Document",
                document.id,
                existingDocument,
                document,
                `${getPortalPrefix(source)} Replaced document ${label} for ${linkedId}`,
            )
        } else {
            await auditCreate(
                "Document",
                document,
                `${getPortalPrefix(source)} Uploaded document ${label} for ${linkedId}`,
                document.id,
            )
        }

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
