import { prisma } from "@/lib/prisma"
import { getExtraCostDocumentByFileNumber } from "./pod"

export interface Annexure {
  id: string
  name: string
  fromDate: string
  toDate: string
  _count?: { LRRequest: number }
  groups?: any[]
}

export async function getAnnexures(): Promise<Annexure[]> {
  const res = await fetch("/api/lorries/annexures", { cache: "no-store" })
  if (!res.ok) throw new Error("Failed to fetch annexures")

  const data = await res.json()
  return Array.isArray(data) ? data : Array.isArray(data.annexures) ? data.annexures : []
}

export async function deleteAnnexure(id: string): Promise<{ unlinkedCount?: number }> {
  const res = await fetch(`/api/lorries/annexures/${id}/delete`, { method: "DELETE" })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Delete failed")
  return data
}

export async function validateAnnexure(rows: any[]): Promise<any> {
  const res = await fetch("/api/lorries/annexures/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ annexureData: rows }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Validation failed")
  return data
}

export async function saveAnnexure(payload: any): Promise<any> {
  const res = await fetch("/api/lorries/annexures/saveAnnexure", {
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

    // 2️⃣ GROUP LRs by fileNumber for priceSettled logic
    const fileGroup: Record<string, any[]> = {};
    lrs.forEach((lr) => {
      if (!fileGroup[lr.fileNumber]) fileGroup[lr.fileNumber] = [];
      fileGroup[lr.fileNumber].push(lr);
    });

    // 3️⃣ Validation Flags
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

    if (missingExtraCostDocs.length > 0) {
      throw new Error(
        `Missing Extra Cost Document for file(s): ${missingExtraCostDocs.join(", ")}`
      );
    }

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

    // 6️⃣ Generate Reference Number
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

    // 7️⃣ Create invoice
    const invoice = await prisma.invoice.create({
      data: {
        refernceNumber: refNo,
        invoiceDate: new Date(),
        vendorId,
        status: "DRAFT",
      },
    });

    // 8️⃣ Attach all LRs to invoice
    await prisma.lRRequest.updateMany({
      where: { annexureId },
      data: {
        isInvoiced: true,
        invoiceId: invoice.id,
      },
    });

    return {
      success: true,
      invoice,
    };
  } catch (err) {
    console.error("❌ Invoice Error:", err);
    return { error: err instanceof Error ? err.message : "Unknown error" };
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
