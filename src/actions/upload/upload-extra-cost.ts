"use server"

import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from "@/services/azure-blob";


export async function uploadExtraCost(
    formData: FormData,
    fileNumber: string,
    description: string,
    amount: number,
): Promise<{ success: boolean; url?: string; error?: string }> {
    try {
        const file = formData.get("file") as File
        if (!file) {
            return { success: false, error: "No file provided" }
        }

        // Generate unique file path using fileNumber and timestamp
        const timestamp = Date.now()
        const fileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_")
        const filePath = `extra-costs/${fileNumber}/${description}_${timestamp}_${fileName}`

        // Use the provided uploadAttachmentToAzure function
        const uploadUrl = await uploadAttachmentToAzure(filePath, formData)

        return {
            success: true,
            url: uploadUrl,
        }
    } catch (error) {
        console.error("Error uploading extra cost file:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to upload file",
        }
    }
}

export async function deleteExtraCostFile(url: string): Promise<void> {
    try {
        await deleteAttachmentFromAzure(url)
    } catch (error) {
        console.error("Error deleting extra cost file:", error)
        throw error
    }
}
