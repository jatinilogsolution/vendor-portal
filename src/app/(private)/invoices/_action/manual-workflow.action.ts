
"use server";

import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { sendManualEmail } from "@/services/email.service";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Send a manual notification (Email)
 */
export async function sendManualNotification({
    to,
    recipientId,
    title,
    description,
    type,
    path
}: {
    to: string;
    recipientId?: string;
    title: string;
    description: string;
    type: string;
    path?: string;
}) {
    try {
        const { user } = await getCustomSession();

        if (!user || ![UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(user.role as any)) {
            throw new Error("Unauthorized. Only Admins or Boss can send manual notifications.");
        }

        const result = await sendManualEmail(to, recipientId || null, {
            title,
            description,
            type,
            fromUser: user.name || user.email || "System User"
        });

        if (path) {
            revalidatePath(path);
        }

        return { success: true, message: "Notification sent successfully" };
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
