// src/app/vendor-portal/(admin)/admin/vendors/_components/vendor-card.tsx
"use client"

import { useState, useTransition } from "react"
import Link from "next/link"
import { toast } from "sonner"
import {
    IconMail, IconPhone, IconBuildingStore,
    IconPencil, IconPower, IconExternalLink,
} from "@tabler/icons-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { EnrollVendorDialog } from "./enroll-vendor-dialog"
import { toggleVpVendorStatus, VpVendorRow } from "@/actions/vp/vendor.action"
import { VP_BILLING_TYPE_LABELS, VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

interface VendorCardProps {
    vendor: VpVendorRow
    canEdit: boolean
    onRefresh: () => void
}

export function VendorCard({ vendor, canEdit, onRefresh }: VendorCardProps) {
    const [editOpen, setEditOpen] = useState(false)
    const [isPending, startTransition] = useTransition()
    const v = vendor.vendor

    const cycleLabel = vendor.recurringCycle
        ? VP_RECURRING_CYCLE_LABELS[vendor.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS]
        : null
    const categorySummary = vendor.categoryNames.length > 0
        ? vendor.categoryNames.slice(0, 2).join(", ") + (vendor.categoryNames.length > 2 ? ` +${vendor.categoryNames.length - 2}` : "")
        : null

    const handleToggle = () => {
        startTransition(async () => {
            const res = await toggleVpVendorStatus(vendor.id)
            if (!res.success) { toast.error(res.error); return }
            toast.success(`Vendor ${res.data.portalStatus === "ACTIVE" ? "activated" : "deactivated"}`)
            onRefresh()
        })
    }

    return (
        <>
            <Card className="flex flex-col">
                <CardContent className="flex-1 space-y-3 p-4">
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-2">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-primary/10">
                                <IconBuildingStore size={18} className="text-primary" />
                            </div>
                            <div className="min-w-0">
                                <p className="truncate text-sm font-semibold">{v.name}</p>
                                {categorySummary && (
                                    <p className="truncate text-xs text-muted-foreground">{categorySummary}</p>
                                )}
                            </div>
                        </div>
                        <VpStatusBadge status={vendor.portalStatus} />
                    </div>

                    <Separator />

                    {/* Contact info */}
                    <div className="space-y-1.5">
                        {v.contactEmail && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <IconMail size={13} />
                                <span className="truncate">{v.contactEmail}</span>
                            </div>
                        )}
                        {v.contactPhone && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <IconPhone size={13} />
                                <span>{v.contactPhone}</span>
                            </div>
                        )}
                        {v.gstNumber && (
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span className="font-mono font-semibold">GST</span>
                                <span>{v.gstNumber}</span>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Tags row */}
                    <div className="flex flex-wrap gap-1.5">
                        <VpStatusBadge status={vendor.vendorType} />
                        {vendor.categoryNames.map((categoryName) => (
                            <Badge key={categoryName} variant="secondary" className="text-[10px] px-1.5 py-0">
                                {categoryName}
                            </Badge>
                        ))}
                        {vendor.billingType?.map(bt => (
                            <Badge key={bt} variant="outline" className="text-[10px] px-1.5 py-0 capitalize">
                                {VP_BILLING_TYPE_LABELS[bt as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                            </Badge>
                        ))}
                        {cycleLabel && (
                            <Badge variant="outline" className="text-xs">{cycleLabel}</Badge>
                        )}
                    </div>

                    {/* Counts */}
                    <div className="grid grid-cols-3 gap-2 rounded-md bg-muted/40 p-2 text-center">
                        <div>
                            <p className="text-base font-bold">{vendor._count.purchaseOrders}</p>
                            <p className="text-[10px] text-muted-foreground">POs</p>
                        </div>
                        <div>
                            <p className="text-base font-bold">{vendor._count.proformaInvoices}</p>
                            <p className="text-[10px] text-muted-foreground">PIs</p>
                        </div>
                        <div>
                            <p className="text-base font-bold">{vendor._count.invoices}</p>
                            <p className="text-[10px] text-muted-foreground">Bills</p>
                        </div>
                    </div>
                </CardContent>

                {canEdit && (
                    <CardFooter className="gap-2 border-t p-3">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                            <Link href={`/vendor-portal/admin/vendors/${vendor.id}`}>
                                <IconExternalLink size={14} className="mr-1.5" />
                                View
                            </Link>
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
                            <IconPencil size={14} />
                        </Button>
                        <Button
                            variant="outline" size="sm"
                            className={vendor.portalStatus === "ACTIVE"
                                ? "text-destructive hover:text-destructive"
                                : "text-emerald-600 hover:text-emerald-700"}
                            onClick={handleToggle}
                            disabled={isPending}
                            title={vendor.portalStatus === "ACTIVE" ? "Deactivate" : "Activate"}
                        >
                            <IconPower size={14} />
                        </Button>
                    </CardFooter>
                )}
            </Card>

            <EnrollVendorDialog
                open={editOpen}
                onClose={() => setEditOpen(false)}
                onSuccess={onRefresh}
                editing={vendor}
            />
        </>
    )
}
