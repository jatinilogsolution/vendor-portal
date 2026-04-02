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

interface VpUserDeleteDialogProps {
    isOpen: boolean
    userName: string
    userRole: string
    isPending: boolean
    onClose: () => void
    onConfirm: (reason: string) => void
}

export function VpUserDeleteDialog({
    isOpen,
    userName,
    userRole,
    isPending,
    onClose,
    onConfirm,
}: VpUserDeleteDialogProps) {
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
                    <DialogTitle>Delete {userName}</DialogTitle>
                    <DialogDescription>
                        This will permanently remove this {userRole.toLowerCase()} user from the portal if no protected records still reference them.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-2">
                    <label htmlFor="vp-user-delete-reason" className="text-sm font-medium">
                        Reason
                    </label>
                    <Textarea
                        id="vp-user-delete-reason"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                        placeholder="Explain why this user is being deleted..."
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
                        {isPending ? "Deleting..." : "Delete User"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
