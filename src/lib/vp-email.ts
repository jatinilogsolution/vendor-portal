// src/lib/vp-email.ts
// Drop-in email triggers for every VP status change.
// Import and call from server actions — never from client.

 import { prisma }    from "@/lib/prisma"
import { sendEmail } from "@/services/mail"

// ── Shared resolver ────────────────────────────────────────────

async function getVendorEmails(vendorId: string): Promise<string[]> {
  const users = await prisma.user.findMany({
    where: {
      role:     "VENDOR",
      Vendor:   { vpVendors: { some: { id: vendorId } } },
    },
    select: { email: true },
  })
  return users.map((u) => u.email).filter(Boolean)
}

async function getInternalEmails(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where:  { role: { in: ["ADMIN", "BOSS"] } },
    select: { email: true },
  })
  return users.map((u) => u.email)
}

async function getAdminEmails(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where:  { role: "ADMIN" },
    select: { email: true },
  })
  return users.map((u) => u.email)
}

async function getBossEmails(): Promise<string[]> {
  const users = await prisma.user.findMany({
    where:  { role: "BOSS" },
    select: { email: true },
  })
  return users.map((u) => u.email)
}

// ── Helpers ────────────────────────────────────────────────────

const PORTAL = "AWL India Vendor Portal"

function wrap(title: string, body: string): string {
  return `
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto">
      <div style="background:#1e293b;padding:16px 24px">
        <h2 style="color:#fff;margin:0;font-size:16px">${PORTAL}</h2>
      </div>
      <div style="padding:24px;border:1px solid #e5e7eb;border-top:none">
        <h3 style="color:#1e293b;margin:0 0 16px">${title}</h3>
        ${body}
        <hr style="margin:24px 0;border:none;border-top:1px solid #e5e7eb"/>
        <p style="color:#6b7280;font-size:12px;margin:0">
          This is an automated message from ${PORTAL}.
          Please do not reply to this email.
        </p>
      </div>
    </div>
  `
}

function btn(label: string, href: string): string {
  return `
    <a href="${href}" style="
      display:inline-block;background:#2563eb;color:#fff;
      padding:10px 20px;border-radius:6px;text-decoration:none;
      font-size:14px;font-weight:600;margin-top:16px
    ">${label}</a>
  `
}

function row(label: string, value: string): string {
  return `
    <tr>
      <td style="color:#6b7280;font-size:13px;padding:4px 0;width:140px">${label}</td>
      <td style="color:#1e293b;font-size:13px;padding:4px 0;font-weight:600">${value}</td>
    </tr>
  `
}

function table(...rows: string[]): string {
  return `<table style="width:100%;border-collapse:collapse">${rows.join("")}</table>`
}

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"

// ─────────────────────────────────────────────────────────────────────────────
// PURCHASE ORDER EMAILS
// ─────────────────────────────────────────────────────────────────────────────

