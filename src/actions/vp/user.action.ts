// src/actions/vp/user.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss, isBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { VpActionResult } from "@/types/vendor-portal"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { headers } from "next/headers"
import { APIError } from "better-auth/api"
import {
    canManageUserBan,
    getUserBanPermissionError,
} from "@/lib/vendor-portal/user-ban-permissions"

// ── Validation ─────────────────────────────────────────────────
const createVpUserSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    role: z.enum(["ADMIN", "BOSS", "VENDOR"]),
    // Only required when role = VENDOR
    vpVendorId: z.string().optional(),
})

export type CreateVpUserInput = z.infer<typeof createVpUserSchema>

const banVpUserSchema = z.object({
    userId: z.string().min(1, "User is required"),
    banReason: z.string().trim().min(1, "Ban reason is required"),
})

const unbanVpUserSchema = z.object({
    userId: z.string().min(1, "User is required"),
})

// ── Who can create whom ────────────────────────────────────────
// BOSS  → can create ADMIN, BOSS, VENDOR
// ADMIN → can only create VENDOR
function canCreate(actorRole: string, targetRole: string): boolean {
    if (isBoss(actorRole)) return true
    if (actorRole === "ADMIN" && targetRole === "VENDOR") return true
    return false
}

export async function createVpUser(
    raw: CreateVpUserInput,
): Promise<VpActionResult<{ userId: string }>> {
    const session = await getCustomSession()
    const actorRole = session.user.role

    if (!isAdminOrBoss(actorRole)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = createVpUserSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message }
    }

    const { name, email, password, role, vpVendorId } = parsed.data

    if (!canCreate(actorRole, role)) {
        return { success: false, error: "You cannot create a user with that role" }
    }

    if (role === "VENDOR" && !vpVendorId) {
        return { success: false, error: "A vendor must be selected for VENDOR role" }
    }

    // Check email not already used
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
        return { success: false, error: "A user with this email already exists" }
    }

    // If role is VENDOR, we need the core vendorId from the vpVendor record
    // let coreVendorId: string | undefined = undefined
    // if (role === "VENDOR" && vpVendorId) {
    //     const vpVendor = await prisma.vendor.findUnique({
    //         where: { id: vpVendorId },
    //         // select: { existingVendorId: true }
    //     })
    //     if (!vpVendor) return { success: false, error: "Selected vendor not found" }
    //     coreVendorId = vpVendor.id
    // }

    try {
        // Use better-auth to create the user (handles password hashing)


        console.log(">>>>", name, email,password, role,vpVendorId)
        const result = await auth.api.signUpEmail({
            body: {
                name,
                email,
                password,
                role,
                vendorId: vpVendorId,
            },
        })

        if (!result?.user?.id) {
            return { success: false, error: "Failed to create user account" }
        }

        await logVpAudit({
            userId: session.user.id,
            action: "CREATE",
            entityType: "VpVendor",
            entityId: result.user.id,
            description: `Created VP user ${email} with role ${role}`,
        })

        return { success: true, data: { userId: result.user.id } }
    } catch (e) {
        console.error("[createVpUser]", e)
        return { success: false, error: "Something went wrong. Please try again." }
    }
}

