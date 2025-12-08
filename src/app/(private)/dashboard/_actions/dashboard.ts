"use server"

import { getCustomSession } from "@/actions/auth.action"
import { prisma } from "@/lib/prisma"
import { UserRoleEnum } from "@/utils/constant"

export async function getDashboardStats() {
    try {
        const { user, session } = await getCustomSession()

        if (!session) {
            return { error: "Unauthorized" }
        }

        const isAdmin = [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(user.role as UserRoleEnum)
        const isTVendor = user.role === UserRoleEnum.TVENDOR

        // Get vendor ID for TVENDOR users
        let vendorId: string | undefined
        if (isTVendor) {
            const vendor = await prisma.user.findUnique({
                where: { id: user.id },
                include: { Vendor: { select: { id: true, name: true } } }
            })
            vendorId = vendor?.Vendor?.id
        }

        const whereClause = vendorId ? { tvendorId: vendorId } : {}
        const invoiceWhereClause = vendorId ? { vendorId } : {}

        // Parallel queries for better performance
        const [
            totalLRs,
            lrsWithPOD,
            lrsWithoutPOD,
            invoicedLRs,
            totalInvoices,
            draftInvoices,
            sentInvoices,
            totalAnnexures,
            recentLRs,
            recentInvoices,
            vendorStats
        ] = await Promise.all([
            // Total LRs
            prisma.lRRequest.count({ where: whereClause }),

            // LRs with POD
            prisma.lRRequest.count({
                where: {
                    ...whereClause,
                    podlink: { not: null }
                }
            }),

            // LRs without POD
            prisma.lRRequest.count({
                where: {
                    ...whereClause,
                    podlink: null
                }
            }),

            // Invoiced LRs
            prisma.lRRequest.count({
                where: {
                    ...whereClause,
                    isInvoiced: true
                }
            }),

            // Total invoices
            prisma.invoice.count({ where: invoiceWhereClause }),

            // Draft invoices
            prisma.invoice.count({
                where: {
                    ...invoiceWhereClause,
                    status: "DRAFT"
                }
            }),

            // Sent invoices
            prisma.invoice.count({
                where: {
                    ...invoiceWhereClause,
                    status: "SENT"
                }
            }),

            // Total annexures (for vendors, filter by their LRs)
            vendorId
                ? prisma.annexure.count({
                    where: {
                        LRRequest: {
                            some: {
                                tvendorId: vendorId
                            }
                        }
                    }
                })
                : prisma.annexure.count(),

            // Recent LRs (last 10)
            prisma.lRRequest.findMany({
                where: whereClause,
                orderBy: { createdAt: "desc" },
                take: 10,
                select: {
                    id: true,
                    LRNumber: true,
                    vehicleNo: true,
                    fileNumber: true,
                    outDate: true,
                    podlink: true,
                    isInvoiced: true,
                    priceSettled: true,
                }
            }),

            // Recent invoices (last 5)
            prisma.invoice.findMany({
                where: invoiceWhereClause,
                orderBy: { createdAt: "desc" },
                take: 5,
                select: {
                    id: true,
                    refernceNumber: true,
                    invoiceNumber: true,
                    status: true,
                    grandTotal: true,
                    createdAt: true,
                }
            }),

            // Vendor stats (only for admins)
            isAdmin
                ? prisma.vendor.findMany({
                    take: 10,
                    select: {
                        id: true,
                        name: true,
                        _count: {
                            select: {
                                LRRequest: true,
                                invoices: true
                            }
                        }
                    },
                    orderBy: {
                        LRRequest: {
                            _count: "desc"
                        }
                    }
                })
                : null
        ])

        // Calculate earnings
        const earnings = await prisma.lRRequest.aggregate({
            where: {
                ...whereClause,
                priceSettled: { not: null }
            },
            _sum: {
                priceSettled: true,
                extraCost: true
            }
        })

        const totalRevenue = (earnings._sum.priceSettled || 0) + (earnings._sum.extraCost || 0)

        return {
            success: true,
            data: {
                overview: {
                    totalLRs,
                    lrsWithPOD,
                    lrsWithoutPOD,
                    invoicedLRs,
                    totalInvoices,
                    draftInvoices,
                    sentInvoices,
                    totalAnnexures,
                    totalRevenue
                },
                podCoverage: totalLRs > 0 ? Math.round((lrsWithPOD / totalLRs) * 100) : 0,
                invoiceConversion: totalLRs > 0 ? Math.round((invoicedLRs / totalLRs) * 100) : 0,
                recentLRs,
                recentInvoices,
                vendorStats,
                userRole: user.role || "VENDOR",
                isAdmin,
                timestamp: Date.now()
            }
        }
    } catch (error) {
        console.error("Error fetching dashboard stats:", error)
        return { error: "Failed to fetch dashboard statistics" }
    }
}
