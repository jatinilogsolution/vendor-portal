"use server"

import { Address, User, Vendor } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from "@/services/azure-blob"
import { revalidateTag } from "next/cache"

// Types matching your Prisma schema
 

// interface VendorProfile {
//   id: string
//   name: string
//   contactEmail?: string
//   contactPhone?: string
//   gstNumber?: string
//   panNumber?: string
//   profileCompleted: boolean
//   taxId?: string
//   paymentTerms?: string
//   isActive: boolean
//   createdAt: Date
// }

// interface AddressProfile {
//   id: string
//   line1: string
//   line2?: string
//   city: string
//   state?: string
//   postal?: string
//   country: string
//   vendorId: string
//   createdAt: Date
//   updatedAt: Date
// }

export async function getUserProfile(userId: string) 
{
  try {
 
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Vendor: {
            include:{
                Address: true
            }
        },
   
    
      },
    })

   

    return {
      user: user,
      vendor: user?.vendorId ? user?.Vendor : null,
      address: user?.vendorId ? user.Vendor?.Address[0] : null,
    }
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    return {
      user: null,
      vendor: null,
      address: null,
      error: "Failed to fetch profile data",
    }
  }
}

// Promise<{
//   success: boolean
//   user?: UserProfile
//   error?: string
// }> 
export async function updateUserProfile(
  userId: string,
  data: Partial<User>,
){
  try {
    // Validate input
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, error: "Invalid email format" }
    }

    if (data.phone && !/^[\d\s\-+()]+$/.test(data.phone)) {
      return { success: false, error: "Invalid phone format" }
    }

    // Replace with your actual database update
    // Example using Prisma:
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        name: data.name,
        email: data.email,
        phone: data.phone,
        updatedAt: new Date(),
      },
    })
 
    revalidateTag(`user-${userId}`,'max')

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("[v0] Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updateVendorProfile(
  vendorId: string,
  data: Partial<Vendor>,
){
  try {
    // Validate input
    if (data.gstNumber && !/^[A-Z0-9]{15}$/.test(data.gstNumber)) {
      return { success: false, error: "Invalid GST number format (must be 15 characters)" }
    }

    if (data.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber)) {
      return { success: false, error: "Invalid PAN number format" }
    }

    if (data.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contactEmail)) {
      return { success: false, error: "Invalid email format" }
    }

    // Replace with your actual database update
    // Example using Prisma:
    const updatedVendor = await prisma.vendor.update({
      where: { id: vendorId },
      data: {
        name: data.name,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        gstNumber: data.gstNumber,
        panNumber: data.panNumber,
        taxId: data.taxId,
        paymentTerms: data.paymentTerms,
      },
    })

    // TODO: Replace with actual database update
    // const updatedVendor: VendorProfile = {
    //   id: vendorId,
    //   name: data.name || "Acme Corporation",
    //   contactEmail: data.contactEmail,
    //   contactPhone: data.contactPhone,
    //   gstNumber: data.gstNumber,
    //   panNumber: data.panNumber,
    //   profileCompleted: data.profileCompleted ?? true,
    //   taxId: data.taxId,
    //   paymentTerms: data.paymentTerms,
    //   isActive: data.isActive ?? true,
    //   createdAt: new Date(),
    // }

    // Revalidate cache
    revalidateTag(`vendor-${vendorId}`,"max")

    return { success: true, vendor: updatedVendor }
  } catch (error) {
    console.error("[v0] Error updating vendor profile:", error)
    return { success: false, error: "Failed to update vendor profile" }
  }
}

export async function updateAddress(
  vendorId: string,
  data: Partial<Address>,
) {
  try {
    // Validate input
    if (!data.line1?.trim()) {
      return { success: false, error: "Address line 1 is required" }
    }

    if (!data.city?.trim()) {
      return { success: false, error: "City is required" }
    }

    if (!data.country?.trim()) {
      return { success: false, error: "Country is required" }
    }

    // Replace with your actual database update
    // Example using Prisma:
    const updatedAddress = await prisma.address.upsert({
      where: { vendorId },
      update: {
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postal: data.postal,
        country: data.country,
        updatedAt: new Date(),
      },
      create: {
        vendorId,
        line1: data.line1,
        line2: data.line2,
        city: data.city,
        state: data.state,
        postal: data.postal,
        country: data.country,
      },
    })

    // TODO: Replace with actual database upsert
    // const updatedAddress: AddressProfile = {
    //   id: data.id || "addr-123",
    //   line1: data.line1 || "123 Business Street",
    //   line2: data.line2,
    //   city: data.city || "New York",
    //   state: data.state,
    //   postal: data.postal,
    //   country: data.country || "USA",
    //   vendorId,
    //   createdAt: new Date(),
    //   updatedAt: new Date(),
    // }

    // Revalidate cache
    revalidateTag(`address-${vendorId}`,"max")

    return { success: true, address: updatedAddress }
  } catch (error) {
    console.error("[v0] Error updating address:", error)
    return { success: false, error: "Failed to update address" }
  }
}





 
  
export async function uploadUserImage(formData: FormData) {
  try {
    const userId = formData.get("userId") as string
    const file = formData.get("file") as File

    if (!file || !userId) {
      return { success: false, error: "Missing file or userId" }
    }

    // Fetch old image URL to delete later
    const user = await prisma.user.findUnique({ where: { id: userId } })
    const oldImage = user?.image

    // Upload new file to Azure
    const path = `profile-images/${userId}/${file.name}`
    const url = await uploadAttachmentToAzure(path, formData)

    // Update in DB
    await prisma.user.update({
      where: { id: userId },
      data: { image: url },
    })

    // Delete old one (if exists)
    if (oldImage) await deleteAttachmentFromAzure(oldImage)

    return { success: true, url }
  } catch (err: any) {
    console.error("Upload error:", err)
    return { success: false, error: err.message }
  }
}