// ── Fetch VP vendors for the user creation dropdown ────────────
export async function getVpVendorsForSelect(): Promise<VpActionResult<{ id: string; name: string; vendorType: string }[]>
> {
    try {
        const vendors = await prisma.vpVendor.findMany({
            where: { portalStatus: "ACTIVE" },
            select: {
                id: true,
                vendorType: true,
                existingVendor: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
        })
        return {
            success: true,
            data: vendors.map((v) => ({
                id: v.id,
                name: v.existingVendor.name,
                vendorType: v.vendorType,
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch vendors" }
    }
}



// append to src/actions/vp/user.action.ts

export async function getVpPortalUsers(): Promise<VpActionResult<{
    id: string
    name: string
    email: string
    role: string
    image: string | null
    phone: string | null
    companyId: string | null
    vendorId: string | null
    emailVerified: boolean
    createdAt: Date
    updatedAt: Date
    banned: boolean | null
    banReason: string | null
    banExpires: Date | null
    vendorName: string | null
    providers: string[]
    sessionCount: number
    lastSessionAt: Date | null
    vendorProfile: {
        id: string
        name: string
        contactEmail: string | null
        contactPhone: string | null
        gstNumber: string | null
        panNumber: string | null
        taxId: string | null
        paymentTerms: string | null
        profileCompleted: boolean
        isActive: boolean
        address: {
            line1: string
            line2: string | null
            city: string
            state: string | null
            postal: string | null
            country: string
        } | null
        vpVendor: {
            id: string
            portalStatus: string
            vendorType: string
            billingType: string | null
            recurringCycle: string | null
            restrictInvoiceToDefaultCompany: boolean
            category: { id: string; name: string } | null
            defaultInvoiceCompany: { id: string; name: string; code: string | null } | null
            assignedCompanies: { id: string; name: string; code: string | null }[]
            bankDetails: {
                accountHolderName: string
                accountNumber: string
                ifscCode: string
                bankName: string
                branch: string | null
                accountType: string
                verifiedAt: Date | null
            } | null
        } | null
        documents: {
            id: string
            label: string
            url: string
            linkedCode: string | null
            description: string | null
        }[]
    } | null
}[]>
> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role))
        return { success: false, error: "Insufficient permissions" }

    try {
        const users = await prisma.user.findMany({
            where: { role: { in: ["ADMIN", "BOSS", "VENDOR"] } },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                image: true,
                phone: true,
                companyId: true,
                vendorId: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                banned: true,
                banReason: true,
                banExpires: true,
                Vendor: {
                    select: {
                        id: true,
                        name: true,
                        contactEmail: true,
                        contactPhone: true,
                        gstNumber: true,
                        panNumber: true,
                        taxId: true,
                        paymentTerms: true,
                        profileCompleted: true,
                        isActive: true,
                        Address: {
                            select: {
                                line1: true,
                                line2: true,
                                city: true,
                                state: true,
                                postal: true,
                                country: true,
                            },
                            orderBy: { updatedAt: "desc" },
                            take: 1,
                        },
                        vpVendors: {
                            select: {
                                id: true,
                                portalStatus: true,
                                vendorType: true,
                                billingType: true,
                                recurringCycle: true,
                                restrictInvoiceToDefaultCompany: true,
                                category: {
                                    select: {
                                        id: true,
                                        name: true,
                                    },
                                },
                                defaultInvoiceCompany: {
                                    select: {
                                        id: true,
                                        name: true,
                                        code: true,
                                    },
                                },
                                companies: {
                                    select: {
                                        company: {
                                            select: {
                                                id: true,
                                                name: true,
                                                code: true,
                                            },
                                        },
                                    },
                                },
                                bankDetails: {
                                    select: {
                                        accountHolderName: true,
                                        accountNumber: true,
                                        ifscCode: true,
                                        bankName: true,
                                        branch: true,
                                        accountType: true,
                                        verifiedAt: true,
                                    },
                                },
                            },
                            orderBy: { updatedAt: "desc" },
                            take: 1,
                        },
                    },
                },
                accounts: { select: { providerId: true } },
                sessions: {
                    select: { createdAt: true },
                    orderBy: { createdAt: "desc" },
                    take: 1,
                },
                _count: {
                    select: { sessions: true },
                },
            },
            orderBy: { createdAt: "desc" },
        })

        const vendorIds = [...new Set(
            users
                .map((user) => user.Vendor?.id)
                .filter((vendorId): vendorId is string => Boolean(vendorId)),
        )]

        const vendorDocuments = vendorIds.length > 0
            ? await prisma.document.findMany({
                where: { linkedId: { in: vendorIds } },
                select: {
                    id: true,
                    linkedId: true,
                    label: true,
                    url: true,
                    linkedCode: true,
                    description: true,
                },
                orderBy: { createdAt: "desc" },
            })
            : []

        const documentsByVendorId = new Map<string, typeof vendorDocuments>()
        for (const document of vendorDocuments) {
            const existing = documentsByVendorId.get(document.linkedId) ?? []
            existing.push(document)
            documentsByVendorId.set(document.linkedId, existing)
        }
        return {
            success: true,
            data: users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                image: u.image,
                phone: u.phone,
                companyId: u.companyId,
                vendorId: u.vendorId,
                emailVerified: u.emailVerified,
                createdAt: u.createdAt,
                updatedAt: u.updatedAt,
                banned: u.banned,
                banReason: u.banReason,
                banExpires: u.banExpires,
                vendorName: u.Vendor?.name ?? null,
                providers: [...new Set(u.accounts.map((account) => account.providerId))],
                sessionCount: u._count.sessions,
                lastSessionAt: u.sessions[0]?.createdAt ?? null,
                vendorProfile: u.Vendor
                    ? {
                        id: u.Vendor.id,
                        name: u.Vendor.name,
                        contactEmail: u.Vendor.contactEmail,
                        contactPhone: u.Vendor.contactPhone,
                        gstNumber: u.Vendor.gstNumber,
                        panNumber: u.Vendor.panNumber,
                        taxId: u.Vendor.taxId,
                        paymentTerms: u.Vendor.paymentTerms,
                        profileCompleted: u.Vendor.profileCompleted,
                        isActive: u.Vendor.isActive,
                        address: u.Vendor.Address[0] ?? null,
                        vpVendor: u.Vendor.vpVendors[0]
                            ? {
                                id: u.Vendor.vpVendors[0].id,
                                portalStatus: u.Vendor.vpVendors[0].portalStatus,
                                vendorType: u.Vendor.vpVendors[0].vendorType,
                                billingType: u.Vendor.vpVendors[0].billingType,
                                recurringCycle: u.Vendor.vpVendors[0].recurringCycle,
                                restrictInvoiceToDefaultCompany: u.Vendor.vpVendors[0].restrictInvoiceToDefaultCompany,
                                category: u.Vendor.vpVendors[0].category,
                                defaultInvoiceCompany: u.Vendor.vpVendors[0].defaultInvoiceCompany,
                                assignedCompanies: u.Vendor.vpVendors[0].companies.map((entry) => entry.company),
                                bankDetails: u.Vendor.vpVendors[0].bankDetails,
                            }
                            : null,
                        documents: (documentsByVendorId.get(u.Vendor.id) ?? []).map((document) => ({
                            id: document.id,
                            label: document.label,
                            url: document.url,
                            linkedCode: document.linkedCode ?? null,
                            description: document.description ?? null,
                        })),
                    }
                    : null,
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch users" }
    }
}

export async function banVpPortalUser(raw: z.infer<typeof banVpUserSchema>): Promise<VpActionResult> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = banVpUserSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message }
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: parsed.data.userId },
            select: { id: true, role: true },
        })

        if (!targetUser) {
            return { success: false, error: "User not found" }
        }

        if (!canManageUserBan(session.user.role, session.user.id, targetUser.role, targetUser.id)) {
            return {
                success: false,
                error: getUserBanPermissionError(session.user.role, targetUser.role),
            }
        }

        await auth.api.banUser({
            headers: await headers(),
            body: parsed.data,
        })

        return { success: true, data: null, message: "User banned successfully" }
    } catch (error) {
        if (error instanceof APIError) {
            return { success: false, error: error.message }
        }

        console.error("[banVpPortalUser]", error)
        return { success: false, error: "Failed to ban user" }
    }
}

export async function unbanVpPortalUser(raw: z.infer<typeof unbanVpUserSchema>): Promise<VpActionResult> {
    const session = await getCustomSession()
    if (!isAdminOrBoss(session.user.role)) {
        return { success: false, error: "Insufficient permissions" }
    }

    const parsed = unbanVpUserSchema.safeParse(raw)
    if (!parsed.success) {
        return { success: false, error: parsed.error.issues[0].message }
    }

    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: parsed.data.userId },
            select: { id: true, role: true },
        })

        if (!targetUser) {
            return { success: false, error: "User not found" }
        }

        if (!canManageUserBan(session.user.role, session.user.id, targetUser.role, targetUser.id)) {
            return {
                success: false,
                error: getUserBanPermissionError(session.user.role, targetUser.role),
            }
        }

        await auth.api.unbanUser({
            headers: await headers(),
            body: parsed.data,
        })

        return { success: true, data: null, message: "User unbanned successfully" }
    } catch (error) {
        if (error instanceof APIError) {
            return { success: false, error: error.message }
        }

        console.error("[unbanVpPortalUser]", error)
        return { success: false, error: "Failed to unban user" }
    }
}
