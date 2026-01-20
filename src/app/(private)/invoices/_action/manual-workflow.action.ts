"use server";

import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { sendManualEmail } from "@/services/mail";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Send a manual notification (Email)
 */
export async function sendManualNotification({
    to, // Can be comma-separated or a single email
    recipientId,
    title,
    description,
    type,
    path,
    notifyInternal, // Legacy for Vendors
    notifyBoss,
    notifyTAdmin,
    notifyVendor, // Notifies all users linked to the same vendor as initialRecipientId
    extraEmails
}: {
    to?: string;
    recipientId?: string;
    title: string;
    description: string;
    type: string;
    path?: string;
    notifyInternal?: boolean;
    notifyBoss?: boolean;
    notifyTAdmin?: boolean;
    notifyVendor?: boolean;
    extraEmails?: string;
}) {
    try {
        const { user: currentUser } = await getCustomSession();

        if (!currentUser || ![UserRoleEnum.BOSS, UserRoleEnum.TADMIN, UserRoleEnum.TVENDOR].includes(currentUser.role as any)) {
            throw new Error("Unauthorized. Insufficient permissions to send notifications.");
        }

        const recipientList: string[] = [];

        // 1. Add specific to email if provided
        if (to) {
            to.split(',').forEach(email => {
                if (email.trim()) recipientList.push(email.trim());
            });
        }

        // 2. Add extra emails if provided (Restricted to Admin in UI, but good to have safeguard)
        if (extraEmails) {
            extraEmails.split(',').forEach(email => {
                if (email.trim()) recipientList.push(email.trim());
            });
        }

        // 3. Automated internal notification (Legacy for Vendors)
        if (notifyInternal) {
            const internalUsers = await prisma.user.findMany({
                where: {
                    role: { in: [UserRoleEnum.BOSS, UserRoleEnum.TADMIN] as any }
                },
                select: { email: true }
            });
            internalUsers.forEach(u => {
                if (u.email) recipientList.push(u.email);
            });
        }

        // 4. Group Notifications
        if (notifyBoss) {
            const bUsers = await prisma.user.findMany({
                where: { role: UserRoleEnum.BOSS as any },
                select: { email: true }
            });
            bUsers.forEach(u => u.email && recipientList.push(u.email));
        }

        if (notifyTAdmin) {
            const tUsers = await prisma.user.findMany({
                where: { role: UserRoleEnum.TADMIN as any },
                select: { email: true }
            });
            tUsers.forEach(u => u.email && recipientList.push(u.email));
        }

        if (notifyVendor && recipientId) {
            // Find the vendor linked to this recipient (or user directly if they are a vendor)
            const recUser = await prisma.user.findUnique({
                where: { id: recipientId },
                select: { vendorId: true }
            });
            
            if (recUser?.vendorId) {
                const vendorUsers = await prisma.user.findMany({
                    where: { vendorId: recUser.vendorId },
                    select: { email: true }
                });
                vendorUsers.forEach(u => u.email && recipientList.push(u.email));
            }
        }

        // Remove duplicates
        const uniqueRecipients = Array.from(new Set(recipientList));

        if (uniqueRecipients.length === 0) {
            throw new Error("No valid recipients found.");
        }

        // Send to each recipient (assuming the email service handles logging)
        const results = await Promise.all(
            uniqueRecipients.map(recipientEmail => 
                sendManualEmail(recipientEmail, null, {
                    title,
                    description,
                    type,
                    fromUser: currentUser.name || currentUser.email || "System User"
                })
            )
        );

        const allSuccess = results.every(r => r.success);

        if (path) {
            revalidatePath(path);
        }

        return { 
            success: allSuccess, 
            message: allSuccess ? "Notifications sent successfully" : "Some notifications failed to send" 
        };
    } catch (error) {
        console.error("Error in sendManualNotification:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to send notification"
        };
    }
}

/**
 * Generate a source Annexure from an existing linked Invoice (Legacy support)
 */
export async function createAnnexureFromExistingInvoice(invoiceId: string) {
    try {
        const { user } = await getCustomSession();

        if (!user) throw new Error("Unauthorized.");
        
        const isAuthorized = [UserRoleEnum.BOSS, UserRoleEnum.TADMIN, UserRoleEnum.TVENDOR].includes(user.role as any);
        if (!isAuthorized) throw new Error("Unauthorized.");

        // 1. Get invoice and its LRs
        const invoice = await prisma.invoice.findUnique({
            where: { id: invoiceId },
            include: {
                LRRequest: true,
                vendor: true
            }
        });

        if (!invoice) throw new Error("Invoice not found");
        if (invoice.annexureId) throw new Error("This invoice is already linked to an annexure");

        // 2. Create Annexure and Groups
        const result = await prisma.$transaction(async (tx) => {
            const annexure = await tx.annexure.create({
                data: {
                    name: `Auto-Generated from ${invoice.invoiceNumber || invoice.refernceNumber}`,
                    fromDate: invoice.invoiceDate || new Date(),
                    toDate: invoice.invoiceDate || new Date(),
                    status: "DRAFT" as any,
                    vendorId: invoice.vendorId,
                }
            });

            // 3. Group LRs by fileNumber and create FileGroups
            const lrsByFile = invoice.LRRequest.reduce((acc, lr) => {
                if (!acc[lr.fileNumber]) acc[lr.fileNumber] = [];
                acc[lr.fileNumber].push(lr);
                return acc;
            }, {} as Record<string, typeof invoice.LRRequest>);

            for (const [fileNumber, lrs] of Object.entries(lrsByFile)) {
                const totalPrice = lrs.reduce((sum, lr) => sum + (lr.lrPrice || 0), 0);

                const group = await tx.annexureFileGroup.create({
                    data: {
                        annexureId: annexure.id,
                        fileNumber,
                        totalPrice,
                        status: "PENDING" as any,
                    }
                });

                // 4. Link LRs to Annexure and Group
                await tx.lRRequest.updateMany({
                    where: { id: { in: lrs.map(l => l.id) } },
                    data: {
                        annexureId: annexure.id,
                        groupId: group.id
                    }
                });
            }

            // 5. Link Invoice to Annexure
            await tx.invoice.update({
                where: { id: invoiceId },
                data: {
                    annexureId: annexure.id
                }
            });

            return annexure;
        });

        revalidatePath(`/invoices/${invoiceId}`);
        return { success: true, data: result };
    } catch (error) {
        console.error("Error in createAnnexureFromExistingInvoice:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to generate annexure"
        };
    }
}
