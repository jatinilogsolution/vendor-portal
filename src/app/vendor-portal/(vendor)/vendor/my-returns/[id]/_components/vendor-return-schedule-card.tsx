"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { vendorUpdateVpReturnSchedule } from "@/actions/vp/return.action"

type VendorReturnScheduleCardProps = {
    returnId: string
    status: string
    expectedPickupDate: Date | string | null
    pickupPersonName: string | null
    pickupPersonPhone: string | null
    notes: string | null
}

function toDateInput(value: Date | string | null): string {
    if (!value) return ""
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return ""
    return date.toISOString().split("T")[0]
}

export function VendorReturnScheduleCard({
    returnId,
    status,
    expectedPickupDate,
    pickupPersonName,
    pickupPersonPhone,
    notes,
}: VendorReturnScheduleCardProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [pickupDate, setPickupDate] = useState(toDateInput(expectedPickupDate))
    const [personName, setPersonName] = useState(pickupPersonName ?? "")
    const [personPhone, setPersonPhone] = useState(pickupPersonPhone ?? "")
    const [pickupNotes, setPickupNotes] = useState(notes ?? "")

    const canEdit = status === "EXPECTED"

    const onSave = () =>
        startTransition(async () => {
            const result = await vendorUpdateVpReturnSchedule(returnId, {
                expectedPickupDate: pickupDate,
                pickupPersonName: personName,
                pickupPersonPhone: personPhone,
                notes: pickupNotes,
            })
            if (!result.success) {
                toast.error(result.error)
                return
            }
            toast.success("Pickup details updated")
            router.refresh()
        })

    return (
        <Card>
            <CardHeader className="pb-3">
                <CardTitle className="text-sm">Confirm Pickup Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground">
                    Confirm when your team will take this return and share the pickup contact.
                </p>
                <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Pickup Date</label>
                    <Input
                        type="date"
                        value={pickupDate}
                        onChange={(event) => setPickupDate(event.target.value)}
                        disabled={!canEdit || isPending}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Pickup Person</label>
                    <Input
                        value={personName}
                        onChange={(event) => setPersonName(event.target.value)}
                        placeholder="Name"
                        disabled={!canEdit || isPending}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Pickup Contact</label>
                    <Input
                        value={personPhone}
                        onChange={(event) => setPersonPhone(event.target.value)}
                        placeholder="Phone number"
                        disabled={!canEdit || isPending}
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs text-muted-foreground">Vendor Notes</label>
                    <Textarea
                        rows={3}
                        value={pickupNotes}
                        onChange={(event) => setPickupNotes(event.target.value)}
                        placeholder="Any pickup preparation notes..."
                        disabled={!canEdit || isPending}
                    />
                </div>
                {!canEdit && (
                    <p className="text-xs text-muted-foreground">
                        Pickup details are locked because this return is already marked done/cancelled.
                    </p>
                )}
                <Button
                    onClick={onSave}
                    disabled={!canEdit || isPending || !pickupDate}
                    className="w-full"
                >
                    {isPending ? "Saving..." : "Update Pickup Plan"}
                </Button>
            </CardContent>
        </Card>
    )
}
