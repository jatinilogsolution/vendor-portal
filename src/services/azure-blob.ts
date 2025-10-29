"use server"

import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob"

// Load from environment variables
const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME
const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY
const container = process.env.AZURE_STORAGE_CONTAINER!
if (!accountName || !accountKey) {
  throw new Error("Azure Storage account name or key is not configured in environment variables")
}

// Create shared key credential and BlobServiceClient
const sharedKeyCredential = new StorageSharedKeyCredential(accountName, accountKey)
const blobServiceClient = new BlobServiceClient(`https://${accountName}.blob.core.windows.net`, sharedKeyCredential)

// Containers
// const container = "testvendorportal"


export async function uploadAttachmentToAzure(path: string, formData: FormData): Promise<string> {
  try {
    const file = formData.get("file") as File | null;
    // const title = formData.get("title") as string //pan gst etc
    // const email = formData.get("email") as string

    if (!file) throw new Error("No file found in FormData");
    const containerClient = blobServiceClient.getContainerClient(container)

    await containerClient.createIfNotExists({ access: "blob" })

    // const sanitizedTitle = title.replace(/[^a-zA-Z0-9]/g, "_")


    // const fileName = `${path}/${email}/${sanitizedTitle}_${file.name}`

    const blockBlobClient = containerClient.getBlockBlobClient(path)

    const arrayBuffer = await file.arrayBuffer()
    await blockBlobClient.uploadData(arrayBuffer, {
      blobHTTPHeaders: { blobContentType: file.type },
    })

    return blockBlobClient.url
  } catch (error) {
    console.error("Error uploading to Azure:", error)
    throw new Error("Failed to upload attachment")
  }
}

export async function deleteAttachmentFromAzure(url: string): Promise<void> {
  try {
    const containerClient = blobServiceClient.getContainerClient(container)

    const fileName = decodeURIComponent(url.split("/").slice(4).join("/"))

    if (fileName) {
      const blockBlobClient = containerClient.getBlockBlobClient(fileName)
      await blockBlobClient.deleteIfExists()
    }
  } catch (error) {
    console.error("Error deleting from Azure:", error)
  }
}
