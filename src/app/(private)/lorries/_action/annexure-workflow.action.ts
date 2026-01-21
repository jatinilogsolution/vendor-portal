"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  AnnexureStatus,
  FileGroupStatus,
  UserRoleEnum,
  InvoiceStatus,
} from "@/utils/constant";
import {
  canTransitionAnnexure,
  canReviewAnnexureGroups,
} from "@/utils/workflow-validator";
import {
  sendRejectionEmail,
  sendApprovalEmail,
  sendStatusChangeEmail,
  sendEmail,
} from "@/services/mail";
import { auditUpdate } from "@/lib/audit-logger";
import { generateInvoiceFromAnnexure } from "./annexure";
import { getUsersByRole } from "@/services/user.service";

/**
 * Submit annexure for TADMIN review
 */
export async function submitAnnexureForReview(
  annexureId: string,
  userId: string,
  role: string,
) {
  try {
    const annexure = await prisma.annexure.findUnique({
      where: { id: annexureId },
      include: { groups: true },
    });

    if (!annexure) throw new Error("Annexure not found");

    if (
      !canTransitionAnnexure(
        role,
        annexure.status as AnnexureStatus,
        AnnexureStatus.PENDING_TADMIN_REVIEW,
      )
    ) {
      throw new Error("Unauthorized to submit annexure at this stage");
    }

    // Update annexure status
    const updatedAnnexure = await prisma.annexure.update({
      where: { id: annexureId },
      data: {
        status: AnnexureStatus.PENDING_TADMIN_REVIEW,
        submittedAt: new Date(),
        statusHistory: {
          create: {
            fromStatus: annexure.status,
            toStatus: AnnexureStatus.PENDING_TADMIN_REVIEW,
            changedBy: userId,
            notes: "Submitted for TADMIN review",
          },
        },
      },
    });

    // 🚀 AUTO-GENERATE INVOICE ON SUBMISSION
    const invoiceResult = await generateInvoiceFromAnnexure(annexureId);
    if (invoiceResult.error) {
      // Rollback status if invoice generation fails?
      // Better to throw error and let the transaction (if any) or user handle it.
      // Since this is not in a DB transaction with the update above, we should be careful.
      // However, the user wants it to be generated now.
      console.error("Failed to auto-generate invoice:", invoiceResult.error);
      // Optionally revert the annexure status here if critical,
      // but the generateInvoiceFromAnnexure has its own validations.
      throw new Error(`Invoice generation failed: ${invoiceResult.error}`);
    }

    // 💬 CHAT INTEGRATION: Post submission message to chat
    const annexureLink = `${process.env.NEXT_PUBLIC_API_URL}/lorries/annexure/${annexureId}`;
    await prisma.workflowComment.create({
      data: {
        content: `[SUBMITTED] Annexure ${annexure.name} has been submitted for review. [View Document](${annexureLink})`,
        authorId: userId,
        authorRole: UserRoleEnum.TVENDOR,
        annexureId: annexureId,
        invoiceId: invoiceResult?.invoice?.id,
        isPrivate: false,
      },
    });

    // 📧 EMAIL NOTIFICATION: Notify all TADMINs
    const tadmins = await getUsersByRole(UserRoleEnum.TADMIN);
    for (const tadmin of tadmins) {
      await sendEmail({
        to: tadmin.email,
        recipientId: tadmin.id,
        subject: `New Annexure Submitted: ${annexure.name}`,
        body: `Vendor has submitted a new annexure for review.\n\nAnnexure: ${annexure.name}\n\n[View Document](${annexureLink})`,
        templateType: "STATUS_CHANGE",
        relatedModel: "Annexure",
        relatedId: annexureId,
      });
    }

    // Also update all file groups that are PENDING to UNDER_REVIEW
    await prisma.annexureFileGroup.updateMany({
      where: {
        annexureId,
        status: FileGroupStatus.PENDING,
      },
      data: {
        status: FileGroupStatus.UNDER_REVIEW,
      },
    });

    // Notify someone? TADMIN notification could go here if we have their details.

    revalidatePath(`/lorries/annexure/${annexureId}`);
    return {
      success: true,
      annexureId: annexureId,
      invoiceId: invoiceResult?.invoice?.id,
      data: updatedAnnexure,
    };
  } catch (error) {
    console.error("Error in submitAnnexureForReview:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to submit annexure",
    };
  }
}

