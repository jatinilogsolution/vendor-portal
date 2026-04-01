"use client"

import { useEffect, useState } from "react"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface VpUserBanDialogProps {
    isOpen: boolean
    userName: string
    isPending: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
}

export function VpUserBanDialog({
    isOpen,
    userName,
    isPending,
    onClose,
    onConfirm,
}: VpUserBanDialogProps) {
    const [reason, setReason] = useState("")

    useEffect(() => {
        if (!isOpen) {
            setReason("")
        }
    }, [isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Ban {userName}</DialogTitle>
                    <DialogDescription>
                        This will immediately remove the user&apos;s access to the portal.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <label htmlFor="vp-user-ban-reason" className="text-sm font-medium">
                        Reason
                    </label>
                    <Textarea
                        id="vp-user-ban-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Add a reason for this ban..."
                        className="min-h-24"
                    />
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={() => onConfirm(reason.trim())}
                        disabled={isPending || !reason.trim()}
                    >
                        {isPending ? "Banning..." : "Confirm Ban"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
