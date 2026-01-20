"use server"

import { Address, User, Vendor } from "@/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from "@/services/azure-blob"
import { revalidateTag } from "next/cache"
import { auditUpdate } from "@/lib/audit-logger"
 
export async function getUserProfile(userId: string) {
  try {

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        Vendor: {
          include: {
            Address: true
          }
        },


      },
    })

    let documents: any[] = []
    if (user?.vendorId) {
      documents = await prisma.document.findMany({
        where: { linkedId: user.vendorId }
      })
    }

    return {
      user: user,
      vendor: user?.vendorId ? user?.Vendor : null,
      address: user?.vendorId ? user.Vendor?.Address[0] : null,
      documents
    }
  } catch (error) {
    console.error("[v0] Error fetching user profile:", error)
    return {
      user: null,
      vendor: null,
      address: null,
      documents: [],
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
) {
  try {
    // Validate input
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, error: "Invalid email format" }
    }

    if (data.phone && !/^[\d\s\-+()]+$/.test(data.phone)) {
      return { success: false, error: "Invalid phone format" }
    }

    // Get old user data for logging
    const oldUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, phone: true }
    });

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
    });

    // Log user profile update
    await auditUpdate(
      "User",
      userId,
      oldUser,
      { name: data.name, email: data.email, phone: data.phone },
      `Updated user profile for ${data.name || oldUser?.name}`
    );

    revalidateTag(`user-${userId}`, 'max');

    return { success: true, user: updatedUser }
  } catch (error) {
    console.error("[v0] Error updating user profile:", error)
    return { success: false, error: "Failed to update profile" }
  }
}

export async function updateVendorProfile(
  vendorId: string,
  data: Partial<Vendor>,
) {
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

    // Get old vendor data for logging
    const oldVendor = await prisma.vendor.findUnique({
      where: { id: vendorId },
      select: {
        name: true,
        contactEmail: true,
        contactPhone: true,
        gstNumber: true,
        panNumber: true,
        taxId: true,
        paymentTerms: true
      }
    });

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
    });

    // Log vendor profile update
    await auditUpdate(
      "Vendor",
      vendorId,
      oldVendor,
      data,
      `Updated vendor profile for ${data.name || oldVendor?.name}`
    );

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
    revalidateTag(`vendor-${vendorId}`, "max")

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

    // Get old address for logging
    const oldAddress = await prisma.address.findUnique({
      where: { vendorId },
      select: { line1: true, line2: true, city: true, state: true, postal: true, country: true }
    });

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
    });

    // Log address update/creation
    await auditUpdate(
      "Address",
      vendorId,
      oldAddress,
      data,
      oldAddress ? `Updated address for vendor ${vendorId}` : `Created address for vendor ${vendorId}`
    );

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
    revalidateTag(`address-${vendorId}`, "max")

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
    const path = `user/profile-images/${userId}/${file.name}`
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
