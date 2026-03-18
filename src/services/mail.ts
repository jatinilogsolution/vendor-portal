import * as nodemailer from "nodemailer";
import { prisma } from "@/lib/prisma";
import { marked } from "marked";

type SendMailOptions = {
  to: string | string[];
  cc?: string | string[];
  bcc?: string | string[];
  subject: string;
  html?: string;
  text?: string;
  body?: string;
  templateType?: "REJECTION" | "APPROVAL" | "STATUS_CHANGE" | "AUTH" | "MANUAL";
  relatedModel?: string;
  relatedId?: string;
  recipientId?: string;
};

let transporter: nodemailer.Transporter;

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
    });
  }
  return transporter;
};

/**
 * Utility to clean and normalize email addresses.
 * Splits by comma/semicolon, trims, removes empties, and removes ignored emails.
 */
function cleanRecipients(recipients: string | string[] | undefined): string[] {
  if (!recipients) return [];

  const list = Array.isArray(recipients)
    ? recipients
    : recipients.split(/[,;]/); // Split by comma or semicolon

  const unique = new Set<string>();

  list.forEach((email) => {
    const cleaned = email.trim();
    if (cleaned && cleaned.toLowerCase() !== "abc@xyz.com") {
      unique.add(cleaned);
    }
  });

  return Array.from(unique);
}

/**
 * Base HTML email template wrapper for consistent styling
 */
