

"use server"


export async function uploadUserImage(formData: FormData) {

    try {
        const userId = formData.get("userId") as string
        const file = formData.get("file") as File

        const path = `test-images/${userId}/${file.name}`

        return { success: true, path }

    } catch (error) {

        console.error("Error uploading user image:", error)

        return { success: false, error: "Failed to upload user image" }

    }
}
