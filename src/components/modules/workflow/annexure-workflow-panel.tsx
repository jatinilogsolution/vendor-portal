"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AnnexureStatus, UserRoleEnum } from "@/utils/constant";
import {
  submitAnnexureForReview,
  forwardAnnexureToBoss,
  approveAnnexureByBoss,
  rejectAnnexureByBoss,
} from "@/app/(private)/lorries/_action/annexure-workflow.action";
import { Button } from "@/components/ui/button";
import { Send, CheckCircle, XCircle, Forward, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { RejectionDialog } from "./rejection-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WorkflowStatusBadge } from "./workflow-status-badge";

interface AnnexureWorkflowPanelProps {
  annexureId: string;
  currentStatus: string;
  userRole: string;
  userId: string;
  allGroupsApproved: boolean;
  onUpdate: () => void;
  invoiceId?: string;
}

export function AnnexureWorkflowPanel({
  annexureId,

  currentStatus,
  userRole,
  userId,
  allGroupsApproved,
  onUpdate,
  invoiceId,
}: AnnexureWorkflowPanelProps) {
  const router = useRouter();
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const status = currentStatus as AnnexureStatus;

  const handleAction = async (
    actionFn: () => Promise<any>,
    successMsg: string,
  ) => {
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

  const handleResubmit = async () => {
    try {
      setIsLoading(true);
      const res = await submitAnnexureForReview(annexureId, userId, userRole);
      if (res.success) {
        toast.success("Annexure resubmitted successfully");
        // Navigate to invoice page if invoiceId is returned from action OR passed as prop
        const targetInvoiceId = res.invoiceId || invoiceId;
        if (targetInvoiceId) {
          console.log("targetInvoiceId");
          router.push(`/invoices/${targetInvoiceId}`);
        } else {
          onUpdate();
        }
      } else {
        toast.error(res.error || "Resubmission failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBossReject = async (reason: string) => {
    const res = await rejectAnnexureByBoss(
      annexureId,
      userId,
      userRole,
      reason,
    );
    if (res.success) {
      toast.success("Annexure rejected by BOSS");
      onUpdate();
    } else {
      throw new Error(res.error || "Failed to reject");
    }
  };

  // Visibility checks
  const showSubmit =
    userRole === UserRoleEnum.TVENDOR &&
    (status === AnnexureStatus.DRAFT ||
      status === AnnexureStatus.HAS_REJECTIONS ||
      status === AnnexureStatus.REJECTED_BY_BOSS);

  const showForward =
    userRole === UserRoleEnum.TADMIN &&
    (status === AnnexureStatus.PARTIALLY_APPROVED ||
      status === AnnexureStatus.PENDING_TADMIN_REVIEW) &&
    allGroupsApproved;

  const showReviewMessage =
    userRole === UserRoleEnum.TADMIN &&
    (status === AnnexureStatus.PENDING_TADMIN_REVIEW ||
      status === AnnexureStatus.PARTIALLY_APPROVED) &&
    !allGroupsApproved;

  const showBossActions =
    userRole === UserRoleEnum.BOSS &&
    status === AnnexureStatus.PENDING_BOSS_REVIEW;

  if (!showSubmit && !showForward && !showBossActions && !showReviewMessage)
    return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">Workflow Actions</CardTitle>
            <CardDescription>
              Actions available for your role based on current status
            </CardDescription>
          </div>
          <WorkflowStatusBadge status={status} type="annexure" />
        </div>
      </CardHeader>
      <CardContent className="py-2 ">
        <div className="flex flex-wrap gap-3">
          {showSubmit && (
            <Button
              onClick={
                status === AnnexureStatus.DRAFT
                  ? () =>
                      handleAction(
                        () =>
                          submitAnnexureForReview(annexureId, userId, userRole),
                        "Annexure submitted for review",
                      )
                  : handleResubmit
              }
              disabled={isLoading}
              className="gap-2"
            >
              <Send className="h-4 w-4" />
              {status === AnnexureStatus.DRAFT
                ? "Submit for Review"
                : "Resubmit Annexure"}
            </Button>
          )}

          {showForward && (
            <Button
              onClick={() =>
                handleAction(
                  () => forwardAnnexureToBoss(annexureId, userId, userRole),
                  "Forwarded to BOSS",
                )
              }
              disabled={isLoading}
              className="gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Forward className="h-4 w-4" />
              Forward to BOSS
            </Button>
          )}

          {showBossActions && (
            <>
              <Button
                onClick={() =>
                  handleAction(
                    () => approveAnnexureByBoss(annexureId, userId, userRole),
                    "Annexure approved by BOSS",
                  )
                }
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
                Reject Entire Annexure
              </Button>
            </>
          )}

          {showReviewMessage && (
            <Alert className="border-primary bg-primary/10 text-primary rounded-none border-0 border-l-6">
              <AlertCircle />
              <AlertTitle>Review in Progress</AlertTitle>
              <AlertDescription className="to-secondary text-xs">
                Please review and approve each file group before forwarding to
                BOSS.
              </AlertDescription>
            </Alert>
          )}

          {status === AnnexureStatus.HAS_REJECTIONS &&
            userRole === UserRoleEnum.TVENDOR && (
              <Alert variant="destructive" className="bg-red-50 py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs">
                  Some file groups have been rejected. Please fix them and
                  resubmit.
                </AlertDescription>
              </Alert>
            )}
        </div>

        <RejectionDialog
          isOpen={isRejectDialogOpen}
          onClose={() => setIsRejectDialogOpen(false)}
          onConfirm={handleBossReject}
          title="Reject Annexure"
          description="Provide a reason for rejecting the entire annexure. This will return it to the TVENDOR."
        />
      </CardContent>
    </Card>
  );
}
