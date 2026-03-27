// src/actions/vp/settings.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdmin } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { VpActionResult } from "@/types/vendor-portal"
import { vpSettingSchema, VpSettingValues } from "@/validations/vp/delivery"

export type VpSettingRow = {
    id: string
    category: string
    name: string
    value: string | null
    description: string | null
    updatedAt: Date
}

// ── READ all ───────────────────────────────────────────────────

export async function getVpSettings(): Promise<VpActionResult<VpSettingRow[]>> {
    try {
        const rows = await prisma.vpSettings.findMany({
            orderBy: [{ category: "asc" }, { name: "asc" }],
        })
        return { success: true, data: rows }
    } catch (e) {
        return { success: false, error: "Failed to fetch settings" }
    }
}

// ── READ single by category + name ────────────────────────────

export async function getVpSetting(
    category: string,
    name: string,
): Promise<string | null> {
    try {
        const row = await prisma.vpSettings.findUnique({
            where: { category_name: { category, name } },
            select: { value: true },
        })
        return row?.value ?? null
    } catch {
        return null
    }
}

// ── UPSERT ─────────────────────────────────────────────────────

export async function upsertVpSetting(
    raw: VpSettingValues,
): Promise<VpActionResult<null>> {
    const session = await getCustomSession()
    if (!isAdmin(session.user.role))
        return { success: false, error: "Only admins can update settings" }

    const parsed = vpSettingSchema.safeParse(raw)
    if (!parsed.success) return { success: false, error: parsed.error.issues[0].message }

    const { category, name, value, description } = parsed.data

    try {
        await prisma.vpSettings.upsert({
            where: { category_name: { category, name } },
            create: { category, name, value: value || null, description: description || null },
            update: { value: value || null, description: description || null },
        })

        await logVpAudit({
            userId: session.user.id,
            action: "UPDATE",
            entityType: "VpVendor",  // closest entity type available
            description: `Updated setting ${category}.${name}`,
        })

        return { success: true, data: null }
    } catch (e) {
        console.error("[upsertVpSetting]", e)
        return { success: false, error: "Failed to save setting" }
    }
}

// ── Seed default settings if empty ────────────────────────────
export async function seedDefaultVpSettings(): Promise<void> {
    const defaults = [
        { category: "GENERAL", name: "portal_name", value: "Vendor Portal", description: "Display name of the portal" },
        { category: "GENERAL", name: "company_name", value: "", description: "Your company name" },
        { category: "GENERAL", name: "company_gstin", value: "", description: "Company GSTIN number" },
        { category: "APPROVAL", name: "po_auto_remind_days", value: "3", description: "Days before reminding BOSS to approve PO" },
        { category: "APPROVAL", name: "invoice_auto_remind_days", value: "2", description: "Days before reminding to review invoices" },
        { category: "PAYMENT", name: "default_payment_terms", value: "Net 30", description: "Default payment terms for vendors" },
        { category: "PAYMENT", name: "bank_account_name", value: "", description: "Bank account holder name" },
        { category: "PAYMENT", name: "bank_account_number", value: "", description: "Bank account number" },
        { category: "PAYMENT", name: "bank_ifsc", value: "", description: "Bank IFSC code" },
        { category: "EMAIL", name: "notify_on_invoice_submit", value: "true", description: "Email admins when vendor submits invoice" },
        { category: "EMAIL", name: "notify_on_po_approve", value: "true", description: "Email vendor when PO is approved" },
    ]

    // Get existing setting names
    const existing = await prisma.vpSettings.findMany({
        select: { name: true },
    })

    const existingNames = new Set(existing.map(e => e.name))

    // Filter only new ones
    const filtered = defaults.filter(d => !existingNames.has(d.name))

    if (filtered.length === 0) return

    await prisma.vpSettings.createMany({
        data: filtered,
    })
}

// append to src/actions/vp/settings.action.ts

export async function getCompanySettings(): Promise<{
    name: string
    gstin: string
    address: string
}> {
    const [name, gstin, address] = await Promise.all([
        getVpSetting("GENERAL", "company_name"),
        getVpSetting("GENERAL", "company_gstin"),
        getVpSetting("GENERAL", "company_address"),
    ])
    return {
        name: name ?? "AWL India Pvt. Ltd.",
        gstin: gstin ?? "",
        address: address ?? "",
    }
}