// src/actions/vp/user.action.ts
"use server"

import { prisma } from "@/lib/prisma"
import { getCustomSession } from "@/actions/auth.action"
import { isAdminOrBoss, isBoss } from "@/lib/vendor-portal/roles"
import { logVpAudit } from "@/lib/vendor-portal/audit"
import { VpActionResult } from "@/types/vendor-portal"
import { auth } from "@/lib/auth"
import { z } from "zod"

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
    createdAt: Date
    banned: boolean | null
    vendorName: string | null
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
                createdAt: true,
                banned: true,
                Vendor: { select: { name: true } },
            },
            orderBy: { createdAt: "desc" },
        })
        return {
            success: true,
            data: users.map((u) => ({
                id: u.id,
                name: u.name,
                email: u.email,
                role: u.role,
                createdAt: u.createdAt,
                banned: u.banned,
                vendorName: u.Vendor?.name ?? null,
            })),
        }
    } catch (e) {
        return { success: false, error: "Failed to fetch users" }
    }
}