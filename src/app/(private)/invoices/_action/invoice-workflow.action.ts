"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { InvoiceStatus, UserRoleEnum, AnnexureStatus } from "@/utils/constant";
import { canTransitionInvoice } from "@/utils/workflow-validator";
import { sendRejectionEmail, sendApprovalEmail, sendEmail } from "@/services/mail";
import { getUsersByRole } from "@/services/user.service";

/**
 * Submit invoice for TADMIN review
 */
export async function submitInvoiceForReview(invoiceId: string, userId: string, role: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) throw new Error("Invoice not found");

        if (!canTransitionInvoice(role, invoice.status as InvoiceStatus, InvoiceStatus.PENDING_TADMIN_REVIEW)) {
            throw new Error("Unauthorized to submit invoice");
        }

        // 🛡️ VALIDATION: Ensure mandatory fields are present
        if (!invoice.invoiceNumber) throw new Error("Missing Invoice Number. Please fill details in 'Manage Invoice' first.");
        if (!invoice.invoiceDate) throw new Error("Missing Invoice Date. Please fill details in 'Manage Invoice' first.");
        // if (!invoice.billToId) throw new Error("Missing Bill-To Address. Please fill details in 'Manage Invoice' first.");
        if (!invoice.invoiceURI) throw new Error("Missing uploaded Invoice File. Please upload the invoice file first.");

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                status: InvoiceStatus.PENDING_TADMIN_REVIEW,
                submittedAt: new Date(),
                statusHistory: {
                    create: {
                        fromStatus: invoice.status,
                        toStatus: InvoiceStatus.PENDING_TADMIN_REVIEW,
                        changedBy: userId,
                        notes: "Submitted for review"
                    }
                }
            }
        });

        revalidatePath(`/invoices/${invoiceId}`);

        // 💬 CHAT INTEGRATION: Post submission message to chat
        const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
        await prisma.workflowComment.create({
            data: {
                content: `[SUBMITTED] Invoice ${invoice.invoiceNumber || invoice.refernceNumber} has been submitted for review. [View Document](${invoiceLink})`,
                authorId: userId,
                authorRole: UserRoleEnum.TVENDOR,
                annexureId: invoice.annexureId,
                invoiceId: invoiceId,
                isPrivate: false
            }
        });

        // 📧 EMAIL NOTIFICATION: Notify all TADMINs
        const tadmins = await getUsersByRole(UserRoleEnum.TADMIN);
        for (const tadmin of tadmins) {
            await sendEmail({
                to: tadmin.email,
                recipientId: tadmin.id,
                subject: `New Invoice Submitted: ${invoice.invoiceNumber || invoiceId}`,
                body: `Vendor has submitted a new invoice for review.\n\nInvoice: ${invoice.invoiceNumber || invoice.refernceNumber}\nView here: ${invoiceLink}`,
                templateType: "STATUS_CHANGE",
                relatedModel: "Invoice",
                relatedId: invoiceId
            });
        }

        return { success: true, data: updatedInvoice };
    } catch (error) {
        console.error("Error in submitInvoiceForReview:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to submit invoice" };
    }
}

/**
 * TADMIN approves invoice and forwards to BOSS
 */
