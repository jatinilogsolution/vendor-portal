"use server"
import { prisma } from "@/lib/prisma"
import { getExtraCostDocumentByFileNumber } from "./pod"
import { UserRoleEnum } from "@/utils/constant"

export interface Annexure {
  id: string
  name: string
  fromDate: string
  toDate: string
  _count?: { LRRequest: number }
  groups?: any[]
  isInvoiced?: boolean
  invoiceDetails?: {
    id: string
    refernceNumber: string
    invoiceNumber?: string
    status: string
  } | null
}


export async function getAnnexures(vendorId?: string): Promise<Annexure[]> {
  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/api/lorries/annexures`);

  if (vendorId) {
    url.searchParams.set("vendorId", vendorId);
  }

  const res = await fetch(url.toString(), { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch annexures")

  const data = await res.json()
  return Array.isArray(data) ? data : Array.isArray(data.annexures) ? data.annexures : []
}

export async function deleteAnnexure(id: string): Promise<{ unlinkedCount?: number }> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lorries/annexures/${id}/delete`, { method: "DELETE" })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Delete failed")
  return data
}

export async function validateAnnexure(rows: any[], currentVendorId?: string, userRole?: string): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lorries/annexures/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ annexureData: rows, currentVendorId, userRole }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Validation failed")
  return data
}

