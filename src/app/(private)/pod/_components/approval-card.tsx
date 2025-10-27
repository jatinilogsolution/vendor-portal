"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { getLRRequestByFileNumber } from "../_actions/get"
import { updateLRStatus } from "../_actions/add"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export function ApprovalCard({ fileNumber }: { fileNumber: string }) {
    const [lr, setLr] = useState<any>()
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [comment, setComment] = useState("")
    const router = useRouter()

    // Fetch LR
    useEffect(() => {
        const fetchLR = async () => {
            setLoading(true)
            const res = await getLRRequestByFileNumber(fileNumber)
            if (res?.data) setLr(res.data)
            else if (res?.error) toast.error(res.error)
            setLoading(false)
        }
        fetchLR()
    }, [fileNumber])

    // Handle Approve / Reject
    const handleAction = async (status: "APPROVED" | "MISMATCHED") => {
        if (status === "MISMATCHED" && !comment.trim()) {
            toast.error("Please add a comment for rejection.")
            return
        }
        if (!lr) return

        setActionLoading(true)
        const res = await updateLRStatus(fileNumber, status, comment)
        setActionLoading(false)

        if (res?.data) {
            setLr(res.data)
            toast.success(`LR ${status === "APPROVED" ? "approved" : "rejected"} successfully!`)
            router.refresh()
        } else if (res?.error) {
            toast.error(res.error)
        }
    }

    if (loading)
        return (
            <div className="w-full max-w-md space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
        )

    if (!lr) return <div className="text-red-500">LR Request not found</div>

    const isPending = lr.status === "PENDING" || lr.status === "" || lr.status === null

    return (
        <div className="w-full  ">
            <FieldGroup>
                <FieldSet>
                    <Field>
                        <FieldLabel>POD Approval Details</FieldLabel>
                        <FieldDescription>
                            Please review the Proof of Delivery (POD) for file <b>{fileNumber}</b>.
                            Approve if all delivery details are correct and complete.
                            If there are any mismatches, missing documents, or errors, please reject and
                            add your comments below for clarification.
                        </FieldDescription>
                    </Field>
                </FieldSet>

                {!isPending && lr.remark ? (
                    <div className="mt-4">
                        <small className="text-sm font-medium">Remark</small>
                        <p className="text-muted-foreground text-sm pl-2 bg-secondary/90 py-4 rounded-md">
                            {lr.remark ?? "All Good"}
                        </p>
                    </div>
                ) : (
                    <>
                        <FieldSet>
                            <Field>
                                <FieldLabel htmlFor="approval-comments" className="sr-only">
                                    Comments
                                </FieldLabel>
                                <FieldDescription>
                                    Add a note explaining your approval or reason for rejection.
                                </FieldDescription>
                                <Textarea
                                    id="approval-comments"
                                    placeholder="Add any additional comments..."
                                    className="resize-none"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                />
                            </Field>
                        </FieldSet>

                        <Field orientation="horizontal" className="justify-end gap-3 mt-4">
                            <Button
                                type="button"
                                onClick={() => handleAction("APPROVED")}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Processing..." : "Approve"}
                            </Button>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={() => handleAction("MISMATCHED")}
                                disabled={actionLoading}
                            >
                                {actionLoading ? "Processing..." : "Reject"}
                            </Button>
                        </Field>
                    </>
                )}
            </FieldGroup>
        </div>
    )
}