/**
 * TADMIN approves a specific file group
 */
export async function approveFileGroup(
  fileGroupId: string,
  userId: string,
  role: string,
) {
  try {
    const group = await prisma.annexureFileGroup.findUnique({
      where: { id: fileGroupId },
      include: { Annexure: { include: { groups: true } } },
    });

    if (!group) throw new Error("File group not found");

    if (
      !canReviewAnnexureGroups(role, group.Annexure.status as AnnexureStatus)
    ) {
      throw new Error("Unauthorized to review file groups");
    }

    // Use transaction for atomic update
    await prisma.$transaction(async (tx) => {
      await tx.annexureFileGroup.update({
        where: { id: fileGroupId },
        data: {
          status: FileGroupStatus.APPROVED,
          approvedBy: userId,
          approvedAt: new Date(),
          reviewedBy: userId,
          reviewedAt: new Date(),
        },
      });

      // ALSO UPDATE ALL LRs IN THIS GROUP TO APPROVED
      await tx.lRRequest.updateMany({
        where: { groupId: fileGroupId },
        data: { status: "APPROVED" },
      });

      // Compute new status using already fetched groups (mark current as approved)
      const updatedGroups = group.Annexure.groups.map((g) =>
        g.id === fileGroupId ? { ...g, status: FileGroupStatus.APPROVED } : g,
      );

      const anyRejected = updatedGroups.some(
        (g) => g.status === FileGroupStatus.REJECTED,
      );
      const allApproved = updatedGroups.every(
        (g) => g.status === FileGroupStatus.APPROVED,
      );

      let targetStatus = group.Annexure.status as AnnexureStatus;
      if (anyRejected) {
        targetStatus = AnnexureStatus.HAS_REJECTIONS;
      } else if (allApproved) {
        // If everything is approved, we can set it to a state that allows Boss Review
        // however, we still want TADMIN to click "Forward" to officially hand it over.
        // We'll keep it as PARTIALLY_APPROVED or mark it as "READY_FOR_FORWARDING" if we had that status.
        // For now, let's keep PARTIALLY_APPROVED since it signifies it's not the final state yet.
        targetStatus = AnnexureStatus.PARTIALLY_APPROVED;
      } else {
        targetStatus = AnnexureStatus.PARTIALLY_APPROVED;
      }

      if (targetStatus !== group.Annexure.status) {
        await tx.annexure.update({
          where: { id: group.annexureId },
          data: {
            status: targetStatus,
            statusHistory: {
              create: {
                fromStatus: group.Annexure.status,
                toStatus: targetStatus,
                changedBy: userId,
                notes: `Updated status after group ${group.fileNumber} approval and auto-approving LRs`,
              },
            },
          },
        });
      }
    });

    revalidatePath(`/lorries/annexure/${group.annexureId}`);
    return { success: true, annexureId: group.annexureId };
  } catch (error) {
    console.error("Error in approveFileGroup:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to approve file group",
    };
  }
}

/**
 * TADMIN rejects a specific file group
 */
