"use client";

import { useState } from "react";
import {
    InvoiceStatus,
    UserRoleEnum
} from "@/utils/constant";
import {
    submitInvoiceForReview,
    approveInvoiceByTadmin,
    rejectInvoice,
    approveInvoiceByBoss,
    authorizeInvoicePayment
} from "@/app/(private)/invoices/_action/invoice-workflow.action";
import { Button } from "@/components/ui/button";
import {
    Send,
    CheckCircle,
    XCircle,
    Forward,
    CreditCard,
    Eye
} from "lucide-react";
import { toast } from "sonner";
import { RejectionDialog } from "./rejection-dialog";
 
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
 import { WorkflowStatusBadge } from "./workflow-status-badge";
import Link from "next/link";

interface InvoiceWorkflowPanelProps {
    invoiceId: string;
    invoiceNumber: string;
    currentStatus: string;
    userRole: string;
    userId: string;
    onUpdate: () => void;
    annexureId: string
}

export function InvoiceWorkflowPanel({
    invoiceId,
     currentStatus,
    userRole,
    userId,
    onUpdate,annexureId
}: InvoiceWorkflowPanelProps) {
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const status = currentStatus as InvoiceStatus;

    const handleAction = async (actionFn: () => Promise<any>, successMsg: string) => {
        try {
            setIsLoading(true);
            const res = await actionFn();
            if (res.success) {
                toast.success(successMsg);
                onUpdate();
            } else {
                toast.error(res.error || "Action failed");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (reason: string) => {
        const res = await rejectInvoice(invoiceId, userId, userRole, reason);
        if (res.success) {
            toast.success("Invoice rejected");
            onUpdate();
        } else {
            throw new Error(res.error || "Failed to reject");
        }
    };

    // Visibility checks
    const showSubmit = userRole === UserRoleEnum.TVENDOR &&
        (status === InvoiceStatus.DRAFT || status === InvoiceStatus.REJECTED_BY_TADMIN || status === InvoiceStatus.REJECTED_BY_BOSS);

    const showTadminActions = userRole === UserRoleEnum.TADMIN &&
        status === InvoiceStatus.PENDING_TADMIN_REVIEW;

    const showBossActions = userRole === UserRoleEnum.BOSS &&
        status === InvoiceStatus.PENDING_BOSS_REVIEW;

    const showAuthorizePayment = userRole === UserRoleEnum.BOSS &&
        status === InvoiceStatus.APPROVED;

    const showCompareLink = userRole === UserRoleEnum.BOSS &&
        (status === InvoiceStatus.PENDING_BOSS_REVIEW || status === InvoiceStatus.APPROVED);

    if (!showSubmit && !showTadminActions && !showBossActions && !showAuthorizePayment && !showCompareLink) return null;

    return (
        <Card className="border-primary/20 bg-primary/5 mb-6">
            <CardHeader className="py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Workflow Actions</CardTitle>
                        <CardDescription>Actions available for your role based on current status</CardDescription>
                    </div>
                    <WorkflowStatusBadge status={status} type="invoice" />
                </div>
            </CardHeader>
            <CardContent className="py-2 pb-4">
                <div className="flex flex-wrap gap-3">
                    {showSubmit && (
                        <Button
                            onClick={() => handleAction(
                                () => submitInvoiceForReview(invoiceId, userId, userRole),
                                "Invoice submitted for review"
                            )}
                            disabled={isLoading}
                            className="gap-2"
                        >
                            <Send className="h-4 w-4" />
                            {status === InvoiceStatus.DRAFT ? "Submit for Review" : "Resubmit for Review"}
                        </Button>
                    )}

                    {showTadminActions && (
                        <>
                            <Button
                                onClick={() => handleAction(
                                    () => approveInvoiceByTadmin(invoiceId, userId, userRole),
                                    "Invoice approved and forwarded to BOSS"
                                )}
                                disabled={isLoading}
                                className="gap-2 bg-blue-600 hover:bg-blue-700"
                            >
                                <Forward className="h-4 w-4" />
                                Approve & Forward to BOSS
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setIsRejectDialogOpen(true)}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                        </>
                    )}

                    {showBossActions && (
                        <>
                            <Button
                                onClick={() => handleAction(
                                    () => approveInvoiceByBoss(invoiceId, userId, userRole),
                                    "Invoice approved by BOSS"
                                )}
                                disabled={isLoading}
                                className="gap-2 bg-green-600 hover:bg-green-700"
                            >
                                <CheckCircle className="h-4 w-4" />
                                Final Approve
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={() => setIsRejectDialogOpen(true)}
                                disabled={isLoading}
                                className="gap-2"
                            >
                                <XCircle className="h-4 w-4" />
                                Reject
                            </Button>
                        </>
                    )}

                    {showAuthorizePayment && (
                        <Button
                            onClick={() => handleAction(
                                () => authorizeInvoicePayment(invoiceId, userId, userRole),
                                "Authorized for payment"
                            )}
                            disabled={isLoading}
                            className="gap-2 bg-emerald-600 hover:bg-emerald-700"
                        >
                            <CreditCard className="h-4 w-4" />
                            Authorize for Payment
                        </Button>
                    )}

                    {showCompareLink && (
                        <Button variant="outline" asChild className="gap-2">
                            <Link href={`/invoices/${invoiceId}/compare`}>
                                <Eye className="h-4 w-4" />
                                View Compare (BOSS)
                            </Link>
                        </Button>
                    )}

                    <Button variant={"link"} className=" bg-secondary">


                    <Link href={`/lorries/annexure/${annexureId}`}>View Annexure</Link>
                    </Button>

                </div>

                <RejectionDialog
                    isOpen={isRejectDialogOpen}
                    onClose={() => setIsRejectDialogOpen(false)}
                    onConfirm={handleReject}
                    title="Reject Invoice"
                    description="Provide a reason for rejecting this invoice. This will return it to the TVENDOR."
                />
            </CardContent>
        </Card>
    );
}