export async function approveInvoiceByTadmin(invoiceId: string, userId: string, role: string, notes?: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) throw new Error("Invoice not found");

        if (!canTransitionInvoice(role, invoice.status as InvoiceStatus, InvoiceStatus.PENDING_BOSS_REVIEW)) {
            throw new Error("Unauthorized to approve invoice");
        }

        // 🛡️ VALIDATION: Check if linked annexure exists and verify all items are APPROVED
        if (invoice.annexureId) {
            const annexure = await prisma.annexure.findUnique({
                where: { id: invoice.annexureId },
                include: { groups: true }
            });

            if (annexure) {
                const pendingGroups = annexure.groups.filter(g => g.status !== "APPROVED");
                if (pendingGroups.length > 0) {
                    throw new Error(`Cannot forward to BOSS: ${pendingGroups.length} annexure file group(s) are not yet approved.`);
                }

                // 🔄 AUTO-FORWARD ANNEXURE: If annexure is still awaiting forwarding, move it along with the invoice
                if (annexure.status === AnnexureStatus.PARTIALLY_APPROVED || annexure.status === AnnexureStatus.PENDING_TADMIN_REVIEW) {
                    await prisma.annexure.update({
                        where: { id: invoice.annexureId },
                        data: {
                            status: AnnexureStatus.PENDING_BOSS_REVIEW,
                            tadminCompletedAt: new Date(),
                            statusHistory: {
                                create: {
                                    fromStatus: annexure.status,
                                    toStatus: AnnexureStatus.PENDING_BOSS_REVIEW,
                                    changedBy: userId,
                                    notes: "Auto-forwarded to BOSS along with linked Invoice approval"
                                }
                            }
                        }
                    });
                }
            }
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                status: InvoiceStatus.PENDING_BOSS_REVIEW,
                tadminApprovedAt: new Date(),
                statusHistory: {
                    create: {
                        fromStatus: invoice.status,
                        toStatus: InvoiceStatus.PENDING_BOSS_REVIEW,
                        changedBy: userId,
                        notes: notes || "Approved by TADMIN and forwarded to BOSS"
                    }
                }
            }
        });

        revalidatePath(`/invoices/${invoiceId}`);

        // 💬 CHAT INTEGRATION: Post forwarding message to chat
        const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
        const autoForwardText = invoice.annexureId ? " and linked Annexure auto-forwarded" : "";
        await prisma.workflowComment.create({
            data: {
                content: `[FORWARDED] Invoice ${invoice.invoiceNumber || invoice.refernceNumber}${autoForwardText} approved by TADMIN and forwarded to BOSS for final review. [View Document](${invoiceLink})`,
                authorId: userId,
                authorRole: UserRoleEnum.TADMIN,
                annexureId: invoice.annexureId,
                invoiceId: invoiceId,
                isPrivate: false
            }
        });

        // 📧 EMAIL NOTIFICATION: Notify all BOSS users
        const bosses = await getUsersByRole(UserRoleEnum.BOSS);
        for (const boss of bosses) {
            await sendEmail({
                to: boss.email,
                recipientId: boss.id,
                subject: `Invoice Pending BOSS Approval: ${invoice.invoiceNumber || invoiceId}`,
                body: `Traffic Admin has approved and forwarded an invoice for final BOSS approval.\n\nInvoice: ${invoice.invoiceNumber || invoice.refernceNumber}\nView here: ${invoiceLink}`,
                templateType: "STATUS_CHANGE",
                relatedModel: "Invoice",
                relatedId: invoiceId
            });
        }

        return { success: true, data: updatedInvoice };
    } catch (error) {
        console.error("Error in approveInvoiceByTadmin:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to approve invoice" };
    }
}

/**
 * TADMIN/BOSS rejects invoice back to TVENDOR
 */
export async function rejectInvoice(invoiceId: string, userId: string, role: string, reason: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { vendor: { include: { users: true } } }
        });

        if (!invoice) throw new Error("Invoice not found");

        const targetStatus = role === UserRoleEnum.TADMIN ? InvoiceStatus.REJECTED_BY_TADMIN : InvoiceStatus.REJECTED_BY_BOSS;

        if (!canTransitionInvoice(role, invoice.status as InvoiceStatus, targetStatus)) {
            throw new Error("Unauthorized to reject invoice");
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                status: targetStatus,
                rejectedAt: new Date(),
                statusHistory: {
                    create: {
                        fromStatus: invoice.status,
                        toStatus: targetStatus,
                        changedBy: userId,
                        notes: `Rejected: ${reason}`
                    }
                },
                rejections: {
                    create: {
                        rejectedBy: userId,
                        reason: reason,
                        status: targetStatus
                    }
                }
            }
        });

        // 🔗 CASCADE TO ANNEXURE: Update linked annexure status to allow editing
        if (invoice.annexureId) {
            const annexureStatus = role === UserRoleEnum.TADMIN ? AnnexureStatus.HAS_REJECTIONS : AnnexureStatus.REJECTED_BY_BOSS;
            
            await prisma.annexure.update({
                where: { id: invoice.annexureId },
                data: {
                    status: annexureStatus,
                    statusHistory: {
                        create: {
                            fromStatus: (await prisma.annexure.findUnique({ where: { id: invoice.annexureId } }))?.status || "UNKNOWN",
                            toStatus: annexureStatus,
                            changedBy: userId,
                            notes: `Annexure status updated due to invoice rejection by ${role === UserRoleEnum.TADMIN ? "TADMIN" : "BOSS"}`
                        }
                    }
                }
            });

            revalidatePath(`/lorries/annexure/${invoice.annexureId}`);
        }

        revalidatePath(`/invoices/${invoiceId}`);

        // 💬 CHAT INTEGRATION: Post rejection reason to chat
        const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
        await prisma.workflowComment.create({
            data: {
                content: `[REJECTED] Invoice ${invoice.invoiceNumber || invoice.refernceNumber} was rejected by ${role === UserRoleEnum.TADMIN ? "TADMIN" : "BOSS"}. Reason: ${reason}. [View Document](${invoiceLink})`,
                authorId: userId,
                authorRole: role as any,
                annexureId: invoice.annexureId,
                invoiceId: invoiceId,
                isPrivate: false
            }
        });

        // Send email to vendor
        const vendorEmail = invoice.vendor.contactEmail || invoice.vendor.users?.[0]?.email;
        if (vendorEmail) {
            await sendRejectionEmail(vendorEmail, invoice.vendorId, {
                type: "Invoice",
                entityName: invoice.invoiceNumber || invoice.refernceNumber,
                reason: reason,
                rejectedBy: role === UserRoleEnum.TADMIN ? "Traffic Admin" : "BOSS"
            });
        }

        // 📧 EMAIL NOTIFICATION: If rejected by BOSS, also notify TADMINs
        if (role === UserRoleEnum.BOSS) {
            const tadmins = await getUsersByRole(UserRoleEnum.TADMIN);
            for (const tadmin of tadmins) {
                await sendEmail({
                    to: tadmin.email,
                    recipientId: tadmin.id,
                    subject: `BOSS Rejected Invoice: ${invoice.invoiceNumber || invoiceId}`,
                    body: `BOSS has rejected the invoice that was previously approved by TADMIN.\n\nInvoice: ${invoice.invoiceNumber || invoice.refernceNumber}\nReason: ${reason}\nView here: ${invoiceLink}`,
                    templateType: "REJECTION",
                    relatedModel: "Invoice",
                    relatedId: invoiceId
                });
            }
        }

        return { success: true, data: updatedInvoice };
    } catch (error) {
        console.error("Error in rejectInvoice:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to reject invoice" };
    }
}