export async function rejectFileGroup(
  fileGroupId: string,
  userId: string,
  role: string,
  reason: string,
  affectedLRs?: string,
) {
  try {
    const group = await prisma.annexureFileGroup.findUnique({
      where: { id: fileGroupId },
      include: {
        Annexure: {
          include: {
            LRRequest: {
              where: { groupId: fileGroupId },
              include: { tvendor: { include: { users: true } } },
            },
          },
        },
      },
    });

    if (!group) throw new Error("File group not found");

    if (
      !canReviewAnnexureGroups(role, group.Annexure.status as AnnexureStatus)
    ) {
      throw new Error("Unauthorized to review file groups");
    }

    const updatedGroup = await prisma.$transaction(async (tx) => {
      const groupUpdate = await tx.annexureFileGroup.update({
        where: { id: fileGroupId },
        data: {
          status: FileGroupStatus.REJECTED,
          rejectedBy: userId,
          rejectedAt: new Date(),
          rejectionReason: reason,
          reviewedBy: userId,
          reviewedAt: new Date(),
          rejections: {
            create: {
              rejectedBy: userId,
              reason: reason,
              affectedLRs: affectedLRs,
            },
          },
        },
      });

      // ALSO UPDATE ALL LRs IN THIS GROUP TO REJECTED
      await tx.lRRequest.updateMany({
        where: { groupId: fileGroupId },
        data: { status: "REJECTED", remark: reason },
      });

      return groupUpdate;
    });

    // Update annexure status
    await prisma.annexure.update({
      where: { id: group.annexureId },
      data: {
        status: AnnexureStatus.HAS_REJECTIONS,
        statusHistory: {
          create: {
            fromStatus: group.Annexure.status,
            toStatus: AnnexureStatus.HAS_REJECTIONS,
            changedBy: userId,
            notes: `Rejected group ${group.fileNumber}: ${reason}`,
          },
        },
      },
    });

    // Send email to TVENDOR
    // Get vendor email from first LR in the group
    const firstLR = group.Annexure.LRRequest[0];
    const vendorEmail =
      firstLR?.tvendor?.contactEmail || firstLR?.tvendor?.users?.[0]?.email;
    const vendorId = firstLR?.tvendor?.id;

    // 💬 CHAT INTEGRATION: Post rejection reason to chat
    const annexureLink = `${process.env.NEXT_PUBLIC_API_URL}/lorries/annexure/${group.annexureId}`;
    const user = await prisma.user.findUnique({ where: { id: userId } });
    await prisma.workflowComment.create({
      data: {
        content: `[REJECTED] File Group ${group.fileNumber}: ${reason}${affectedLRs ? ` (Affected LRs: ${affectedLRs})` : ""}. [View Annexure](${annexureLink})`,
        authorId: userId,
        authorRole: user?.role || "TADMIN",
        annexureId: group.annexureId,
        invoiceId: firstLR?.invoiceId,
        isPrivate: false,
      },
    });

    if (vendorEmail) {
      await sendRejectionEmail(vendorEmail, vendorId || null, {
        type: "AnnexureFileGroup",
        entityName: group.fileNumber,
        reason: reason,
        rejectedBy: "Traffic Admin",
        affectedLRs: affectedLRs,
      });
    }

    revalidatePath(`/lorries/annexure/${group.annexureId}`);
    return { success: true, data: updatedGroup };
  } catch (error) {
    console.error("Error in rejectFileGroup:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reject file group",
    };
  }
}

/**
 * TADMIN forwards annexure to BOSS after completing review
 */
