"use server";

import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { sendManualEmail } from "@/services/mail";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Send a manual notification (Email)
 */
/**
 * Send a manual notification (Email)
 */
export async function sendManualNotification({
  to, // Can be comma-separated or a single email
  recipientId,
  title,
  description,
  type,
  path,
  notifyInternal, // Legacy for Vendors
  notifyBoss,
  notifyTAdmin,
  notifyVendor, // Notifies all users linked to the same vendor as initialRecipientId
  extraEmails,
}: {
  to?: string;
  recipientId?: string;
  title: string;
  description: string;
  type: string;
  path?: string;
  notifyInternal?: boolean;
  notifyBoss?: boolean;
  notifyTAdmin?: boolean;
  notifyVendor?: boolean;
  extraEmails?: string;
}) {
  try {
    const { user: currentUser } = await getCustomSession();

    if (
      !currentUser ||
      ![UserRoleEnum.BOSS, UserRoleEnum.TADMIN, UserRoleEnum.TVENDOR].includes(
        currentUser.role as any,
      )
    ) {
      throw new Error(
        "Unauthorized. Insufficient permissions to send notifications.",
      );
    }

    const toList: string[] = [];
    const ccList: string[] = [];

    // 1. Add specific to email if provided -> Main Recipients (TO)
    if (to) {
      to.split(",").forEach((email) => {
        if (email.trim()) toList.push(email.trim());
      });
    }

    // 2. Add extra emails if provided -> Secondary Recipients (CC)
    if (extraEmails) {
      extraEmails.split(",").forEach((email) => {
        if (email.trim()) ccList.push(email.trim());
      });
    }

    // 3. Automated internal notification -> CC
    if (notifyInternal) {
      const internalUsers = await prisma.user.findMany({
        where: {
          role: { in: [UserRoleEnum.BOSS, UserRoleEnum.TADMIN] as any },
        },
        select: { email: true },
      });
      internalUsers.forEach((u) => {
        if (u.email) ccList.push(u.email);
      });
    }

    // 4. Role-based Notifications -> CC
    if (notifyBoss) {
      const bUsers = await prisma.user.findMany({
        where: { role: UserRoleEnum.BOSS as any },
        select: { email: true },
      });
      bUsers.forEach((u) => u.email && ccList.push(u.email));
    }

    if (notifyTAdmin) {
      const tUsers = await prisma.user.findMany({
        where: { role: UserRoleEnum.TADMIN as any },
        select: { email: true },
      });
      tUsers.forEach((u) => u.email && ccList.push(u.email));
    }

    if (notifyVendor && recipientId) {
      // Find the vendor linked to this recipient (or user directly if they are a vendor)
      const recUser = await prisma.user.findUnique({
        where: { id: recipientId },
        select: { vendorId: true },
      });

      if (recUser?.vendorId) {
        const vendorUsers = await prisma.user.findMany({
          where: { vendorId: recUser.vendorId },
          select: { email: true },
        });
        vendorUsers.forEach((u) => u.email && ccList.push(u.email));
      }
    }

    // Consolidate calls
    // If To List is empty but we have CCs, we should probably move at least one CC to To
    // or just pass them as CC and let sendManualEmail handle it (it supports array).
    // However, usually it's better to have a To.
    if (toList.length === 0 && ccList.length > 0) {
      // Strategy: If no explicit TO is defined, treat the first CC group as TO?
      // Or just leave it.
      // The user said: "makeing main once in to and other in cc betterly"
      // If the user didn't specify 'to', then maybe the 'notifyBoss' IS the main recipient.
      // Let's perform a shift if toList is empty.
      const primary = ccList.shift();
      if (primary) toList.push(primary);
    }

    // Note: sendManualEmail internal cleaning will handle duplicates and the "ABC@xyz.com" removal.

    const result = await sendManualEmail(
      toList,
      recipientId || null,
      {
        title,
        description,
        type,
        fromUser: currentUser.name || currentUser.email || "System User",
      },
      ccList,
    );

    if (path) {
      revalidatePath(path);
    }

    return {
      success: result.success,
      message: result.success
        ? "Notification sent successfully"
        : "Failed to send notification",
    };
  } catch (error) {
    console.error("Error in sendManualNotification:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to send notification",
    };
  }
}

/**
 * Generate a source Annexure from an existing linked Invoice (Legacy support)
 */
