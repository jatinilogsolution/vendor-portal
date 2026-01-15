"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, X, RotateCcw } from "lucide-react";
import {
    FileGroupStatus,
    UserRoleEnum,
    AnnexureStatus
} from "@/utils/constant";
import { approveFileGroup, rejectFileGroup } from "@/app/(private)/lorries/_action/annexure-workflow.action";
import { RejectionDialog } from "./rejection-dialog";
import { toast } from "sonner";
import { canReviewAnnexureGroups } from "@/utils/workflow-validator";

interface FileGroupActionsProps {
    groupId: string;
    currentStatus: string;
    annexureStatus: string;
    userRole: string;
    userId: string;
    onUpdate: () => void;
}

export function FileGroupActions({
    groupId,
    currentStatus,
    annexureStatus,
    userRole,
    userId,
    onUpdate
}: FileGroupActionsProps) {
    const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const isTadmin = userRole === UserRoleEnum.TADMIN;
    const canReview = canReviewAnnexureGroups(userRole, annexureStatus as AnnexureStatus);

    if (!isTadmin || !canReview) return null;

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const res = await approveFileGroup(groupId, userId, userRole);
            if (res.success) {
                toast.success("File group approved");
                onUpdate();
            } else {
                toast.error(res.error || "Failed to approve");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReject = async (reason: string, affectedLRs?: string) => {
        const res = await rejectFileGroup(groupId, userId, userRole, reason, affectedLRs);
        if (res.success) {
            toast.success("File group rejected");
            onUpdate();
        } else {
            throw new Error(res.error || "Failed to reject");
        }
    };

    return (
        <div className="flex items-center gap-2">
            {currentStatus !== FileGroupStatus.APPROVED && (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                    onClick={handleApprove}
                    disabled={isLoading}
                    title="Approve Group"
                >
                    <Check className="h-4 w-4" />
                </Button>
            )}

            {currentStatus !== FileGroupStatus.REJECTED && (
                <Button
                    size="sm"
                    variant="outline"
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10 border-destructive/20"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isLoading}
                    title="Reject Group"
                >
                    <X className="h-4 w-4" />
                </Button>
            )}

            {currentStatus === FileGroupStatus.REJECTED && (
                <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 px-2 text-muted-foreground hover:text-foreground"
                    onClick={() => setIsRejectDialogOpen(true)}
                    disabled={isLoading}
                >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Edit Rejection
                </Button>
            )}

            <RejectionDialog
                isOpen={isRejectDialogOpen}
                onClose={() => setIsRejectDialogOpen(false)}
                onConfirm={handleReject}
                title="Reject File Group"
                description="Please specify why this group of LRs is being rejected."
                showAffectedLRs={true}
            />
        </div>
    );
}
