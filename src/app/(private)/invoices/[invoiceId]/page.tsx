"use client";

import { Invoice } from "../_component/invoice";
import { useParams, useRouter } from "next/navigation";
// import { InvoiceAddOnSheet } from "../_component/edit-sheet"
// import { AddLrButtonToInvoice } from "../_component/add-lr-button"
import { InvoiceManagement } from "../_component/invoice-management";
import { useEffect, useState, useCallback } from "react";
import { ErrorCard } from "@/components/error";
import ScreenSkeleton from "@/components/modules/screen-skeleton";
import { Button } from "@/components/ui/button";
// import { InvoiceFileUploadSingle } from "../_component/invoice-file-upload"
import { toast } from "sonner";
import { BackToPage } from "@/components/back-to-page";
import { Separator } from "@/components/ui/separator";
import {
  sendInvoiceById,
  withdrawInvoice,
  saveDraftInvoice,
} from "../_action/invoice-list";
import {
  deleteInvoice as deleteInvoiceWorkflow,
  requestInvoiceDeletion as requestDeletionWorkflow,
} from "../_action/invoice-workflow.action";
import { useInvoiceStore } from "@/components/modules/invoice-context";
import Link from "next/link";
import {
  IconChartColumn,
  IconTrash,
  IconDeviceFloppy,
  IconSend,
  IconArrowBack,
} from "@tabler/icons-react";
import { InvoiceStatus, UserRoleEnum } from "@/utils/constant";
import { useSession } from "@/lib/auth-client";
import { WorkflowStatusBadge } from "@/components/modules/workflow/workflow-status-badge";
import { InvoiceWorkflowPanel } from "@/components/modules/workflow/invoice-workflow-panel";
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
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkflowTimeline } from "@/components/modules/workflow/workflow-timeline";
import { WorkflowComments } from "@/components/modules/workflow/workflow-comments";
import { Badge } from "@/components/ui/badge";
import { ManualNotificationDialog } from "@/components/modules/workflow/manual-notification-dialog";
import {
  createAnnexureFromExistingInvoice,
  resetInvoiceAndAnnexure,
} from "../_action/manual-workflow.action";
import { canEditInvoice } from "@/utils/workflow-validator";
import { AlertCircle, FilePlus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { IconRefresh } from "@tabler/icons-react";

const InvoiceIdPage = () => {
  const params = useParams<{ invoiceId: string }>();
  const invoiceId = params.invoiceId;
  const router = useRouter();

  const session = useSession();

  useEffect(() => {
    if (!session.data) {
      session.refetch();
    }
  }, []);
  const role = session.data?.user.role;
  const isAuthorized =
    role !== undefined &&
    role !== null &&
    [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(role as UserRoleEnum);

  const isTVendor = role === UserRoleEnum.TVENDOR;

  const { taxRate, subTotal, totalExtra, taxAmount, grandTotal } =
    useInvoiceStore();

  const [error, setError] = useState<string | null>(null);
  const [invoice, setInvoice] = useState<any>();
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);

  const fetchInvoice = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`/api/invoices/${invoiceId}`);

      const data = await res.json();

      if (data.error) {
        setError(data.error);
      } else {
        setInvoice(data);
      }
    } catch (err) {
      console.error(err);
      setError("Error fetching invoice");
    } finally {
      setLoading(false);
    }
  }, [invoiceId]);

  useEffect(() => {
    if (!invoiceId) return;
    fetchInvoice();
  }, [invoiceId, fetchInvoice]);

  const handleSaveDraft = async () => {
    try {
      setActionLoading(true);
      const result = await saveDraftInvoice({
        invoiceId,
        taxRate,
        subTotal,
        totalExtra,
        taxAmount,
        grandTotal,
      });

      if (result.success) {
        toast.success(result.message);
        fetchInvoice();
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendInvoice = async () => {
    try {
      setActionLoading(true);
      const sendPromise = await sendInvoiceById({
        invoiceId,
        taxRate,
        subTotal,
        totalExtra,
        taxAmount,
        grandTotal,
      });

      if (sendPromise.success) {
        toast.success(sendPromise.message);

        fetchInvoice();
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleWithdraw = async () => {
    try {
      setActionLoading(true);
      const result = await withdrawInvoice(invoiceId);

      if (result.success) {
        toast.success(result.message);
        fetchInvoice();
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setActionLoading(true);
      const result = await deleteInvoiceWorkflow(
        invoiceId,
        session.data?.user.id as string,
        role as string,
      );

      if (result.success) {
        toast.success("Invoice deleted successfully");
        router.push("/invoices");
      } else {
        toast.error(result.error || "Failed to delete invoice");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestDeletion = async () => {
    try {
      setActionLoading(true);
      const result = await requestDeletionWorkflow(
        invoiceId,
        session.data?.user.id as string,
        role as string,
      );

      if (result.success) {
        toast.success("Deletion request sent to Traffic Admin");
        fetchInvoice();
      } else {
        toast.error(result.error || "Failed to request deletion");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      setActionLoading(true);
      const result = await resetInvoiceAndAnnexure(invoiceId);

      if (result.success) {
        toast.success(result.message);
        router.push("/invoices");
      } else {
        toast.error(result.error || "Failed to reset invoice");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setActionLoading(false);
    }
  };

  if (error)
    return (
      <div className="p-8 w-full mt-6 flex items-center justify-center">
        <ErrorCard message={error} title="Something Went Wrong" />
      </div>
    );

  if (loading)
    return (
      <div className="p-8 w-full flex items-center justify-center">
        <ScreenSkeleton />
      </div>
    );

  return (
    <div className="relative">
      <div className="px-6 flex flex-col gap-4">
        <div className="flex w-full items-center justify-between">
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight flex gap-x-4 items-center">
            <BackToPage title="Back to Invoices" location="/invoices" />{" "}
            <span>Booking Cover Note </span>
            <WorkflowStatusBadge
              status={invoice.status || "DRAFT"}
              type="invoice"
              role={role as string}
            />
            {invoice.annexure && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  Annexure Status
                </span>
                <Link
                  href={`/lorries/annexure/${invoice.annexureId}`}
                  className="flex items-center gap-2 group"
                >
                  <WorkflowStatusBadge
                    status={invoice.annexure.status}
                    type="annexure"
                    role={role as string}
                  />
                  <span className="text-sm font-medium group-hover:underline text-primary/80 transition-all">
                    {invoice.annexure.name}
                  </span>
                </Link>
              </div>
            )}
          </h4>

          <div className="flex justify-end gap-3 items-center">
            {canEditInvoice(role as string, invoice as any).canEdit && (
              <InvoiceManagement
                invoiceId={invoiceId}
                referenceNumber={invoice.refernceNumber}
                invoiceNumber={invoice.invoiceNumber}
                initialFile={
                  invoice.invoiceURI
                    ? {
                        fileUrl: invoice.invoiceURI,
                        id: "1",
                        name: "Invoice",
                      }
                    : undefined
                }
                initialInvoiceDate={invoice.invoiceDate?.split("T")[0]}
                onUpdate={fetchInvoice}
              />
            )}

            {canEditInvoice(role as string, invoice as any).canEdit && (
              <Button
                onClick={handleSaveDraft}
                variant="outline"
                disabled={actionLoading}
              >
                <IconDeviceFloppy className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
            )}

            {isAuthorized && (
              <Button variant="link" asChild className="bg-muted">
                <Link
                  href={`/invoices/${invoiceId}/compare`}
                  className="flex items-center justify-center gap-x-2"
                >
                  <IconChartColumn className="w-4 h-4" /> Compare
                </Link>
              </Button>
            )}

            {isAuthorized && (
              <ManualNotificationDialog
                recipientEmail={invoice.vendor?.users?.[0]?.email || ""}
                recipientId={invoice.vendor?.users?.[0]?.id}
                entityName={invoice.invoiceNumber || invoice.refernceNumber}
                path={`/invoices/${invoiceId}`}
                currentUserRole={role as string}
                availableRecipients={
                  invoice.vendor?.users?.map((u: any) => ({
                    email: u.email,
                    name: u.name || u.email,
                    id: u.id,
                  })) || []
                }
              />
            )}

            {(isAuthorized || isTVendor) && !invoice.annexureId && (
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100"
                onClick={async () => {
                  try {
                    setActionLoading(true);
                    const res =
                      await createAnnexureFromExistingInvoice(invoiceId);
                    if (res.success) {
                      toast.success("Annexure generated successfully");
                      fetchInvoice();
                    } else {
                      toast.error(
                        typeof (res as any).data === "string"
                          ? (res as any).data
                          : (res as any).error || "Failed to generate annexure",
                      );
                    }
                  } catch (e) {
                    toast.error("An error occurred");
                  } finally {
                    setActionLoading(false);
                  }
                }}
                disabled={actionLoading}
              >
                <FilePlus className="w-4 h-4" />
                Generate Source Annexure
              </Button>
            )}
            {/* Deletion logic: Vendor can delete if not submitted. Admin can delete if requested. */}
            {isTVendor && invoice.submittedAt === null && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    disabled={actionLoading}
                  >
                    <IconTrash className="w-4 h-4" />
                    Delete Invoice
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Invoice?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this draft and unlink all
                      associated LRs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {isTVendor &&
              // invoice.submittedAt !== null &&
              !invoice.deletionRequested && ( // (invoice.status === InvoiceStatus.PENDING_TADMIN_REVIEW ||
                // invoice.status === InvoiceStatus.REJECTED_BY_TADMIN) && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleRequestDeletion}
                  disabled={actionLoading}
                >
                  <IconTrash className="w-4 h-4 mr-2" />
                  Request Deletion
                </Button>
              )}

            {role === UserRoleEnum.TADMIN && invoice.deletionRequested && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2"
                    disabled={actionLoading}
                  >
                    <IconTrash className="w-4 h-4" />
                    Approve Deletion Request
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Approve Deletion Request?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      The Vendor has requested to delete this invoice.
                      Confirming will permanently remove it.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-red-600"
                    >
                      Confirm Deletion
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            {role === UserRoleEnum.BOSS && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                    disabled={actionLoading}
                  >
                    <IconRefresh className="w-4 h-4" />
                    Reset & Unlink Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Reset Invoice & Annexure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This will DELETE the Invoice and linked Annexure. All LRs
                      will be unlinked, extra costs removed, and status reset to
                      PENDING. This acts as a complete "Start Over" for these
                      LRs.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleReset}
                      className="bg-orange-600"
                    >
                      Confirm Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>

        {/* Edit Restriction Alert for Vendors */}
        {isTVendor &&
          canEditInvoice(role as string, invoice).reason &&
          invoice.status.includes("REJECTED") && (
            <Alert
              variant={
                canEditInvoice(role as string, invoice).canEdit
                  ? "default"
                  : "destructive"
              }
              className={cn(
                canEditInvoice(role as string, invoice).canEdit
                  ? "bg-amber-50 border-amber-200 text-amber-800"
                  : "bg-red-50 border-red-200 text-red-800",
              )}
            >
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>
                {canEditInvoice(role as string, invoice).canEdit
                  ? "Note: Linked Document"
                  : "Action Required via Annexure"}
              </AlertTitle>
              <AlertDescription>
                {canEditInvoice(role as string, invoice).reason}
                {invoice.annexureId && (
                  <Button
                    variant="link"
                    asChild
                    className={cn(
                      "p-0 h-auto font-bold ml-1",
                      canEditInvoice(role as string, invoice).canEdit
                        ? "text-amber-800"
                        : "text-red-800",
                    )}
                  >
                    <Link href={`/lorries/annexure/${invoice.annexureId}`}>
                      Go to Annexure
                    </Link>
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

        {session.data?.user && (
          <InvoiceWorkflowPanel
            invoiceId={invoiceId}
            invoiceNumber={invoice.invoiceNumber || invoice.refernceNumber}
            currentStatus={invoice.status || "DRAFT"}
            userRole={session.data.user.role as string}
            userId={session.data.user.id}
            onUpdate={fetchInvoice}
            annexureId={invoice.annexureId}
            annexureStatus={invoice.annexure?.status}
            annexureName={invoice.annexure?.name}
          />
        )}
      </div>

      <Separator className="mt-3" />

      <div className="grid grid-cols-1  gap-6 px-6 mt-6">
        <div className="lg:col-span-2 space-y-6">
          <Invoice data={invoice} />
        </div>

        <div className="space-y-6">
          {invoice.statusHistory && invoice.statusHistory.length > 0 && (
            <Card>
              <CardHeader className="pb-3 px-4 pt-4">
                <CardTitle className="text-sm font-semibold flex items-center gap-2">
                  <IconChartColumn className="h-4 w-4 text-primary" />
                  Approval History
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <WorkflowTimeline logs={invoice.statusHistory} type="invoice" />
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {session.data?.user && (
        <WorkflowComments
          invoiceId={invoiceId}
          currentUser={{
            id: session.data.user.id,
            name: session.data.user.name || "User",
            role: session.data.user.role as string,
          }}
          availableRecipients={
            invoice.vendor?.users?.map((u: any) => ({
              email: u.email,
              name: u.name || u.email,
              id: u.id,
            })) || []
          }
        />
      )}
    </div>
  );
};

export default InvoiceIdPage;
