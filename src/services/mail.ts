import * as nodemailer from "nodemailer"
import { prisma } from "@/lib/prisma"

type SendMailOptions = {
    to: string
    subject: string
    html?: string
    text?: string
    body?: string
    templateType?: "REJECTION" | "APPROVAL" | "STATUS_CHANGE" | "AUTH" | "MANUAL"
    relatedModel?: string
    relatedId?: string
    recipientId?: string
}

let transporter: nodemailer.Transporter

export const getTransporter = () => {
    if (!transporter) {
        transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_APP_PASSWORD,
            },
        })
    }
    return transporter
}

/**
 * Core Email Sender with Database Logging
 */
export const sendEmail = async (options: SendMailOptions) => {
    const { to, subject, html, text, body, templateType = "MANUAL", relatedModel, relatedId, recipientId } = options
    const transporter = getTransporter()

    const finalHtml = html || body || "";
    const finalTxt = text || body || "HTML Content";

    // 1. Log in Database first as PENDING
    const emailLog = await prisma.emailNotificationLog.create({
        data: {
            recipientEmail: to,
            recipientId: recipientId,
            subject: subject,
            body: finalTxt, // Store text version if available
            templateType: templateType === "AUTH" ? "STATUS_CHANGE" : templateType, // Map AUTH to closest schema type if needed
            relatedModel: relatedModel || "Email",
            relatedId: relatedId || "Manual",
            status: "PENDING"
        }
    })

    try {
        const info = await transporter.sendMail({
            from: `"AWL India" <${process.env.SMTP_FROM || process.env.NODEMAILER_USER}>`,
            to,
            subject: subject.startsWith("Vendor Portal") ? subject : `Vendor Portal - ${subject}`,
            text: finalTxt,
            html: finalHtml,
        })

        console.log("✅ Email sent:", info.messageId)

        // 2. Update status to SENT
        await prisma.emailNotificationLog.update({
            where: { id: emailLog.id },
            data: {
                status: "SENT",
                sentAt: new Date()
            }
        })

        return { success: true, messageId: info.messageId, emailLogId: emailLog.id }
    } catch (error) {
        console.error("❌ Email failed:", error)

        // 3. Update status to FAILED
        await prisma.emailNotificationLog.update({
            where: { id: emailLog.id },
            data: {
                status: "FAILED",
                error: error instanceof Error ? error.message : "Unknown error"
            }
        })

        return { success: false, error }
    }
}