const getEmailTemplate = (content: string, themeColor = "#2563eb") => {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>AWL India - Vendor Portal</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;600&display=swap');
        
        body {
            margin: 0;
            padding: 0;
            width: 100%;
            background-color: #f8fafc;
            color: #1e293b;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .container {
            max-width: 600px;
            margin: 40px auto;
            background-color: #ffffff;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        
        .header {
            padding: 32px 40px;
            border-bottom: 1px solid #f1f5f9;
            text-align: left;
        }
        
        .content {
            padding: 40px;
            line-height: 1.6;
        }
        
        .footer {
            padding: 32px 40px;
            background-color: #f8fafc;
            border-top: 1px solid #e2e8f0;
            text-align: center;
            color: #64748b;
            font-size: 12px;
        }

        .btn {
            display: inline-block;
            padding: 12px 24px;
            background-color: ${themeColor};
            color: #ffffff !important;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 600;
            font-size: 14px;
            margin: 20px 0;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 100px;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
        }

        .data-table {
            width: 100%;
            margin: 24px 0;
            border-collapse: collapse;
        }

        .data-table td {
            padding: 12px 0;
            border-bottom: 1px solid #f1f5f9;
        }

        .label {
            color: #64748b;
            font-size: 13px;
            width: 140px;
        }

        .value {
            color: #1e293b;
            font-size: 14px;
            font-weight: 500;
        }

        .reason-box {
            background-color: #fff1f2;
            border-left: 4px solid #f43f5e;
            padding: 16px;
            border-radius: 4px;
            margin: 24px 0;
        }
        
        @media only screen and (max-width: 600px) {
            .container { margin: 0; border-radius: 0; border: none; }
            .content, .header, .footer { padding: 24px 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://www.awlindia.com/assets/images/heaer-logo.webp" alt="AWL India" height="40" style="display: block; margin-bottom: 16px;">
            <div style="font-size: 14px; color: #64748b; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">
                Vendor Portal Notification
            </div>
        </div>
        
        <div class="content">
            ${content}
        </div>
        
        <div class="footer">
            <p style="margin: 0 0 8px 0;">This is an automated message from the AWL India Vendor Portal.</p>
            <p style="margin: 0;">&copy; 2025 AWL India. Vatika Atrium, Sector 53, Gurugram, Haryana</p>
        </div>
    </div>
</body>
</html>
  `;
};

/**
 * Core Email Sender with Database Logging
 */
export const sendEmail = async (options: SendMailOptions) => {
  const {
    to,
    cc,
    bcc,
    subject,
    html,
    text,
    body,
    templateType = "MANUAL",
    relatedModel,
    relatedId,
    recipientId,
  } = options;

  const transporter = getTransporter();

  // Normalize and clean recipients
  const toList = cleanRecipients(to);
  const ccList = cleanRecipients(cc);
  const bccList = cleanRecipients(bcc);

  // Ensure visual distinction: Remove any CCs that are already in To
  const finalCcList = ccList.filter((email) => !toList.includes(email));
  const finalBccList = bccList.filter(
    (email) => !toList.includes(email) && !finalCcList.includes(email),
  );

  if (
    toList.length === 0 &&
    finalCcList.length === 0 &&
    finalBccList.length === 0
  ) {
    console.warn("⚠️ No valid recipients for email:", subject);
    return { success: false, error: "No valid recipients" };
  }

  const finalHtml = html || body || "";
  const finalTxt = text || body || "HTML Content";

  // 1. Log in Database first as PENDING
  const emailLog = await prisma.emailNotificationLog.create({
    data: {
      recipientEmail: toList.join(", "),
      recipientId: recipientId,
      subject: subject,
      body: finalTxt,
      templateType: templateType === "AUTH" ? "STATUS_CHANGE" : templateType,
      relatedModel: relatedModel || "Email",
      relatedId: relatedId || "Manual",
      status: "PENDING",
    },
  });

  try {
    const info = await transporter.sendMail({
      from: `"AWL India - Vendor Portal" <${process.env.SMTP_FROM || process.env.NODEMAILER_USER}>`,
      to: toList,
      cc: finalCcList,
      bcc: finalBccList,
      subject: subject.startsWith("Vendor Portal")
        ? subject
        : `Vendor Portal - ${subject}`,
      text: finalTxt,
      html: finalHtml,
    });

    // 2. Update status to SENT
    await prisma.emailNotificationLog.update({
      where: { id: emailLog.id },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });

    console.log(
      `✅ Email sent to: [${toList.join(", ")}] | CC: [${finalCcList.join(", ")}]`,
    );

    return {
      success: true,
      messageId: info.messageId,
      emailLogId: emailLog.id,
    };
  } catch (error) {
    console.error("❌ Email failed:", error);

    // 3. Update status to FAILED
    await prisma.emailNotificationLog.update({
      where: { id: emailLog.id },
      data: {
        status: "FAILED",
        error: error instanceof Error ? error.message : "Unknown error",
      },
    });

    return { success: false, error };
  }
};

/**
 * --- WORKFLOW HELPERS ---
 */

export async function sendRejectionEmail(
  recipientEmail: string | string[],
  recipientId: string | null,
  rejectionDetails: {
    type: "Annexure" | "Invoice" | "AnnexureFileGroup";
    entityName: string;
    reason: string;
    rejectedBy: string;
    affectedLRs?: string;
  },
  cc?: string | string[],
) {
  const subject = `Rejection Notice: ${rejectionDetails.type} - ${rejectionDetails.entityName}`;

  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Rejection Notice</h2>
    <p>Your ${rejectionDetails.type.toLowerCase()} has been reviewed and requires further action.</p>
    
    <table class="data-table">
        <tr>
            <td class="label">Reference</td>
            <td class="value">${rejectionDetails.entityName}</td>
        </tr>
        <tr>
            <td class="label">Status</td>
            <td class="value"><span class="badge" style="background-color: #fff1f2; color: #e11d48;">Rejected</span></td>
        </tr>
        <tr>
            <td class="label">Rejected By</td>
            <td class="value">${rejectionDetails.rejectedBy}</td>
        </tr>
        ${
          rejectionDetails.affectedLRs
            ? `
        <tr>
            <td class="label">Affected LRs</td>
            <td class="value">${rejectionDetails.affectedLRs}</td>
        </tr>`
            : ""
        }
    </table>

    <div class="reason-box">
        <div style="font-weight: 600; font-size: 13px; color: #be123c; margin-bottom: 4px;">REJECTION REASON:</div>
        <div style="color: #9f1239; font-size: 14px;">${rejectionDetails.reason}</div>
    </div>

    <div style="margin-top: 32px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || "https://vendor.awlindia.com"}" class="btn" style="background-color: #e11d48;">
            Review & Resubmit
        </a>
    </div>
  `;

  const bodyText = `Your ${rejectionDetails.type} "${rejectionDetails.entityName}" has been rejected by ${rejectionDetails.rejectedBy}.\n\nReason: ${rejectionDetails.reason}${rejectionDetails.affectedLRs ? `\nAffected LRs: ${rejectionDetails.affectedLRs}` : ""}`;

  return sendEmail({
    to: recipientEmail,
    cc,
    recipientId: recipientId || undefined,
    subject,
    text: bodyText,
    html: getEmailTemplate(content, "#e11d48"),
    templateType: "REJECTION",
    relatedModel: rejectionDetails.type,
    relatedId: rejectionDetails.entityName,
  });
}

export async function sendApprovalEmail(
  recipientEmail: string | string[],
  recipientId: string | null,
  approvalDetails: {
    type: "Annexure" | "Invoice";
    entityName: string;
    approvedBy: string;
    nextStep?: string;
  },
  cc?: string | string[],
) {
  const subject = `Approval Confirmation: ${approvalDetails.type} - ${approvalDetails.entityName}`;

  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Approval Confirmation</h2>
    <p>We are pleased to inform you that your ${approvalDetails.type.toLowerCase()} has been approved.</p>
    
    <table class="data-table">
        <tr>
            <td class="label">Reference</td>
            <td class="value">${approvalDetails.entityName}</td>
        </tr>
        <tr>
            <td class="label">Status</td>
            <td class="value"><span class="badge" style="background-color: #f0fdf4; color: #166534;">Approved</span></td>
        </tr>
        <tr>
            <td class="label">Approved By</td>
            <td class="value">${approvalDetails.approvedBy}</td>
        </tr>
        ${
          approvalDetails.nextStep
            ? `
        <tr>
            <td class="label">Next Action</td>
            <td class="value">${approvalDetails.nextStep}</td>
        </tr>`
            : ""
        }
    </table>

    <div style="margin-top: 32px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || "https://vendor.awlindia.com"}" class="btn">
            View in Portal
        </a>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    cc,
    recipientId: recipientId || undefined,
    subject,
    html: getEmailTemplate(content, "#10b981"),
    templateType: "APPROVAL",
    relatedModel: approvalDetails.type,
    relatedId: approvalDetails.entityName,
  });
}

export async function sendStatusChangeEmail(
  recipientEmail: string | string[],
  recipientId: string | null,
  details: {
    type: "Annexure" | "Invoice";
    entityName: string;
    fromStatus?: string;
    toStatus: string;
    changedBy: string;
  },
  cc?: string | string[],
) {
  const subject = `Status Update: ${details.entityName}`;

  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Status Update</h2>
    <p>There has been a status update regarding your ${details.type.toLowerCase()}.</p>
    
    <table class="data-table">
        <tr>
            <td class="label">Reference</td>
            <td class="value">${details.entityName}</td>
        </tr>
        ${
          details.fromStatus
            ? `
        <tr>
            <td class="label">From</td>
            <td class="value"><span style="text-decoration: line-through; opacity: 0.5;">${details.fromStatus}</span></td>
        </tr>`
            : ""
        }
        <tr>
            <td class="label">New Status</td>
            <td class="value"><span class="badge" style="background-color: #eff6ff; color: #1e40af;">${details.toStatus}</span></td>
        </tr>
        <tr>
            <td class="label">Updated By</td>
            <td class="value">${details.changedBy}</td>
        </tr>
    </table>

    <div style="margin-top: 32px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || "https://vendor.awlindia.com"}" class="btn" style="background-color: #3b82f6;">
            View Details
        </a>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    cc,
    recipientId: recipientId || undefined,
    subject,
    html: getEmailTemplate(content, "#3b82f6"),
    templateType: "STATUS_CHANGE",
    relatedModel: details.type,
    relatedId: details.entityName,
  });
}

