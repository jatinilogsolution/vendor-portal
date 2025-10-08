// "use server"
// import { Invoice } from "@/generated/prisma";
// import { prisma } from "@/lib/prisma"; // adjust path

// export const getInvoices = async (): Promise<(Invoice & { vendor: { name: string } })[]> => {
//     try {
//         const invoices = await prisma.invoice.findMany({
//             include: { vendor: true },
//             orderBy: { invoiceDate: "desc" },
//         });

//         if (!invoices || invoices.length === 0) {
//             console.warn("No invoices found in the database.");
//             return [];
//         }

//         return invoices;
//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         throw new Error("Failed to fetch invoices. Please try again later.");
//     }
// };



// export const getInvoiceById = async ({ id }: { id: string }) => {
//     try {
//         const invoice = await prisma.invoice.findUnique({
//             where: { id: id },
//             include: {
//                 vendor: true, // include vendor details
//                 LRRequest: true, // include all linked LRs
//             },
//         });

//         if (!invoice) {
//             console.warn("No invoices found in the database.");
//             return { error: "No invoices found" };
//         }

//         return { data: invoice };
//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         return { error: "Error fetching invoices" };

//     }
// };



// export const getInvoiceOnlyById = async ({ id }: { id: string }) => {

//     try {
//         const invoice = await prisma.invoice.findUnique({
//             where: { id: id },
//         });

//         if (!invoice) {
//             console.warn("No invoices found in the database.");
//             return { error: "No invoices found" };
//         }

//         return { data: invoice };
//     } catch (error) {
//         console.error("Error fetching invoices:", error);
//         return { error: "Error fetching invoices" };

//     }

// }
"use server"
import type { Invoice } from "@/generated/prisma"
import { prisma } from "@/lib/prisma" // adjust path

export const getInvoices = async (): Promise<(Invoice & { vendor: { name: string } })[]> => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: { vendor: true },
      orderBy: { invoiceDate: "desc" },
    })

    if (!invoices || invoices.length === 0) {
      console.warn("No invoices found in the database.")
      return []
    }

    return invoices
  } catch (error) {
    console.error("Error fetching invoices:", error)
    throw new Error("Failed to fetch invoices. Please try again later.")
  }
}

export const getInvoiceById = async ({ id }: { id: string }) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
      include: {
        vendor: true, // include vendor details
        LRRequest: true, // include all linked LRs
      },
    })

    if (!invoice) {
      console.warn("No invoices found in the database.")
      return { error: "No invoices found" }
    }

    return { data: invoice }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return { error: "Error fetching invoices" }
  }
}

export const getInvoiceOnlyById = async ({ id }: { id: string }) => {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: id },
    })

    if (!invoice) {
      console.warn("No invoices found in the database.")
      return { error: "No invoices found" }
    }

    return { data: invoice }
  } catch (error) {
    console.error("Error fetching invoices:", error)
    return { error: "Error fetching invoices" }
  }
}