export async function saveAnnexure(payload: any): Promise<any> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lorries/annexures/saveAnnexure`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Save failed")
  return data
}


export const generateInvoiceFromAnnexure = async (annexureId: string) => {
  try {
    if (!annexureId) throw new Error("Annexure ID is required");

    // 1️⃣ Fetch all LR belonging to the annexure
    const lrs = await prisma.lRRequest.findMany({
      where: { annexureId },
      include: { tvendor: true },
    });

    if (lrs.length === 0) throw new Error("No LRs found for this annexure");

    const vendorId = lrs[0].tvendorId;
    if (!vendorId) throw new Error("Vendor ID missing on LR records");

    // 2️⃣ CHECK FOR MISSING LRs PER FILE
    const fileNumbers = [...new Set(lrs.map(lr => lr.fileNumber).filter(Boolean))];
    const missingLRsPerFile: { fileNumber: string; missing: string[] }[] = [];

    for (const fileNumber of fileNumbers) {
      const allLRsInFile = await prisma.lRRequest.findMany({
        where: { fileNumber },
        select: { LRNumber: true, annexureId: true }
      });

      const lrsInAnnexure = allLRsInFile.filter(lr => lr.annexureId === annexureId);
      const lrsNotInAnnexure = allLRsInFile.filter(lr => !lr.annexureId || lr.annexureId !== annexureId);

      if (lrsNotInAnnexure.length > 0) {
        missingLRsPerFile.push({
          fileNumber,
          missing: lrsNotInAnnexure.map(lr => lr.LRNumber)
        });
      }
    }

    if (missingLRsPerFile.length > 0) {
      const errorDetails = missingLRsPerFile
        .map(f => `${f.fileNumber}: ${f.missing.join(", ")}`)
        .join("; ");
      throw new Error(`Incomplete files detected. Missing LRs: ${errorDetails}. Add all LRs from each file before submitting.`);
    }

    // 3️⃣ GROUP LRs by fileNumber for priceSettled logic
    const fileGroup: Record<string, any[]> = {};
    lrs.forEach((lr) => {
      if (!fileGroup[lr.fileNumber]) fileGroup[lr.fileNumber] = [];
      fileGroup[lr.fileNumber].push(lr);
    });

    // 4️⃣ Validation Flags
    const missingPodLinks: string[] = [];
    const missingExtraCostDocs: string[] = [];

    // 4️⃣ VALIDATION LOOP
    for (const fileNo in fileGroup) {
      const lrList = fileGroup[fileNo];

      // --- Sum of lrPrice = priceSettled ---
      const totalPrice = lrList.reduce(
        (acc, lr) => acc + (lr.lrPrice || 0),
        0
      );

      // Update priceSettled (in-memory)
      lrList.forEach((lr) => (lr.priceSettled = totalPrice));

      // --- Extra cost validation ---
      const anyHasExtraCost = lrList.some((lr) => lr.extraCost && lr.extraCost > 0);

      if (anyHasExtraCost) {
        const { data } = await getExtraCostDocumentByFileNumber(fileNo);

        if (!data?.url) {
          missingExtraCostDocs.push(fileNo);
        }
      }

      // --- POD validation ---
      lrList.forEach((lr) => {
        if (!lr.podlink) missingPodLinks.push(lr.LRNumber);
      });
    }

    // ❌ Throw Errors if validations fail
    if (missingPodLinks.length > 0) {
      throw new Error(
        `Missing POD link for LR: ${missingPodLinks.join(", ")}`
      );
    }

    // if (missingExtraCostDocs.length > 0) {
    //   throw new Error(
    //     `Missing Extra Cost Document for file(s): ${missingExtraCostDocs.join(", ")}`
    //   );
    // }

    // 5️⃣ Everything is valid → Update LRs to DRAFT + update priceSettled
    await prisma.$transaction(
      Object.keys(fileGroup).map((fileNo) =>
        prisma.lRRequest.updateMany({
          where: { fileNumber: fileNo, annexureId },
          data: {
            status: "DRAFT",
            priceSettled: fileGroup[fileNo].reduce(
              (acc, lr) => acc + (lr.lrPrice || 0),
              0
            ),
          },
        })
      )
    );

    // 6️⃣ Check for existing invoice
    let existingInvoice = await prisma.invoice.findFirst({
      where: { annexureId: annexureId }
    });

    const vendor = await prisma.vendor.findFirst({
        where: { id: vendorId },
        include: { users: { take: 1 } }
    });

    const authorId = vendor?.users[0]?.id || "";
    let invoice: any;

    if (existingInvoice) {
      // 7️⃣ Update existing invoice
      invoice = await prisma.invoice.update({
        where: { id: existingInvoice.id },
        data: {
          status: "DRAFT",
          invoiceDate: new Date(),
          // We keep the same refernceNumber as requested by user
        },
      });
    } else {
      // 7️⃣ Generate Reference Number (only if new)
      const now = new Date();
      const refNo = `${vendorId.substring(0, 3).toUpperCase()}-${now.getFullYear()}${(
        now.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}-${Math.floor(
          Math.random() * 1000
        )
          .toString()
          .padStart(3, "0")}`;

      // 8️⃣ Create new invoice
      invoice = await prisma.invoice.create({
        data: {
          refernceNumber: refNo,
          invoiceDate: new Date(),
          vendorId,
          status: "DRAFT",
          annexureId: annexureId, // Link to source annexure
        },
      });
    }

    // 9️⃣ Attach all LRs to invoice
    await prisma.lRRequest.updateMany({
      where: { annexureId },
      data: {
        isInvoiced: true,
        invoiceId: invoice.id,
      },
    });

    // 💬 CHAT INTEGRATION: Post update message if reused
    if (invoice && authorId) {
       const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoice.id}`;
       const statusText = existingInvoice ? "UPDATED" : "GENERATED";

       await prisma.workflowComment.create({
          data: {
              content: `[SYSTEM] Invoice ${statusText} | Reference: ${invoice.refernceNumber} | Status: DRAFT. [View Document](${invoiceLink})`,
              authorId: authorId,
              authorRole: UserRoleEnum.TVENDOR,
              annexureId: annexureId,
              invoiceId: invoice.id,
              isPrivate: false
          }
      });
    }

    return {
      success: true,
      invoice,
    };
  } catch (err) {
    console.error("❌ Invoice Error:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
};

export const syncInvoiceFromAnnexure = async (annexureId: string) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { annexureId },
      include: { 
        LRRequest: {
          select: {
            lrPrice: true,
            extraCost: true
          }
        }
      }
    });

    if (!invoice) return { success: false, message: "No linked invoice found" };

    const subtotal = invoice.LRRequest.reduce((acc, lr) => acc + (lr.lrPrice || 0), 0);
    const totalExtra = invoice.LRRequest.reduce((acc, lr) => acc + (lr.extraCost || 0), 0);
    const taxAmount = (subtotal + totalExtra) * (invoice.taxRate / 100);
    const grandTotal = subtotal + totalExtra + taxAmount;

    await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        subtotal,
        totalExtra,
        taxAmount,
        grandTotal,
      }
    });

    return { success: true };
  } catch (err) {
    console.error("❌ Sync Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
};




export async function validateFileAdd(
  lrNumber: string,
  annexureId: string
) {
  // 1. LR exists?
  const lr = await prisma.lRRequest.findUnique({
    where: { LRNumber: lrNumber },
  });

  if (!lr) return { error: "LR not found in database." };

  // 2. Has fileNumber?
  const fileNo = lr.fileNumber;
  if (!fileNo) return { error: "This LR has no file number assigned." };

  // 3. Fetch all LRs belonging to this file
  const fileLRs = await prisma.lRRequest.findMany({
    where: { fileNumber: fileNo },
    orderBy: { LRNumber: "asc" },
  });

  // 4. If any LR belongs to another annexure → block
  const isInOtherAnnexure = fileLRs.find(
    (x) => x.annexureId && x.annexureId !== annexureId
  );

  if (isInOtherAnnexure) {
    const annexure = await prisma.annexure.findUnique({
      where: { id: isInOtherAnnexure.annexureId! },
    });

    return {
      error: `This file is already linked with Annexure "${annexure?.name}". Cannot attach.`,
    };
  }

  // 5. If LR already in THIS annexure → block adding again
  const alreadyIncluded = fileLRs.find(
    (x) => x.annexureId === annexureId
  );

  if (alreadyIncluded) {
    return {
      error: `This file is already attached to current annexure.`,
    };
  }

  // 6. If any LR is invoiced → block
  const invoiced = fileLRs.find((x) => x.isInvoiced);

  if (invoiced) {
    return {
      error: `LR ${invoiced.LRNumber} is already invoiced. Cannot attach this file.`,
    };
  }

  // 7. Sanity check: file is complete (no missing LRs)
  // you can add extra validation if required

  return {
    success: true,
    fileNumber: fileNo,
    totalLRs: fileLRs.length,
    lrs: fileLRs.map((lr) => ({
      id: lr.id,
      lrNumber: lr.LRNumber,
      price: lr.lrPrice ?? null,
      extra: lr.extraCost ?? null,
      remark: lr.remark ?? "",
    })),
  };
}

/**
 * Generate an Annexure for an existing standalone Invoice
 */
export async function generateAnnexureFromInvoice(invoiceId: string, vendorId: string) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { LRRequest: true }
    });

    if (!invoice) throw new Error("Invoice not found");
    if (invoice.annexureId) throw new Error("This invoice already has an associated Annexure");
    if (invoice.LRRequest.length === 0) throw new Error("No LRs found for this invoice to generate an Annexure");

    const now = new Date();
    const annexureName = `Annexure for ${invoice.invoiceNumber || invoice.refernceNumber}`;

    const annexure = await prisma.annexure.create({
      data: {
        name: annexureName,
        status: "DRAFT",
        fromDate: new Date(), // Defaulting to now, might need refinement
        toDate: new Date(),
        vendorId: vendorId,
        LRRequest: {
          connect: invoice.LRRequest.map(lr => ({ id: lr.id }))
        }
      }
    });

    // Link Invoice to Annexure
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: { annexureId: annexure.id }
    });

    // Create File Group for the new Annexure (Basic implementation)
    // Grouping LRs by fileNumber if they have one
    const fileNumbers = [...new Set(invoice.LRRequest.map(lr => lr.fileNumber).filter(Boolean))];
    
    for (const [index, fileNo] of fileNumbers.entries()) {
      const group = await prisma.annexureFileGroup.create({
        data: {
          fileNumber: fileNo as string,
          status: "PENDING",
          annexureId: annexure.id,
          // Update LRs to this group
        }
      });

      await prisma.lRRequest.updateMany({
        where: { fileNumber: fileNo as string, invoiceId: invoiceId },
        data: { groupId: group.id, annexureId: annexure.id }
      });
    }

    // 💬 CHAT INTEGRATION
    await prisma.workflowComment.create({
        data: {
            content: `Annexure generated from existing Invoice. Name: ${annexureName}`,
            authorId: vendorId,
            authorRole: "TVENDOR",
            annexureId: annexure.id,
            invoiceId: invoiceId,
            isPrivate: false
        }
    });

    return { success: true, annexureId: annexure.id };
  } catch (err) {
    console.error("❌ Generate Annexure Error:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
  }
}