/**
 * BOSS performs final approval of invoice
 */
export async function approveInvoiceByBoss(invoiceId: string, userId: string, role: string, notes?: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) throw new Error("Invoice not found");

        if (!canTransitionInvoice(role, invoice.status as InvoiceStatus, InvoiceStatus.APPROVED)) {
            throw new Error("Unauthorized to perform final approval");
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                status: InvoiceStatus.APPROVED,
                bossApprovedAt: new Date(),
                statusHistory: {
                    create: {
                        fromStatus: invoice.status,
                        toStatus: InvoiceStatus.APPROVED,
                        changedBy: userId,
                        notes: notes || "Final approval by BOSS (Integrated)"
                    }
                }
            }
        });

        // 🔗 SYNC: If an annexure is linked, approve it as well
        if (invoice.annexureId) {
            const annexure = await prisma.annexure.findUnique({ where: { id: invoice.annexureId } });
            if (annexure && annexure.status !== AnnexureStatus.APPROVED) {
                await prisma.annexure.update({
                    where: { id: invoice.annexureId },
                    data: {
                        status: AnnexureStatus.APPROVED,
                        bossApprovedAt: new Date(),
                        statusHistory: {
                            create: {
                                fromStatus: annexure.status,
                                toStatus: AnnexureStatus.APPROVED,
                                changedBy: userId,
                                notes: notes ? `Auto-approved via Invoice (${notes})` : "Auto-approved along with linked Invoice final approval (Directly)"
                            }
                        }
                    }
                });
            }
        }

        revalidatePath(`/invoices/${invoiceId}`);
        if (invoice.annexureId) revalidatePath(`/lorries/annexure/${invoice.annexureId}`);

        // 💬 CHAT INTEGRATION: Post approval message to chat
        const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
        await prisma.workflowComment.create({
            data: {
                content: `[APPROVED] Invoice ${invoice.invoiceNumber || invoice.refernceNumber} received FINAL APPROVAL and linked Annexure approved. [View Document](${invoiceLink})`,
                authorId: userId,
                authorRole: UserRoleEnum.BOSS,
                annexureId: invoice.annexureId,
                invoiceId: invoiceId,
                isPrivate: false
            }
        });

        return { success: true, data: updatedInvoice };
    } catch (error) {
        console.error("Error in approveInvoiceByBoss:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to approve invoice" };
    }
}

/**
 * BOSS authorizes invoice for payment
 */
export async function authorizeInvoicePayment(invoiceId: string, userId: string, role: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) throw new Error("Invoice not found");

        if (!canTransitionInvoice(role, invoice.status as InvoiceStatus, InvoiceStatus.PAYMENT_APPROVED)) {
            throw new Error("Unauthorized to authorize payment");
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                status: InvoiceStatus.PAYMENT_APPROVED,
                paymentApprovedAt: new Date(),
                statusHistory: {
                    create: {
                        fromStatus: invoice.status,
                        toStatus: InvoiceStatus.PAYMENT_APPROVED,
                        changedBy: userId,
                        notes: "Authorized for payment"
                    }
                }
            }
        });

        revalidatePath(`/invoices/${invoiceId}`);

        // 💬 CHAT INTEGRATION: Post authorization message to chat
        const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
        await prisma.workflowComment.create({
            data: {
                content: `[AUTHORIZED] Invoice ${invoice.invoiceNumber || invoice.refernceNumber} has been AUTHORIZED FOR PAYMENT by BOSS. [View Document](${invoiceLink})`,
                authorId: userId,
                authorRole: UserRoleEnum.BOSS,
                annexureId: invoice.annexureId,
                invoiceId: invoiceId,
                isPrivate: false
            }
        });

        return { success: true, data: updatedInvoice };
    } catch (error) {
        console.error("Error in authorizeInvoicePayment:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to authorize payment" };
    }
}