export async function forwardAnnexureToBoss(
  annexureId: string,
  userId: string,
  role: string,
) {
  try {
    const annexure = await prisma.annexure.findUnique({
      where: { id: annexureId },
      include: { groups: true },
    });

    if (!annexure) throw new Error("Annexure not found");

    const allApproved = annexure.groups.every(
      (g) => g.status === FileGroupStatus.APPROVED,
    );
    if (!allApproved) {
      throw new Error(
        "Cannot forward to BOSS until all file groups are approved",
      );
    }

    // 🛡️ SUB-LEVEL VERIFICATION: Check all individual LRs
    const lrs = await prisma.lRRequest.findMany({
      where: { annexureId },
    });

    console.log(JSON.stringify(lrs));
    const allVerified = lrs.every((lr) => lr.status === "APPROVED");
    if (!allVerified) {
      const unverifiedCount = lrs.filter(
        (lr) => lr.status !== "APPROVED",
      ).length;
      throw new Error(
        `Cannot forward to BOSS until all individual LRs are APPROVED. There are currently ${unverifiedCount} unapproved items.`,
      );
    }

    if (
      !canTransitionAnnexure(
        role,
        annexure.status as AnnexureStatus,
        AnnexureStatus.PENDING_BOSS_REVIEW,
      )
    ) {
      throw new Error("Unauthorized to forward to BOSS");
    }

    const updatedAnnexure = await prisma.annexure.update({
      where: { id: annexureId },
      data: {
        status: AnnexureStatus.PENDING_BOSS_REVIEW,
        tadminCompletedAt: new Date(),
        statusHistory: {
          create: {
            fromStatus: annexure.status,
            toStatus: AnnexureStatus.PENDING_BOSS_REVIEW,
            changedBy: userId,
            notes: "Forwarded to BOSS for final approval",
          },
        },
      },
    });

    // 💬 CHAT INTEGRATION: Post forwarding message to chat
    const annexureLink = `${process.env.NEXT_PUBLIC_API_URL}/lorries/annexure/${annexureId}`;
    const linkedInvoice = await prisma.invoice.findFirst({
      where: { annexureId: annexureId },
    });
    await prisma.workflowComment.create({
      data: {
        content: `[FORWARDED] Annexure ${annexure.name} approved by TADMIN and forwarded to BOSS for final review. [View Document](${annexureLink})`,
        authorId: userId,
        authorRole: UserRoleEnum.TADMIN,
        annexureId: annexureId,
        invoiceId: linkedInvoice?.id,
        isPrivate: false,
      },
    });

    // 📧 EMAIL NOTIFICATION: Notify all BOSS users
    const bosses = await getUsersByRole(UserRoleEnum.BOSS);
    for (const boss of bosses) {
      await sendEmail({
        to: boss.email,
        recipientId: boss.id,
        subject: `Annexure Pending BOSS Approval: ${annexure.name}`,
        body: `Traffic Admin has approved and forwarded an annexure for final approval.\n\nAnnexure: ${annexure.name}\n\n[View Document](${annexureLink})`,
        templateType: "STATUS_CHANGE",
        relatedModel: "Annexure",
        relatedId: annexureId,
      });
    }

    revalidatePath(`/lorries/annexure/${annexureId}`);
    return { success: true, data: updatedAnnexure };
  } catch (error) {
    console.error("Error in forwardAnnexureToBoss:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to forward annexure",
    };
  }
}

/**
 * BOSS approves annexure (final approval)
 */
export async function approveAnnexureByBoss(
  annexureId: string,
  userId: string,
  role: string,
) {
  try {
    const annexure = await prisma.annexure.findUnique({
      where: { id: annexureId },
    });

    if (!annexure) throw new Error("Annexure not found");

    if (
      !canTransitionAnnexure(
        role,
        annexure.status as AnnexureStatus,
        AnnexureStatus.APPROVED,
      )
    ) {
      throw new Error("Unauthorized to perform final approval");
    }

    const updatedAnnexure = await prisma.annexure.update({
      where: { id: annexureId },
      data: {
        status: AnnexureStatus.APPROVED,
        bossApprovedAt: new Date(),
        statusHistory: {
          create: {
            fromStatus: annexure.status,
            toStatus: AnnexureStatus.APPROVED,
            changedBy: userId,
            notes: "Final approval by BOSS",
          },
        },
      },
    });

    // 🔗 SYNC: If an invoice is linked, approve it too
    const linkedInvoice = await prisma.invoice.findFirst({
      where: { annexureId: annexureId },
    });

    if (
      linkedInvoice &&
      linkedInvoice.status === InvoiceStatus.PENDING_BOSS_REVIEW
    ) {
      await prisma.invoice.update({
        where: { id: linkedInvoice.id },
        data: {
          status: InvoiceStatus.APPROVED,
          bossApprovedAt: new Date(),
          statusHistory: {
            create: {
              fromStatus: linkedInvoice.status,
              toStatus: InvoiceStatus.APPROVED,
              changedBy: userId,
              notes: "Auto-approved by BOSS as parent Annexure was approved",
            },
          },
        },
      });
    }

    revalidatePath(`/lorries/annexure/${annexureId}`);
    return { success: true, data: updatedAnnexure };
  } catch (error) {
    console.error("Error in approveAnnexureByBoss:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to approve annexure",
    };
  }
}

/**
 * BOSS rejects annexure back to TVENDOR
 */
