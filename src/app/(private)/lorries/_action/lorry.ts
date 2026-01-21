"use server";

import { BillToAddressByNameId } from "@/actions/wms/warehouse";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
// import { revalidatePath } from "next/cache"
import { cache } from "react";
import { auditUpdate } from "@/lib/audit-logger";
import { syncInvoiceFromAnnexure } from "./annexure";

export const getLRInfo = cache(async (fileNumber: string, userId?: string) => {
  try {
    // Check user role if userId is provided
    let userRole: string | null = null;
    if (userId) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { role: true },
      });
      userRole = user?.role || null;
    }

    // Build where clause based on role
    const whereClause: any = { fileNumber };

    // Role-based filtering for TVENDOR
    if (userRole === "TVENDOR") {
      whereClause.OR = [{ annexureId: { not: null } }, { isInvoiced: true }];
    }

    const LRData = await prisma.lRRequest.findMany({
      where: whereClause,
      include: {
        tvendor: {
          include: {
            users: {
              select: {
                email: true,
                name: true,
                phone: true,
                image: true,
              },
            },
          },
        },
        Invoice: {
          select: {
            id: true,
            invoiceNumber: true,
            refernceNumber: true,
            status: true,
          },
        },
        Annexure: {
          select: {
            id: true,
            name: true,
            fromDate: true,
            toDate: true,
          },
        },
        group: {
          select: {
            id: true,
            fileNumber: true,
            status: true,
            totalPrice: true,
            extraCost: true,
            remark: true,
            annexureId: true,
          },
        },
      },
    });

    // 2️⃣ No results check
    if (!LRData || LRData.length === 0) {
      return { error: `No LR found for file number: ${fileNumber}` };
    }

    // 3️⃣ Replace `origin` with warehouse name
    const enrichedData = await Promise.all(
      LRData.map(async (lr) => {
        try {
          if (lr.origin) {
            const warehouseInfo = await BillToAddressByNameId(lr.origin);
            return {
              ...lr,
              origin: warehouseInfo.warehouseName || lr.origin,
              whId: lr.origin,
            };
          }
          return lr;
        } catch (err) {
          console.error(
            `Failed to fetch warehouse name for origin: ${lr.origin}`,
            err,
          );
          return lr;
        }
      }),
    );

    // 4️⃣ Return final data
    return { data: enrichedData };
  } catch (error) {
    console.error("Error fetching document:", error);
    if (error instanceof Error) {
      return { error: error.message };
    }
    return { error: "Something went wrong" };
  }
});

export type LRData = Awaited<ReturnType<typeof getLRInfo>>["data"];

export const updateOfferedPriceForFileNo = async (
  fileNumber: string,
  newPrice: string,
) => {
  try {
    // Get old LR data for logging
    const oldLRs = await prisma.lRRequest.findMany({
      where: { fileNumber },
      select: { priceOffered: true, LRNumber: true },
    });

    await prisma.lRRequest.updateMany({
      where: {
        fileNumber: fileNumber,
      },
      data: {
        priceOffered: Number(newPrice),
      },
    });

    // Log price update
    await auditUpdate(
      "LRRequest",
      fileNumber,
      { priceOffered: oldLRs[0]?.priceOffered, fileNumber },
      { priceOffered: Number(newPrice), fileNumber },
      `Updated offered price to ₹${newPrice} for file ${fileNumber} (${oldLRs.length} LRs)`,
    );

    return { sucess: true, message: "Cost updated successfully" };
  } catch (e) {
    console.error("Error updating Cost:", e);
    return { sucess: false, message: "Failed to update Cost" };
  }
};

export async function setLrPrice({
  lrNumber,
  lrPrice,
}: {
  lrNumber: string;
  lrPrice: number;
}) {
  try {
    // Get old LR data for logging
    const oldLR = await prisma.lRRequest.findUnique({
      where: { LRNumber: lrNumber },
      select: { lrPrice: true, fileNumber: true },
    });

    // update LRRequest based on LRNumber
    const updatedLR = await prisma.lRRequest.update({
      where: { LRNumber: lrNumber },
      data: {
        lrPrice: lrPrice,
      },
    });

    // Log LR price change
    await auditUpdate(
      "LRRequest",
      lrNumber,
      { lrPrice: oldLR?.lrPrice },
      { lrPrice },
      `Updated LR price from ₹${oldLR?.lrPrice || 0} to ₹${lrPrice} for LR ${lrNumber}`,
    );

    // 🔗 SYNC LINKED INVOICE if LR is part of an annexure
    const lr = await prisma.lRRequest.findUnique({
      where: { LRNumber: lrNumber },
      select: { annexureId: true },
    });
    if (lr?.annexureId) {
      await syncInvoiceFromAnnexure(lr.annexureId);
    }

    return { success: true, data: updatedLR };
  } catch (err: any) {
    console.error("Error Settling LR:", err);
    return { success: false, message: err.message };
  }
}

/**
 * TADMIN/BOSS individual LR verification
 * Status can be: VERIFIED (external), WRONG (external), APPROVED (admin), REJECTED (admin), PENDING
 */
export async function updateLRVerificationStatus({
  lrNumber,
  status,
  remark,
  userId,
}: {
  lrNumber: string;
  status: "VERIFIED" | "WRONG" | "APPROVED" | "REJECTED" | "PENDING";
  remark?: string;
  userId: string;
}) {
  try {
    const lr = await prisma.lRRequest.findUnique({
      where: { LRNumber: lrNumber },
      include: { tvendor: true },
    });

    if (!lr) throw new Error("LR not found");

    const updatedLR = await prisma.lRRequest.update({
      where: { LRNumber: lrNumber },
      data: {
        status: status,
        remark: remark || lr.remark,
      },
    });

    // Get user info for audit
    const user = await prisma.user.findUnique({ where: { id: userId } });
    const roleLabel = user?.role || "System";

    // Status-specific audit messages
    const statusMessages: Record<string, string> = {
      VERIFIED: `marked as VERIFIED (external check passed)`,
      WRONG: `flagged as WRONG (external check failed)`,
      APPROVED: `approved by ${roleLabel}`,
      REJECTED: `rejected by ${roleLabel}`,
      PENDING: `reset to PENDING`,
    };

    // Audit log
    await auditUpdate(
      "LRRequest",
      lrNumber,
      { status: lr.status, remark: lr.remark },
      { status, remark },
      `LR ${lrNumber} ${statusMessages[status]}${remark ? `: ${remark}` : ""}`,
    );

    // If REJECTED or WRONG, post a public comment for visibility
    if ((status === "REJECTED" || status === "WRONG") && remark) {
      await prisma.workflowComment.create({
        data: {
          content: `LR ${lrNumber} ${status === "WRONG" ? "flagged as WRONG" : "rejected"}: ${remark}`,
          authorId: userId,
          authorRole: user?.role || "SYSTEM",
          annexureId: lr.annexureId,
          invoiceId: lr.invoiceId,
          isPrivate: false, // Public for vendor to see and fix
        },
      });
    }

    revalidatePath(`/lorries/annexure/${lr.annexureId}`);
    if (lr.invoiceId) revalidatePath(`/invoices/${lr.invoiceId}`);

    return { success: true, data: updatedLR };
  } catch (error) {
    console.error("Error in updateLRVerificationStatus:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to update verification status",
    };
  }
}
