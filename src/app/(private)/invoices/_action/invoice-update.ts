// "use server";

// import { prisma } from "@/lib/prisma";
// import { cookies } from "next/headers";

// export const updateBillToAddress = async (invoiceId: string, billToId: string) => {
//   try {
//     // Get cookies
//     const cookieStore = await cookies(); // no await needed
//     const cookieHeader = cookieStore
//       .getAll()
//       .map(c => `${c.name}=${c.value}`)
//       .join("; ");

//     // Fetch warehouse address
//     const res = await fetch(
//       `${process.env.NEXT_PUBLIC_API_URL}/api/addresses/warehouse/${billToId}`,
//       {
//         headers: {
//           Cookie: cookieHeader,
//         },
//       }
//     );

//     if (!res.ok) {
//       return { error: "Address not found" };
//     }

//     const addressArr = await res.json();
//     if (!addressArr || !addressArr[0]) {
//       return { error: "No address returned from API" };
//     }

//     const addr = addressArr[0];

//     // Build formatted address dynamically without extra commas/spaces
//     const fields = [
//       addr.addressLine1,
//       addr.addressLine2,
//       addr.city,
//       addr.state,
//       addr.pinCode,
//       addr.country,
//     ];

//     const formattedAddress = fields
//       .filter(f => f && f.trim() !== "") // keep only non-empty fields
//       .map(f => f.trim()) // remove extra spaces
//       .join(", "); // join with comma

//     const updatedInvoice = await prisma.invoice.update({
//       where: { id: invoiceId },
//       data: {
//         billToId,
//         billTo: formattedAddress || "", // always update
//         billToGstin: addr.gstinNumber?.trim() || "", // remove extra spaces
//       },
//     });

//     return updatedInvoice;
//   } catch (err) {
//     console.error("Error in Updating Bill To Address:", err);
//     return { error: "Failed to update Bill to Address" };
//   }
// };
"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"

export const updateBillToAddress = async (invoiceId: string, billToId: string) => {
  try {
    // Get cookies
    const cookieStore = await cookies() // no await needed
    const cookieHeader = cookieStore
      .getAll()
      .map((c) => `${c.name}=${c.value}`)
      .join("; ")

    // Fetch warehouse address
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/addresses/warehouse/${billToId}`, {
      headers: {
        Cookie: cookieHeader,
      },
    })

    if (!res.ok) {
      return { error: "Address not found" }
    }

    const addressArr = await res.json()
    if (!addressArr || !addressArr[0]) {
      return { error: "No address returned from API" }
    }

    const addr = addressArr[0]

    // Build formatted address dynamically without extra commas/spaces
    const fields = [addr.addressLine1, addr.addressLine2, addr.city, addr.state, addr.pinCode, addr.country]

    const formattedAddress = fields
      .filter((f) => f && f.trim() !== "") // keep only non-empty fields
      .map((f) => f.trim()) // remove extra spaces
      .join(", ") // join with comma

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        billToId,
        billTo: formattedAddress || "", // always update
        billToGstin: addr.gstinNumber?.trim() || "", // remove extra spaces
      },
    })

    revalidatePath(`/invoices/${invoiceId}`)

    return updatedInvoice
  } catch (err) {
    console.error("Error in Updating Bill To Address:", err)
    return { error: "Failed to update Bill to Address" }
  }
}
