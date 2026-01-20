"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { UserRoleEnum, InvoiceStatus, AnnexureStatus } from "@/utils/constant";
import { sendManualEmail } from "@/services/mail";

/**
 * Add a comment to a workflow (Annexure or Invoice)
 */
export async function addWorkflowComment({
    content,
    authorId,
    authorRole,
    attachmentUrl,
    attachmentName,
    annexureId,
    invoiceId,
    isPrivate,
}: {
    content: string;
    authorId: string;
    authorRole: string;
    attachmentUrl?: string;
    attachmentName?: string;
    annexureId?: string;
    invoiceId?: string;
    isPrivate?: boolean;
}) {
    try {
        if (!content.trim() && !attachmentUrl) throw new Error("Comment content or attachment is required");

        // CHECK: If it's an invoice, check if it's already in PAYMENT_APPROVED status (lock for vendors)
        if (invoiceId && authorRole === UserRoleEnum.TVENDOR) {
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
                select: { status: true }
            });
            if (invoice?.status === InvoiceStatus.PAYMENT_APPROVED) {
                throw new Error("Cannot add comments to an invoice that has been approved for payment.");
            }
        }

        let finalAnnexureId = annexureId;
        let finalInvoiceId = invoiceId;

        // 🔗 Shared Chat Logic: Link both IDs if one is missing
        if (annexureId && !invoiceId) {
            const linkedInvoice = await prisma.invoice.findFirst({
                where: { annexureId },
                select: { id: true }
            });
            if (linkedInvoice) finalInvoiceId = linkedInvoice.id;
        } else if (invoiceId && !annexureId) {
            const linkedAnnexure = await prisma.invoice.findUnique({
                where: { id: invoiceId },
                select: { annexureId: true }
            });
            if (linkedAnnexure?.annexureId) finalAnnexureId = linkedAnnexure.annexureId;
        }

        // 🔒 Privacy restriction: TVENDOR cannot mark comments as private
        const finalIsPrivate = (authorRole === UserRoleEnum.TVENDOR) ? false : (isPrivate || false);

        const comment = await prisma.workflowComment.create({
            data: {
                content,
                authorId,
                authorRole,
                attachmentUrl,
                attachmentName,
                annexureId: finalAnnexureId,
                invoiceId: finalInvoiceId,
                isPrivate: finalIsPrivate,
            },
            include: {
                Author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            }
        });

        if (annexureId) revalidatePath(`/lorries/annexure/${annexureId}`);
        if (invoiceId) revalidatePath(`/invoices/${invoiceId}`);

        return { success: true, data: comment };
    } catch (error) {
        console.error("Error in addWorkflowComment:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to add comment" };
    }
}

/**
 * Get comments for a workflow (Unified Annexure + Invoice)
 */
export async function getWorkflowComments(params: { 
    annexureId?: string; 
    invoiceId?: string; 
    role?: string;
    lastCreatedAt?: Date;
}) {
    try {
        let { annexureId, invoiceId, lastCreatedAt } = params;

        // Try to bind them if not both provided
        if (annexureId && !invoiceId) {
            const annexure = await prisma.annexure.findUnique({
                where: { id: annexureId },
                include: { invoices: { select: { id: true } } }
            });
            if (annexure?.invoices?.[0]) invoiceId = annexure.invoices[0].id;
        } else if (invoiceId && !annexureId) {
            const invoice = await prisma.invoice.findUnique({
                where: { id: invoiceId },
                select: { annexureId: true }
            });
            if (invoice?.annexureId) annexureId = invoice.annexureId;
        }

        const comments = await prisma.workflowComment.findMany({
            where: {
                AND: [
                    {
                        OR: [
                            { annexureId: annexureId ? annexureId : "NON_EXISTENT_ID" },
                            { invoiceId: invoiceId ? invoiceId : "NON_EXISTENT_ID" }
                        ]
                    },
                    // Role-based privacy filter: Vendors can't see private comments
                    params.role === UserRoleEnum.TVENDOR ? { isPrivate: false } : {},
                    // Incremental fetching filter
                    lastCreatedAt ? { createdAt: { gt: new Date(lastCreatedAt) } } : {}
                ]
            },
            include: {
                Author: {
                    select: {
                        name: true,
                        image: true
                    }
                }
            },
            orderBy: {
                createdAt: "asc"
            }
        });

        return { success: true, data: comments };
    } catch (error) {
        console.error("Error in getWorkflowComments:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch comments" };
    }
}

/**
 * Send a workflow comment as an email notification
 */
export async function sendCommentAsEmail({
    commentId,
    userId,
    recipientRole, // Who should receive this email?
}: {
    commentId: string;
    userId: string;
    recipientRole: UserRoleEnum;
}) {
    try {
        const comment = await prisma.workflowComment.findUnique({
            where: { id: commentId },
            include: {
                Author: true,
                Annexure: { include: { LRRequest: { include: { tvendor: { include: { users: true } } } } } },
                Invoice: { include: { vendor: { include: { users: true } } } }
            }
        });

        if (!comment) throw new Error("Comment not found");

        // Determine recipient email
        let recipientEmail = "";
        let recipientId = "";
        
        if (recipientRole === UserRoleEnum.TVENDOR) {
            // Find vendor email
            const vendor = comment.Invoice?.vendor || comment.Annexure?.LRRequest[0]?.tvendor;
            recipientEmail = vendor?.contactEmail || vendor?.users?.[0]?.email || "";
            recipientId = vendor?.id || "";
        } else {
            // Find admin/boss emails (first one for now)
            const admin = await prisma.user.findFirst({
                where: { role: recipientRole as any }
            });
            recipientEmail = admin?.email || "";
            recipientId = admin?.id || "";
        }

        if (!recipientEmail) throw new Error("Recipient email not found");

        const result = await sendManualEmail(recipientEmail, recipientId, {
            title: `New Comment on ${comment.Invoice?.refernceNumber || comment.Annexure?.name || "Workflow"}`,
            description: comment.content,
            type: "Workflow Comment",
            fromUser: comment.Author.name || "System"
        });

        return result;
    } catch (error) {
        console.error("Error in sendCommentAsEmail:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to send email" };
    }
}

/**
 * Get all notifications (comments) for a user globally
 */
export async function getGlobalNotifications(params: {
    role: string;
    userId: string;
}) {
    try {
        const { role, userId } = params;

        // If TVENDOR, only show comments linked to their invoices/annexures
        let vendorId: string | null = null;
        if (role === UserRoleEnum.TVENDOR) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: { vendorId: true }
            });
            vendorId = user?.vendorId || null;
        }

        const comments = await prisma.workflowComment.findMany({
            where: {
                AND: [
                    // Privacy filter
                    role === UserRoleEnum.TVENDOR ? { isPrivate: false } : {},
                    // Vendor filter for TVENDOR
                    role === UserRoleEnum.TVENDOR && vendorId ? {
                        OR: [
                            { Annexure: { vendorId } },
                            { Invoice: { vendorId } }
                        ]
                    } : {},
                ]
            },
            include: {
                Author: {
                    select: {
                        name: true,
                        image: true
                    }
                },
                Invoice: {
                    select: {
                        refernceNumber: true
                    }
                },
                Annexure: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            take: 50
        });

        return { success: true, data: comments };
    } catch (error) {
        console.error("Error in getGlobalNotifications:", error);
        return { success: false, error: error instanceof Error ? error.message : "Failed to fetch global notifications" };
    }
}