export async function createAnnexureFromExistingInvoice(invoiceId: string) {
  try {
    const { user } = await getCustomSession();

    if (!user) throw new Error("Unauthorized.");

    const isAuthorized = [
      UserRoleEnum.BOSS,
      UserRoleEnum.TADMIN,
      UserRoleEnum.TVENDOR,
    ].includes(user.role as any);
    if (!isAuthorized) throw new Error("Unauthorized.");

    // 1. Get invoice and its LRs
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        LRRequest: true,
        vendor: true,
      },
    });

    if (!invoice) throw new Error("Invoice not found");
    if (invoice.annexureId)
      throw new Error("This invoice is already linked to an annexure");

    // 2. Create Annexure and Groups
    const result = await prisma.$transaction(async (tx) => {
      const annexure = await tx.annexure.create({
        data: {
          name: `Auto-Generated from ${invoice.invoiceNumber || invoice.refernceNumber}`,
          fromDate: invoice.invoiceDate || new Date(),
          toDate: invoice.invoiceDate || new Date(),
          status: "DRAFT" as any,
          vendorId: invoice.vendorId,
        },
      });

      // 3. Group LRs by fileNumber and create FileGroups
      const lrsByFile = invoice.LRRequest.reduce(
        (acc, lr) => {
          if (!acc[lr.fileNumber]) acc[lr.fileNumber] = [];
          acc[lr.fileNumber].push(lr);
          return acc;
        },
        {} as Record<string, typeof invoice.LRRequest>,
      );

      for (const [fileNumber, lrs] of Object.entries(lrsByFile)) {
        const totalPrice = lrs.reduce((sum, lr) => sum + (lr.lrPrice || 0), 0);

        const group = await tx.annexureFileGroup.create({
          data: {
            annexureId: annexure.id,
            fileNumber,
            totalPrice,
            status: "PENDING" as any,
          },
        });

        // 4. Link LRs to Annexure and Group
        await tx.lRRequest.updateMany({
          where: { id: { in: lrs.map((l) => l.id) } },
          data: {
            annexureId: annexure.id,
            groupId: group.id,
          },
        });
      }

      // 5. Link Invoice to Annexure
      await tx.invoice.update({
        where: { id: invoiceId },
        data: {
          annexureId: annexure.id,
        },
      });

      return annexure;
    });

    revalidatePath(`/invoices/${invoiceId}`);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error in createAnnexureFromExistingInvoice:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate annexure",
    };
  }
}

/**
 * Reset/Rollback Invoice and Annexure (BOSS Only)
 * - Deletes Invoice
 * - Deletes Annexure + Groups
 * - Resets LRs to PENDING/initial state (removes costs, unlinks from everything)
 */
export async function resetInvoiceAndAnnexure(invoiceId: string) {
  try {
    const { user } = await getCustomSession();

    if (!user || user.role !== UserRoleEnum.BOSS) {
      throw new Error("Unauthorized. Only BOSS can perform this action.");
    }

    // 1. Get invoice to find linked Annexure
    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        LRRequest: true,
      },
    });

    if (!invoice) throw new Error("Invoice not found");

    const annexureId = invoice.annexureId;

    await prisma.$transaction(async (tx) => {
      // 2. Reset LRs
      // Find all LRs linked to this invoice or the annexure
      const lrQuery: any = { invoiceId };
      if (annexureId) {
        lrQuery.invoiceId = undefined; // Clear this to use OR logic or just update all that match either
        // Actually best to find IDs first to be safe, or just update where invoiceId = id OR annexureId = id
      }

      // Better strategy: Find IDs of LRs to update
      const lrIds = new Set<string>();
      invoice.LRRequest.forEach((lr) => lrIds.add(lr.id));

      if (annexureId) {
        const annexureLrs = await tx.lRRequest.findMany({
          where: { annexureId },
          select: { id: true },
        });
        annexureLrs.forEach((lr) => lrIds.add(lr.id));
      }

      const idsToReset = Array.from(lrIds);

      if (idsToReset.length > 0) {
        await tx.lRRequest.updateMany({
          where: { id: { in: idsToReset } },
          data: {
            invoiceId: null,
            annexureId: null,
            groupId: null,
            status: "PENDING", // Reset to PENDING
            isInvoiced: false,
            // Reset costs
            extraCost: null,
            modifiedPrice: null,
            priceSettled: null,
            // Keep lrPrice (base price) and priceOffered? usually yes.
            // User said "remove the all cost". extraCost is definitely one.
            // modifiedPrice and priceSettled are typically negotiation results.
          },
        });
      }

      // 3. Delete Invoice
      // Must submit this first because it links to Annexure with NoAction onDelete
      await tx.invoice.delete({
        where: { id: invoiceId },
      });

      // 4. Delete Annexure Components if exists
      if (annexureId) {
        // Delete Groups first
        await tx.annexureFileGroup.deleteMany({
          where: { annexureId },
        });

        // Delete Annexure
        await tx.annexure.delete({
          where: { id: annexureId },
        });
      }
    });

    revalidatePath("/invoices");
    return {
      success: true,
      message: "Invoice and Annexure reset successfully. LRs are now PENDING.",
    };
  } catch (error) {
    console.error("Error in resetInvoiceAndAnnexure:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to reset invoice",
    };
  }
}