export async function sendManualEmail(
  recipientEmail: string | string[],
  recipientId: string | null,
  details: {
    title: string;
    description: string;
    type: string;
    fromUser: string;
  },
  cc?: string | string[],
) {
  const subject = `${details.title}`;

  // Parse markdown description to HTML
  const descriptionHtml = await marked.parse(details.description, {
    breaks: true,
  });

  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">${details.title}</h2>
    <p style="color: #64748b; font-size: 14px; margin-bottom: 24px;">New notification from ${details.fromUser}</p>

    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px;">
        <div style="color: #64748b; font-size: 12px; font-weight: 600; text-transform: uppercase; margin-bottom: 8px;">Category: ${details.type}</div>
        <div style="color: #334155; font-size: 15px; line-height: 1.7;">
            ${descriptionHtml}
        </div>
    </div>

    <div style="margin-top: 32px; text-align: center;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_API_URL || "https://vendor.awlindia.com"}" class="btn" style="background-color: #6366f1;">
            Open Portal
        </a>
    </div>
  `;

  return sendEmail({
    to: recipientEmail,
    recipientId: recipientId || undefined,
    cc,
    subject,
    html: getEmailTemplate(content, "#6366f1"),
    templateType: "MANUAL",
    relatedModel: "Manual",
    relatedId: details.title,
  });
}

/**
 * --- AUTH HELPERS ---
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
  const content = `
    <h2 style="margin-top: 0; color: #1e293b;">Hello, ${meta.user}</h2>
    <p style="color: #334155; font-size: 15px; margin-bottom: 24px;">${meta.description}</p>

    <div style="text-align: center; margin: 32px 0;">
        <a href="${meta.link}" class="btn">
            ${meta.buttonTitle}
        </a>
    </div>

    <div style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 16px; margin: 24px 0;">
        <p style="margin: 0; color: #92400e; font-size: 13px; line-height: 1.5;">
            <strong>Security Notice:</strong> This link is time-sensitive and will expire soon. If you did not request this, please contact support immediately.
        </p>
    </div>

    <div style="margin-top: 24px;">
        <p style="margin: 0 0 8px 0; color: #94a3b8; font-size: 11px;">
            Copy and paste this link if the button doesn't work:
        </p>
        <p style="margin: 0; color: #64748b; font-size: 11px; word-break: break-all; font-family: monospace;">
            ${meta.link}
        </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: subject,
    html: getEmailTemplate(content, "#2563eb"),
    templateType: "AUTH",
    relatedModel: "User",
    relatedId: meta.user,
  });
}