/**
 * --- WORKFLOW HELPERS (from email.service) ---
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
    const bodyText = `Your ${rejectionDetails.type} "${rejectionDetails.entityName}" has been rejected.\n\nRejected by: ${rejectionDetails.rejectedBy}\n\nReason: ${rejectionDetails.reason}\n${rejectionDetails.affectedLRs ? `\nAffected LRs: ${rejectionDetails.affectedLRs}` : ""}\n\nPlease review and resubmit.`;
    
    // Simple HTML wrap
    const html = `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #dc2626;">Rejection Notice</h2>
        <p>Your <strong>${rejectionDetails.type}</strong> "${rejectionDetails.entityName}" has been rejected.</p>
        <p><strong>Rejected by:</strong> ${rejectionDetails.rejectedBy}</p>
        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 5px; margin: 15px 0;">
            <strong>Reason for rejection:</strong><br/>
            ${rejectionDetails.reason.replace(/\n/g, '<br/>')}
        </div>
        ${rejectionDetails.affectedLRs ? `<p><strong>Affected LRs:</strong> ${rejectionDetails.affectedLRs}</p>` : ""}
        <p style="color: #6b7280; font-size: 14px;">This is an automated notification from the Vendor Portal Workflow.</p>
    </div>`;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        text: bodyText,
        html,
        templateType: "REJECTION",
        relatedModel: rejectionDetails.type,
        relatedId: rejectionDetails.entityName
    });
}

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
    const html = `<div style="font-family: sans-serif; padding: 20px;">
        <h2 style="color: #059669;">Approval Notice</h2>
        <p>Your <strong>${approvalDetails.type}</strong> "${approvalDetails.entityName}" has been approved.</p>
        <p><strong>Approved by:</strong> ${approvalDetails.approvedBy}</p>
        ${approvalDetails.nextStep ? `<p><strong>Next Step:</strong> ${approvalDetails.nextStep}</p>` : "<p>The process is complete for this stage.</p>"}
    </div>`;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        html,
        templateType: "APPROVAL",
        relatedModel: approvalDetails.type,
        relatedId: approvalDetails.entityName
    });
}

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
    const html = `<div style="font-family: sans-serif; padding: 20px;">
        <h3>Status Update Notice</h3>
        <p>The status of your <strong>${details.type}</strong> "${details.entityName}" has been updated.</p>
        <p><strong>New Status:</strong> ${details.toStatus}</p>
        ${details.fromStatus ? `<p><strong>Previous Status:</strong> ${details.fromStatus}</p>` : ""}
        <p><strong>Updated by:</strong> ${details.changedBy}</p>
    </div>`;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        html,
        templateType: "STATUS_CHANGE",
        relatedModel: details.type,
        relatedId: details.entityName
    });
}

export async function sendManualEmail(
    recipientEmail: string,
    recipientId: string | null,
    details: {
        title: string;
        description: string;
        type: string;
        fromUser: string;
    }
) {
    const subject = `[${details.type}] ${details.title}`;
    const html = `<div style="font-family: sans-serif; padding: 20px;">
        <h3>Notification from ${details.fromUser}</h3>
        <p><strong>Type:</strong> ${details.type}</p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
            ${details.description.replace(/\n/g, '<br/>')}
        </div>
        <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 20px 0;" />
        <p style="font-size: 12px; color: #9ca3af;">Manual notification sent via AWL Vendor Portal.</p>
    </div>`;

    return sendEmail({
        to: recipientEmail,
        recipientId: recipientId || undefined,
        subject,
        html,
        templateType: "MANUAL",
        relatedModel: "Manual",
        relatedId: details.title
    });
}

/**
 * --- AUTH HELPERS (from send-email.action) ---
 */

export async function sendAuthEmail({
    to,
    subject,
    meta,
}: {
    to: string;
    subject: string;
    meta: {
        description: string;
        link: string;
        user: string;
        buttonTitle: string;
    };
}) {
    const html = `
    <html dir="ltr" lang="en">
    <head>
        <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    </head>
    <body style='background-color:rgb(243,244,246);font-family:sans-serif;padding-top:40px;padding-bottom:40px'>
        <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" style="background-color:rgb(255,255,255);border-radius:8px;max-width:500px;margin:auto;padding:32px">
            <tbody>
                <tr>
                    <td style="text-align:center;">
                        <h1 style="font-size:24px;margin-bottom:8px">Vendor Portal - AWL India</h1>
                        <p style="color:rgb(75,85,99);font-size:14px;">Secure Authentication Platform</p>
                    </td>
                </tr>
                <tr>
                    <td style="padding-top:32px">
                        <h2 style="font-size:20px;margin-bottom:16px">${subject}</h2>
                        <p style="font-size:16px;line-height:24px">Hi ${meta.user},</p>
                        <p style="font-size:16px;line-height:24px">${meta.description}</p>
                    </td>
                </tr>
                <tr>
                    <td style="text-align:center;padding:32px 0">
                        <a href="${meta.link}" style="background-color:rgb(37,99,235);color:white;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:500;display:inline-block;">
                            ${meta.buttonTitle}
                        </a>
                    </td>
                </tr>
                <tr style="border-top:1px solid #e5e7eb;padding-top:24px">
                    <td>
                        <p style="color:rgb(107,114,128);font-size:12px;text-align:center">
                            © 2025 AWL INDIA. All rights reserved.<br/>
                            Vatika Atrium, Sector 53, Gurugram
                        </p>
                    </td>
                </tr>
            </tbody>
        </table>
    </body>
    </html>`;

    return sendEmail({
        to,
        subject,
        html,
        templateType: "AUTH",
        relatedModel: "User",
        relatedId: meta.user
    });
}