export async function rejectAnnexureByBoss(
  annexureId: string,
  userId: string,
  role: string,
  reason: string,
) {
  try {
    const annexure = await prisma.annexure.findUnique({
      where: { id: annexureId },
      include: {
        LRRequest: {
          include: { tvendor: { include: { users: true } } },
        },
      },
    });

    if (!annexure) throw new Error("Annexure not found");

    if (
      !canTransitionAnnexure(
        role,
        annexure.status as AnnexureStatus,
        AnnexureStatus.REJECTED_BY_BOSS,
      )
    ) {
      throw new Error("Unauthorized to reject annexure");
    }

    const updatedAnnexure = await prisma.annexure.update({
      where: { id: annexureId },
      data: {
        status: AnnexureStatus.REJECTED_BY_BOSS,
        rejectedAt: new Date(),
        statusHistory: {
          create: {
            fromStatus: annexure.status,
            toStatus: AnnexureStatus.REJECTED_BY_BOSS,
            changedBy: userId,
            notes: `Rejected by BOSS: ${reason}`,
          },
        },
      },
    });

    // Send email to TVENDOR
    const firstLR = annexure.LRRequest[0];
    const vendorEmail =
      firstLR?.tvendor?.contactEmail || firstLR?.tvendor?.users?.[0]?.email;
    const vendorId = firstLR?.tvendor?.id;

    // 💬 CHAT INTEGRATION: Post rejection reason to chat
    const annexureLink = `${process.env.NEXT_PUBLIC_API_URL}/lorries/annexure/${annexureId}`;
    await prisma.workflowComment.create({
      data: {
        content: `[REJECTED] Annexure ${annexure.name} was rejected by BOSS. Reason: ${reason}. [View Document](${annexureLink})`,
        authorId: userId,
        authorRole: UserRoleEnum.BOSS,
        annexureId: annexureId,
        invoiceId: firstLR?.invoiceId,
        isPrivate: false,
      },
    });

    // 📧 EMAIL NOTIFICATION: Notify TVENDOR
    if (vendorEmail) {
      await sendRejectionEmail(vendorEmail, vendorId || null, {
        type: "Annexure",
        entityName: annexure.name,
        reason: reason,
        rejectedBy: "BOSS",
      });
    }

    // 📧 EMAIL NOTIFICATION: Notify all TADMINs
    const tadmins = await getUsersByRole(UserRoleEnum.TADMIN);
    for (const tadmin of tadmins) {
      await sendEmail({
        to: tadmin.email,
        recipientId: tadmin.id,
        subject: `BOSS Rejected Annexure: ${annexure.name}`,
        body: `BOSS has rejected the annexure that was previously forwarded.\n\nAnnexure: ${annexure.name}\nReason: ${reason}\n\n[View Document](${annexureLink})`,
        templateType: "REJECTION",
        relatedModel: "Annexure",
        relatedId: annexureId,
      });
    }

    revalidatePath(`/lorries/annexure/${annexureId}`);
    return { success: true, data: updatedAnnexure };
  } catch (error) {
    console.error("Error in rejectAnnexureByBoss:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to reject annexure",
    };
  }
}

/**
 * TADMIN approves multiple file groups at once
 */
