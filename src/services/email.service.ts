import { prisma } from "@/lib/prisma";

interface EmailOptions {
    to: string;
    subject: string;
    body: string;
    templateType: "REJECTION" | "APPROVAL" | "STATUS_CHANGE";
    relatedModel?: string;
    relatedId?: string;
    recipientId?: string;
}

/**
 * Service to handle email notifications
 * Currently logs to the database and console.
 * Actual email integration can be added here.
 */
export async function sendEmail(options: EmailOptions) {
    // Log email in database
    const emailLog = await prisma.emailNotificationLog.create({
        data: {
            recipientEmail: options.to,
            recipientId: options.recipientId,
            subject: options.subject,
            body: options.body,
            templateType: options.templateType,
            relatedModel: options.relatedModel,
            relatedId: options.relatedId,
            status: "PENDING"
        }
    });

    try {
        // Actual email integration (e.g. Resend, SendGrid, etc.) would go here
        // For now, we simulate sending by logging to console
        console.log("📧 Email to send:", {
            to: options.to,
            subject: options.subject,
            preview: options.body.substring(0, 100)
        });

        // Update status to SENT
        await prisma.emailNotificationLog.update({
            where: { id: emailLog.id },
            data: {
                status: "SENT",
                sentAt: new Date()
            }
        });

        return { success: true, emailLogId: emailLog.id };
    } catch (error) {
        console.error("❌ Failed to send email:", error);

        // Update status to FAILED
        await prisma.emailNotificationLog.update({
            where: { id: emailLog.id },
            data: {
                status: "FAILED",
                error: error instanceof Error ? error.message : "Unknown error"
            }
        });

        return { success: false, error };
    }
}

/**
 * Send rejection notification
 */
export async function sendRejectionEmail(
    recipientEmail: string,
    recipientId: string | null,
    rejectionDetails: {
        type: "Annexure" | "Invoice" | "AnnexureFileGroup";
        entityName: string;
        reason: string;
        rejectedBy: string;
        affectedLRs?: string;
    }
) {
    const subject = `Rejected: ${rejectionDetails.type} - ${rejectionDetails.entityName}`;
    const body = `
    Your ${rejectionDetails.type} "${rejectionDetails.entityName}" has been rejected.
    
    Rejected by: ${rejectionDetails.rejectedBy}
    
    Reason for rejection:
    ${rejectionDetails.reason}
    
    ${rejectionDetails.affectedLRs ? `Affected LRs: ${rejectionDetails.affectedLRs}\n` : ""}
    
    Please review the details and resubmit after making the necessary corrections.
  `;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        body,
        templateType: "REJECTION",
        relatedModel: rejectionDetails.type,
        relatedId: rejectionDetails.entityName
    });
}

/**
 * Send approval notification
 */
export async function sendApprovalEmail(
    recipientEmail: string,
    recipientId: string | null,
    approvalDetails: {
        type: "Annexure" | "Invoice";
        entityName: string;
        approvedBy: string;
        nextStep?: string;
    }
) {
    const subject = `Approved: ${approvalDetails.type} - ${approvalDetails.entityName}`;
    const body = `
    Your ${approvalDetails.type} "${approvalDetails.entityName}" has been approved.
    
    Approved by: ${approvalDetails.approvedBy}
    
    ${approvalDetails.nextStep ? `Next Step: ${approvalDetails.nextStep}` : "The process is complete."}
  `;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        body,
        templateType: "APPROVAL",
        relatedModel: approvalDetails.type,
        relatedId: approvalDetails.entityName
    });
}

/**
 * Send status change notification
 */
export async function sendStatusChangeEmail(
    recipientEmail: string,
    recipientId: string | null,
    details: {
        type: "Annexure" | "Invoice";
        entityName: string;
        fromStatus?: string;
        toStatus: string;
        changedBy: string;
    }
) {
    const subject = `Status Updated: ${details.type} - ${details.entityName}`;
    const body = `
    The status of ${details.type} "${details.entityName}" has been updated.
    
    New Status: ${details.toStatus}
    ${details.fromStatus ? `Previous Status: ${details.fromStatus}` : ""}
    Updated by: ${details.changedBy}
  `;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        body,
        templateType: "STATUS_CHANGE",
        relatedModel: details.type,
        relatedId: details.entityName
    });
}

/**
 * Send a manual notification with custom title and body
 */
export async function sendManualEmail(
    recipientEmail: string,
    recipientId: string | null,
    details: {
        title: string;
        description: string;
        type: string; // "REJECTION", "ERROR", "NOTICE", etc.
        fromUser: string;
    }
) {
    const subject = `[${details.type}] ${details.title}`;
    const body = `
    Message from: ${details.fromUser}
    Notification Type: ${details.type}
    
    ${details.description}
    
    ---
    This is a manual notification sent via the workflow system.
  `;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        body,
        templateType: "STATUS_CHANGE", // Using STATUS_CHANGE as a base for manual notifications
        relatedModel: "Manual",
        relatedId: details.title
    });
}