export async function emailPoSubmitted(poId: string) {
  const po = await prisma.vpPurchaseOrder.findUnique({
    where:  { id: poId },
    select: { poNumber: true, grandTotal: true, createdBy: { select: { name: true } } },
  })
  if (!po) return
  const bossEmails = await getBossEmails()
  if (!bossEmails.length) return

  await sendEmail({
    to:           bossEmails,
    subject:      `PO ${po.poNumber} submitted for approval`,
    html:         wrap(
      "Purchase Order Awaiting Approval",
      `
      <p>A purchase order has been submitted and requires your approval.</p>
      ${table(
        row("PO Number",   po.poNumber),
        row("Amount",      `₹${po.grandTotal.toLocaleString("en-IN")}`),
        row("Submitted by",po.createdBy.name),
      )}
      ${btn("Review & Approve", `${BASE}/vendor-portal/admin/purchase-orders/${poId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpPurchaseOrder",
    relatedId:    poId,
  })
}

export async function emailPoApproved(poId: string) {
  const po = await prisma.vpPurchaseOrder.findUnique({
    where:  { id: poId },
    select: {
      poNumber:   true,
      grandTotal: true,
      approvedBy: { select: { name: true } },
      createdBy:  { select: { email: true } },
    },
  })
  if (!po) return

  await sendEmail({
    to:           po.createdBy.email,
    subject:      `PO ${po.poNumber} approved`,
    html:         wrap(
      "Purchase Order Approved ✓",
      `
      <p>Your purchase order has been approved by management.</p>
      ${table(
        row("PO Number",  po.poNumber),
        row("Amount",     `₹${po.grandTotal.toLocaleString("en-IN")}`),
        row("Approved by",po.approvedBy?.name ?? "—"),
      )}
      <p>You can now send this PO to the vendor.</p>
      ${btn("View PO", `${BASE}/vendor-portal/admin/purchase-orders/${poId}`)}
      `,
    ),
    templateType: "APPROVAL",
    relatedModel: "VpPurchaseOrder",
    relatedId:    poId,
  })
}

export async function emailPoRejected(poId: string, reason: string) {
  const po = await prisma.vpPurchaseOrder.findUnique({
    where:  { id: poId },
    select: { poNumber: true, createdBy: { select: { email: true } } },
  })
  if (!po) return

  await sendEmail({
    to:           po.createdBy.email,
    subject:      `PO ${po.poNumber} rejected`,
    html:         wrap(
      "Purchase Order Rejected",
      `
      <p>Your purchase order has been rejected.</p>
      ${table(
        row("PO Number", po.poNumber),
        row("Reason",    reason),
      )}
      <p>Please revise and resubmit.</p>
      ${btn("View PO", `${BASE}/vendor-portal/admin/purchase-orders/${poId}`)}
      `,
    ),
    templateType: "REJECTION",
    relatedModel: "VpPurchaseOrder",
    relatedId:    poId,
  })
}

export async function emailPoSentToVendor(poId: string) {
  const po = await prisma.vpPurchaseOrder.findUnique({
    where:  { id: poId },
    select: {
      poNumber:   true,
      grandTotal: true,
      vendorId:   true,
      deliveryDate: true,
    },
  })
  if (!po) return
  const vendorEmails = await getVendorEmails(po.vendorId)
  if (!vendorEmails.length) return

  await sendEmail({
    to:           vendorEmails,
    subject:      `New Purchase Order ${po.poNumber} from AWL India`,
    html:         wrap(
      "New Purchase Order Received",
      `
      <p>A new purchase order has been issued to you. Please review and acknowledge.</p>
      ${table(
        row("PO Number",    po.poNumber),
        row("Value",        `₹${po.grandTotal.toLocaleString("en-IN")}`),
        row("Delivery By",  po.deliveryDate
          ? new Date(po.deliveryDate).toLocaleDateString("en-IN")
          : "TBD"),
      )}
      ${btn("View & Acknowledge", `${BASE}/vendor-portal/vendor/my-pos/${poId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpPurchaseOrder",
    relatedId:    poId,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// INVOICE EMAILS
// ─────────────────────────────────────────────────────────────────────────────

export async function emailInvoiceSubmitted(invoiceId: string) {
  const inv = await prisma.vpInvoice.findUnique({
    where:  { id: invoiceId },
    select: {
      invoiceNumber: true,
      totalAmount:   true,
      vendor: { select: { existingVendor: { select: { name: true } } } },
    },
  })
  if (!inv) return
  const adminEmails = await getAdminEmails()
  if (!adminEmails.length) return

  await sendEmail({
    to:           adminEmails,
    subject:      `New invoice received: ${inv.invoiceNumber ?? "—"}`,
    html:         wrap(
      "Vendor Invoice Submitted",
      `
      <p>A vendor has submitted an invoice for review.</p>
      ${table(
        row("Invoice No.", inv.invoiceNumber ?? "—"),
        row("Vendor",      inv.vendor.existingVendor.name),
        row("Amount",      `₹${inv.totalAmount.toLocaleString("en-IN")}`),
      )}
      ${btn("Review Invoice", `${BASE}/vendor-portal/admin/invoices/${invoiceId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpInvoice",
    relatedId:    invoiceId,
  })
}

export async function emailInvoiceApproved(invoiceId: string) {
  const inv = await prisma.vpInvoice.findUnique({
    where:  { id: invoiceId },
    select: {
      invoiceNumber: true,
      totalAmount:   true,
      vendorId:      true,
      createdBy:     { select: { email: true } },
    },
  })
  if (!inv) return

  await sendEmail({
    to:           inv.createdBy.email,
    subject:      `Invoice ${inv.invoiceNumber ?? ""} approved — payment will be initiated`,
    html:         wrap(
      "Invoice Approved ✓",
      `
      <p>Your invoice has been approved by AWL India management.</p>
      ${table(
        row("Invoice No.", inv.invoiceNumber ?? "—"),
        row("Amount",      `₹${inv.totalAmount.toLocaleString("en-IN")}`),
        row("Status",      "Approved — Payment Pending"),
      )}
      <p>Payment will be initiated shortly as per agreed terms.</p>
      ${btn("View Invoice", `${BASE}/vendor-portal/vendor/my-invoices/${invoiceId}`)}
      `,
    ),
    templateType: "APPROVAL",
    relatedModel: "VpInvoice",
    relatedId:    invoiceId,
  })
}

export async function emailInvoiceRejected(invoiceId: string, reason: string) {
  const inv = await prisma.vpInvoice.findUnique({
    where:  { id: invoiceId },
    select: {
      invoiceNumber: true,
      createdBy:     { select: { email: true } },
    },
  })
  if (!inv) return

  await sendEmail({
    to:           inv.createdBy.email,
    subject:      `Invoice ${inv.invoiceNumber ?? ""} rejected`,
    html:         wrap(
      "Invoice Rejected",
      `
      <p>Your invoice has been rejected. Please review the reason and resubmit.</p>
      ${table(
        row("Invoice No.", inv.invoiceNumber ?? "—"),
        row("Reason",      reason),
      )}
      ${btn("View Invoice", `${BASE}/vendor-portal/vendor/my-invoices/${invoiceId}`)}
      `,
    ),
    templateType: "REJECTION",
    relatedModel: "VpInvoice",
    relatedId:    invoiceId,
  })
}

export async function emailPaymentInitiated(invoiceId: string, amount: number) {
  const inv = await prisma.vpInvoice.findUnique({
    where:  { id: invoiceId },
    select: {
      invoiceNumber: true,
      createdBy:     { select: { email: true, name: true } },
    },
  })
  if (!inv) return

  await sendEmail({
    to:           inv.createdBy.email,
    subject:      `Payment initiated for invoice ${inv.invoiceNumber ?? ""}`,
    html:         wrap(
      "Payment Initiated 💳",
      `
      <p>Dear ${inv.createdBy.name},</p>
      <p>Payment has been initiated for your invoice.</p>
      ${table(
        row("Invoice No.", inv.invoiceNumber ?? "—"),
        row("Amount",      `₹${amount.toLocaleString("en-IN")}`),
        row("Status",      "Payment Initiated — processing"),
      )}
      <p>You will receive confirmation once the payment is completed.</p>
      ${btn("View Invoice", `${BASE}/vendor-portal/vendor/my-invoices/${invoiceId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpInvoice",
    relatedId:    invoiceId,
  })
}

export async function emailPaymentConfirmed(invoiceId: string, amount: number) {
  const inv = await prisma.vpInvoice.findUnique({
    where:  { id: invoiceId },
    select: {
      invoiceNumber: true,
      createdBy:     { select: { email: true, name: true } },
    },
  })
  if (!inv) return

  await sendEmail({
    to:           inv.createdBy.email,
    subject:      `Payment confirmed for invoice ${inv.invoiceNumber ?? ""}`,
    html:         wrap(
      "Payment Confirmed ✅",
      `
      <p>Dear ${inv.createdBy.name},</p>
      <p>Your payment has been successfully completed.</p>
      ${table(
        row("Invoice No.", inv.invoiceNumber ?? "—"),
        row("Amount Paid", `₹${amount.toLocaleString("en-IN")}`),
        row("Status",      "COMPLETED"),
      )}
      ${btn("View Invoice", `${BASE}/vendor-portal/vendor/my-invoices/${invoiceId}`)}
      `,
    ),
    templateType: "APPROVAL",
    relatedModel: "VpInvoice",
    relatedId:    invoiceId,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// PROFORMA INVOICE EMAILS
// ─────────────────────────────────────────────────────────────────────────────

export async function emailPiSubmitted(piId: string) {
  const pi = await prisma.vpProformaInvoice.findUnique({
    where:  { id: piId },
    select: {
      piNumber:     true,
      grandTotal:   true,
      raisedByVendor: true,
      vendor: { select: { existingVendor: { select: { name: true } } } },
    },
  })
  if (!pi) return
  const recipients = pi.raisedByVendor
    ? await getInternalEmails()   // vendor raised → notify admin+boss
    : await getBossEmails()        // admin raised → notify boss

  await sendEmail({
    to:           recipients,
    subject:      `Proforma Invoice ${pi.piNumber} ${pi.raisedByVendor ? "received" : "submitted for approval"}`,
    html:         wrap(
      pi.raisedByVendor
        ? "Vendor Quote Received"
        : "Proforma Invoice Awaiting Approval",
      `
      <p>${pi.raisedByVendor
        ? `${pi.vendor.existingVendor.name} has submitted a proforma invoice/quote.`
        : "A proforma invoice has been submitted for your approval."
      }</p>
      ${table(
        row("PI Number", pi.piNumber),
        row("Vendor",    pi.vendor.existingVendor.name),
        row("Amount",    `₹${pi.grandTotal.toLocaleString("en-IN")}`),
      )}
      ${btn("View PI", `${BASE}/vendor-portal/admin/proforma-invoices/${piId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpProformaInvoice",
    relatedId:    piId,
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// PROCUREMENT EMAILS
// ─────────────────────────────────────────────────────────────────────────────

export async function emailProcurementSubmitted(prId: string) {
  const pr = await prisma.vpProcurement.findUnique({
    where:  { id: prId },
    select: { prNumber: true, title: true, grandTotal: true },
  })
  if (!pr) return
  const bossEmails = await getBossEmails()

  await sendEmail({
    to:           bossEmails,
    subject:      `Procurement Request ${pr.prNumber} awaiting approval`,
    html:         wrap(
      "Procurement Request Submitted",
      `
      <p>A procurement request has been submitted for your approval.</p>
      ${table(
        row("PR Number",  pr.prNumber),
        row("Title",      pr.title),
        row("Est. Value", `₹${pr.grandTotal.toLocaleString("en-IN")}`),
      )}
      ${btn("Review & Approve", `${BASE}/vendor-portal/admin/procurement/${prId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpPurchaseOrder",
    relatedId:    prId,
  })
}

export async function emailProcurementOpenForQuotes(
  prId:      string,
  vendorEmails: string[],
) {
  const pr = await prisma.vpProcurement.findUnique({
    where:  { id: prId },
    select: { prNumber: true, title: true, requiredByDate: true },
  })
  if (!pr || !vendorEmails.length) return

  await sendEmail({
    to:           vendorEmails,
    subject:      `Quote invitation: ${pr.prNumber} — ${pr.title}`,
    html:         wrap(
      "You Are Invited to Quote",
      `
      <p>AWL India has invited you to submit a proforma invoice for the following procurement:</p>
      ${table(
        row("PR Number",    pr.prNumber),
        row("Title",        pr.title),
        row("Required By",  pr.requiredByDate
          ? new Date(pr.requiredByDate).toLocaleDateString("en-IN")
          : "TBD"),
      )}
      <p>Please log in to the vendor portal to view the requirement and submit your quote.</p>
      ${btn("Submit Quote", `${BASE}/vendor-portal/vendor/my-quotes/new?procurementId=${prId}`)}
      `,
    ),
    templateType: "STATUS_CHANGE",
    relatedModel: "VpPurchaseOrder",
    relatedId:    prId,
  })
}