export async function bulkApproveFileGroups(
  fileGroupIds: string[],
  userId: string,
  role: string,
) {
  try {
    if (fileGroupIds.length === 0) return { success: true };

    // Fetch groups to verify they exist and belong to the same annexure
    const groups = await prisma.annexureFileGroup.findMany({
      where: { id: { in: fileGroupIds } },
      include: { Annexure: true },
    });

    if (groups.length === 0) throw new Error("No file groups found");

    const annexureId = groups[0].annexureId;
    const annexureStatus = groups[0].Annexure.status as AnnexureStatus;

    if (!canReviewAnnexureGroups(role, annexureStatus)) {
      throw new Error("Unauthorized to review file groups");
    }

    // Update all groups in a transaction
    await prisma.$transaction(async (tx) => {
      await tx.annexureFileGroup.updateMany({
        where: { id: { in: fileGroupIds } },
        data: {
          status: FileGroupStatus.APPROVED,
          approvedBy: userId,
          approvedAt: new Date(),
          reviewedBy: userId,
          reviewedAt: new Date(),
        },
      });

      // Check if all groups in the annexure are now reviewed
      const allGroups = await tx.annexureFileGroup.findMany({
        where: { annexureId },
      });

      const anyRejected = allGroups.some(
        (g) => g.status === FileGroupStatus.REJECTED,
      );
      const allApproved = allGroups.every(
        (g) => g.status === FileGroupStatus.APPROVED,
      );

      // Update annexure status based on group statuses
      let targetStatus = annexureStatus;
      if (anyRejected) {
        targetStatus = AnnexureStatus.HAS_REJECTIONS;
      } else if (allApproved) {
        // Keep it as partially approved or move to pending boss review?
        // Logic should match individual approval
        targetStatus = AnnexureStatus.PARTIALLY_APPROVED;
      } else {
        targetStatus = AnnexureStatus.PARTIALLY_APPROVED;
      }

      if (targetStatus !== annexureStatus) {
        await tx.annexure.update({
          where: { id: annexureId },
          data: {
            status: targetStatus,
            statusHistory: {
              create: {
                fromStatus: annexureStatus,
                toStatus: targetStatus,
                changedBy: userId,
                notes: `Bulk approved ${fileGroupIds.length} groups`,
              },
            },
          },
        });
      }
    });

    revalidatePath(`/lorries/annexure/${annexureId}`);
    return { success: true, count: fileGroupIds.length };
  } catch (error) {
    console.error("Error in bulkApproveFileGroups:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to bulk approve file groups",
    };
  }
}

/**
 * Delete an annexure and clean up related records
 */
export async function deleteAnnexure(
  annexureId: string,
  userId: string,
  role: string,
) {
  try {
    const annexure = await prisma.annexure.findUnique({
      where: { id: annexureId },
      include: { invoices: true },
    });

    if (!annexure) throw new Error("Annexure not found");

    const isVendor = role === UserRoleEnum.TVENDOR;

    // Security check
    if (!isVendor) {
      throw new Error(
        "Unauthorized to delete annexure. Only Vendors can delete their own documents.",
      );
    }

    // Restriction check for owner (vendors) - can only delete if not approved/forwarded
    if (
      isVendor &&
      ![
        AnnexureStatus.DRAFT,
        AnnexureStatus.HAS_REJECTIONS,
        AnnexureStatus.REJECTED_BY_BOSS,
      ].includes(annexure.status as AnnexureStatus)
    ) {
      throw new Error(
        "Cannot delete annexure at the current stage. Only DRAFT or REJECTED annexures can be deleted.",
      );
    }

    // Additional restriction: Cannot delete if it is PENDING or APPROVED
    if (
      ![
        AnnexureStatus.DRAFT,
        AnnexureStatus.HAS_REJECTIONS,
        AnnexureStatus.REJECTED_BY_BOSS,
      ].includes(annexure.status as AnnexureStatus)
    ) {
      throw new Error(
        "Deletion is blocked. Only DRAFT or REJECTED items can be deleted to maintain data integrity.",
      );
    }

    // Perform deletion in a transaction
    await prisma.$transaction(async (tx) => {
      // 1. Unlink LRs and reset costs/prices
      await tx.lRRequest.updateMany({
        where: { annexureId },
        data: {
          annexureId: null,
          groupId: null,
          lrPrice: 0,
          extraCost: 0,
          priceSettled: 0,
          modifiedPrice: 0,
          invoiceId: null,
          isInvoiced: false,
        },
      });

      // 2. Unlink Invoice if any
      if (annexure.invoices.length > 0) {
        await tx.invoice.updateMany({
          where: { annexureId },
          data: {
            annexureId: null,
          },
        });
      }

      // 3. Delete File Groups
      await tx.annexureFileGroup.deleteMany({
        where: { annexureId },
      });

      // 4. Delete Workflow Comments
      await tx.workflowComment.deleteMany({
        where: { annexureId },
      });

      // 5. Delete Documents (Attachments) specifically linked to the Annexure
      await tx.document.deleteMany({
        where: { linkedId: annexureId },
      });

      // 6. Delete the Annexure (statusHistory will cascade)
      await tx.annexure.delete({
        where: { id: annexureId },
      });
    });

    revalidatePath("/lorries/annexure");
    return { success: true };
  } catch (error) {
    console.error("Error in deleteAnnexure:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete annexure",
    };
  }
}