/**
 * Vendor requests deletion of an invoice that has already been submitted
 */
export async function requestInvoiceDeletion(invoiceId: string, userId: string, role: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId }
        });

        if (!invoice) throw new Error("Invoice not found");

        if (role !== UserRoleEnum.TVENDOR) {
            throw new Error("Only Vendors can request invoice deletion.");
        }

        if ([InvoiceStatus.PENDING_BOSS_REVIEW, InvoiceStatus.REJECTED_BY_BOSS, InvoiceStatus.APPROVED, InvoiceStatus.PAYMENT_APPROVED].includes(invoice.status as InvoiceStatus)) {
            throw new Error("Cannot request deletion: This invoice has already been forwarded to the BOSS/Finance for review.");
        }

        const updatedInvoice = await prisma.invoice.update({
            where: { id: invoiceId },
            data: {
                deletionRequested: true
            }
        });

        revalidatePath(`/invoices/${invoiceId}`);

        // 💬 CHAT INTEGRATION: Post deletion request to chat
        const invoiceLink = `${process.env.NEXT_PUBLIC_API_URL}/invoices/${invoiceId}`;
        await prisma.workflowComment.create({
            data: {
                content: `Vendor has requested DELETION of this invoice.   [View Document](${invoiceLink})`,
                authorId: userId,
                authorRole: UserRoleEnum.TVENDOR,
                annexureId: invoice.annexureId,
                invoiceId: invoiceId,
                isPrivate: false
            }
        });

        return { success: true, data: updatedInvoice };
    } catch (error) {
        console.error("Error in requestInvoiceDeletion:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to request deletion" };
    }
}

/**
 * Delete an invoice and reset associated LR costs
 */
export async function deleteInvoice(invoiceId: string, userId: string, role: string) {
    try {
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: { LRRequest: true }
        });

        if (!invoice) throw new Error("Invoice not found");

        const isVendor = role === UserRoleEnum.TVENDOR;
        const isAdmin = role === UserRoleEnum.TADMIN;

        // --- NEW PERMISSION LOGIC ---
        // 1. Vendor can only delete if it's DRAFT and NEVER submitted
        if (isVendor) {
            if (invoice.submittedAt !== null) {
                throw new Error("This invoice has already been submitted. Please 'Request Deletion' so that Traffic Admin can process it.");
            }
            if (invoice.status !== InvoiceStatus.DRAFT) {
                throw new Error("Only DRAFT invoices that have not been submitted can be deleted by Vendors.");
            }
        }

        // 2. Admin can only delete if Vendor has requested deletion
        if (isAdmin) {
            if (!invoice.deletionRequested) {
                throw new Error("Deletion can only be processed by Admin if the Vendor has requested it.");
            }
        }

        // 3. Block for other roles (BOSS etc)
        if (!isVendor && !isAdmin) {
            throw new Error("Unauthorized to delete invoice.");
        }

        // Perform deletion in a transaction
        await prisma.$transaction(async (tx) => {
            // 1. Unlink LRs and reset costs/prices
            await tx.lRRequest.updateMany({
                where: { invoiceId },
                data: {
                    invoiceId: null,
                    lrPrice: 0,
                    extraCost: 0,
                    priceSettled: 0,
                    modifiedPrice: 0,
                    isInvoiced: false
                }
            });

            // 2. Delete Workflow Comments
            await tx.workflowComment.deleteMany({
                where: { invoiceId }
            });

            // 3. Delete Documents (Attachments) specifically linked to the Invoice
            await tx.document.deleteMany({
                where: { linkedId: invoiceId }
            });

            // 4. Delete Invoice Items
            await tx.invoiceItem.deleteMany({
                where: { invoiceId }
            });

            // 5. Delete Invoice References
            if (invoice.refernceNumber) {
                await tx.invoiceReference.deleteMany({
                    where: { refernceId: invoice.refernceNumber }
                });
            }

            // 6. Delete the Invoice (statusHistory / rejections will cascade)
            await tx.invoice.delete({
                where: { id: invoiceId }
            });
        });

        revalidatePath("/invoices");
        return { success: true };
    } catch (error) {
        console.error("Error in deleteInvoice:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to delete invoice" };
    }
}
