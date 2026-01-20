"use client";

import { useState } from "react";
import {
    AnnexureStatus,
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
import { 
    forwardAnnexureToBoss, 
    approveAnnexureByBoss 
} from "@/app/(private)/lorries/_action/annexure-workflow.action";
import { Button } from "@/components/ui/button";
import {
    Send,
    CheckCircle,
    XCircle,
    Forward,
    CreditCard,
    Eye,
    AlertTriangle
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
    annexureId: string;
    annexureStatus?: string;
    annexureName?: string;
}

export function InvoiceWorkflowPanel({
    invoiceId,
     currentStatus,
    userRole,
    userId,
    onUpdate,annexureId,
    annexureStatus,
    annexureName
}: InvoiceWorkflowPanelProps) {
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isBossApproveDialogOpen, setIsBossApproveDialogOpen] = useState(false);
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
        <Card className="border-primary/20 bg-primary/5 ">
            <CardHeader >
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg">Workflow Actions</CardTitle>
                        <CardDescription>Actions available for your role based on current status</CardDescription>
                    </div>
                    <WorkflowStatusBadge status={status} type="invoice" />
                </div>
            </CardHeader>
            <CardContent className="  ">
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
                                    "Invoice approved and forwarded to Finance"
                                )}
                                disabled={isLoading}
                                variant={"default"}
                                className="hover:underline"
                                // className="gap-2 bg-lime-600 hover:bg-blue-700"
                            >
                                <Forward className="h-4 w-4" />
                                Approve & Forward to Finance
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
                                onClick={() => {
                                    if (annexureId && annexureStatus !== AnnexureStatus.APPROVED) {
                                        setIsBossApproveDialogOpen(true);
                                    } else {
                                        handleAction(
                                            () => approveInvoiceByBoss(invoiceId, userId, userRole),
                                            "Invoice approved by Finance"
                                        );
                                    }
                                }}
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
                                View Compare (Finance)
                            </Link>
                        </Button>
                    )}

                    <Button variant={"link"} className=" bg-secondary" asChild>
                        <Link href={`/lorries/annexure/${annexureId}`}>View Annexure</Link>
                    </Button>

                    {/* Integrated Annexure Actions for TADMIN/BOSS */}
                    {userRole === UserRoleEnum.TADMIN && annexureStatus === AnnexureStatus.PARTIALLY_APPROVED && (
                        <div className="flex gap-3 w-full mt-2 pt-2 border-t border-primary/10">
                            <Button
                                onClick={() => handleAction(
                                    () => forwardAnnexureToBoss(annexureId, userId, userRole),
                                    "Annexure forwarded to Finance"
                                )}
                                disabled={isLoading}
                                variant="outline"
                                className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                            >
                                <Forward className="h-4 w-4 mr-2" />
                                Forward Annexure to Finance
                            </Button>
                            
                            {/* "Directly Process" - Approve Annexure as requested by user */}
                            <Button
                                onClick={() => handleAction(
                                    () => approveAnnexureByBoss(annexureId, userId, "BOSS"), // Force role to BOSS to skip review if TADMIN is authorized
                                    "Annexure processed and approved"
                                )}
                                disabled={isLoading}
                                variant="outline"
                                className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve Annexure Directly
                            </Button>
                        </div>
                    )}

                </div>

                <RejectionDialog
                    isOpen={isRejectDialogOpen}
                    onClose={() => setIsRejectDialogOpen(false)}
                    onConfirm={handleReject}
                    title="Reject Invoice"
                    description="Provide a reason for rejecting this invoice. This will return it to the TVENDOR."
                />

                <AlertDialog open={isBossApproveDialogOpen} onOpenChange={setIsBossApproveDialogOpen}>
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="h-5 w-5 text-amber-500" />
                                Annexure Approval Pending
                            </AlertDialogTitle>
                            <AlertDialogDescription className="pt-2">
                                The linked annexure <strong>{annexureName}</strong> is currently in <strong>{annexureStatus}</strong> status. 
                                Finance approval requires the annexure to be approved first.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="bg-muted/50 p-3 rounded-md text-sm my-2 border">
                            <p className="font-medium mb-1">Select an action to proceed:</p>
                            <ul className="list-disc pl-4 space-y-1 text-muted-foreground">
                                <li>Directly approve the annexure and this invoice</li>
                                <li>View the annexure details first before deciding</li>
                            </ul>
                        </div>
                        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                            <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
                            <Button 
                                variant="outline" 
                                asChild 
                                disabled={isLoading}
                                className="sm:mr-auto"
                            >
                                <Link href={`/lorries/annexure/${annexureId}`}>View Annexure</Link>
                            </Button>
                            <AlertDialogAction
                                onClick={() => handleAction(
                                    () => approveInvoiceByBoss(invoiceId, userId, userRole, "Directly Approved Both via Invoice"),
                                    "Invoice and linked Annexure approved successfully"
                                )}
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700"
                            >
                                Approve Both Directly
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
}
