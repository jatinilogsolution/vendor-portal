"use client"

import { useEffect, useState } from "react"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

interface VpUserBanDialogProps {
    isOpen: boolean
    userName: string
    isPending: boolean
    onClose: () => void
    onConfirm: () => void
}

export function UserVerifyDialog({
    isOpen,
    userName,
    isPending,
    onClose,
    onConfirm,
}: VpUserBanDialogProps) {



    return (

        <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            {/* <AlertDialogTrigger asChild>
                <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger> */}
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Verify {userName}</AlertDialogTitle>
                    <AlertDialogDescription>
                        This will verify the user. Are you sure you want to continue?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>

                        <Button variant="outline" onClick={onClose} disabled={isPending}>
                            Cancel
                        </Button>
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>

                        <Button
                            variant="default"
                            onClick={() => onConfirm()}
                            disabled={isPending}
                        >
                            {isPending ? "verifying..." : "Confirm verify"}
                        </Button>
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    )
}
