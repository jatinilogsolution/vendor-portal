"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Eye, Loader2 } from "lucide-react";

type PurchaseOrder = {
  id: string;
  poNumber: string;
  status: string;
  grandTotal: number;
  notes?: string | null;
  rejectionReason?: string | null;
  submittedAt?: string | null;
  vendor: { existingVendor: { name: string } };
  items?: { id: string; description: string; qty: number; unitPrice: number; total: number }[];
};

type ProformaInvoice = {
  id: string;
  piNumber: string;
  status: string;
  grandTotal: number;
  notes?: string | null;
  rejectionReason?: string | null;
  submittedAt?: string | null;
  vendor: { existingVendor: { name: string } };
  items?: { id: string; description: string; qty: number; unitPrice: number; total: number }[];
};

type Invoice = {
  id: string;
  invoiceNumber?: string | null;
  status: string;
  type: string;
  totalAmount: number;
  notes?: string | null;
  submittedAt?: string | null;
  vendor: { existingVendor: { name: string } };
  documents?: { id: string; filePath: string }[];
};

export default function ApprovalQueuePage({
  purchaseOrders,
  proformaInvoices,
  invoices,
  onApprovePo,
  onRejectPo,
  onApprovePi,
  onRejectPi,
  onApproveInvoice,
  onRejectInvoice,
  onRequestRevision,
}: {
  purchaseOrders: PurchaseOrder[];
  proformaInvoices: ProformaInvoice[];
  invoices: Invoice[];
  onApprovePo: (poId: string) => Promise<{ error?: string; success?: boolean }>;
  onRejectPo: (poId: string, reason: string) => Promise<{ error?: string; success?: boolean }>;
  onApprovePi: (piId: string) => Promise<{ error?: string; success?: boolean }>;
  onRejectPi: (piId: string, reason: string) => Promise<{ error?: string; success?: boolean }>;
  onApproveInvoice: (invoiceId: string) => Promise<{ error?: string; success?: boolean }>;
  onRejectInvoice: (
    invoiceId: string,
    reason: string
  ) => Promise<{ error?: string; success?: boolean }>;
  onRequestRevision?: (
    invoiceId: string,
    reason: string
  ) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const [detailOpen, setDetailOpen] = useState(false);
  const [detail, setDetail] = useState<
    | { kind: "PO"; data: PurchaseOrder }
    | { kind: "PI"; data: ProformaInvoice }
    | { kind: "INVOICE"; data: Invoice }
    | null
  >(null);

  const [decisionOpen, setDecisionOpen] = useState(false);
  const [decisionReason, setDecisionReason] = useState("");
  const [decision, setDecision] = useState<
    | { kind: "PO"; action: "APPROVE" | "REJECT"; data: PurchaseOrder }
    | { kind: "PI"; action: "APPROVE" | "REJECT"; data: ProformaInvoice }
    | {
        kind: "INVOICE";
        action: "APPROVE" | "REJECT" | "REVISION";
        data: Invoice;
      }
    | null
  >(null);

  const statusVariant = useCallbackStatusVariant();

  const openDetails = (
    d:
      | { kind: "PO"; data: PurchaseOrder }
      | { kind: "PI"; data: ProformaInvoice }
      | { kind: "INVOICE"; data: Invoice }
  ) => {
    setDetail(d);
    setDetailOpen(true);
  };

  const openDecision = (d: typeof decision) => {
    if (!d) return;
    setDecision(d);
    setDecisionReason("");
    setDecisionOpen(true);
  };

  const reasonRequired = useMemo(() => {
    if (!decision) return false;
    if (decision.kind === "PO" && decision.action === "REJECT") return true;
    if (decision.kind === "PI" && decision.action === "REJECT") return true;
    if (decision.kind === "INVOICE" && decision.action !== "APPROVE") return true;
    return false;
  }, [decision]);

  const submitDecision = () => {
    if (!decision) return;
    const reason = decisionReason.trim();
    if (reasonRequired && reason.length === 0) {
      toast.error("Please provide a reason.");
      return;
    }

    const key = `${decision.kind}:${decision.action}:${decision.data.id}`;
    setPendingKey(key);
    startTransition(async () => {
      try {
        if (decision.kind === "PO") {
          const res =
            decision.action === "APPROVE"
              ? await onApprovePo(decision.data.id)
              : await onRejectPo(decision.data.id, reason);
          if (res?.error) toast.error(res.error);
          else toast.success(
            decision.action === "APPROVE" ? "PO approved." : "PO rejected."
          );
        } else if (decision.kind === "PI") {
          const res =
            decision.action === "APPROVE"
              ? await onApprovePi(decision.data.id)
              : await onRejectPi(decision.data.id, reason);
          if (res?.error) toast.error(res.error);
          else toast.success(
            decision.action === "APPROVE" ? "PI approved." : "PI rejected."
          );
        } else {
          if (decision.action === "APPROVE") {
            const res = await onApproveInvoice(decision.data.id);
            if (res?.error) toast.error(res.error);
            else toast.success("Invoice approved.");
          } else if (decision.action === "REVISION") {
            if (!onRequestRevision) {
              toast.error("Revision flow not available.");
              return;
            }
            const res = await onRequestRevision(decision.data.id, reason);
            if (res?.error) toast.error(res.error);
            else toast.success("Revision requested.");
          } else {
            const res = await onRejectInvoice(decision.data.id, reason);
            if (res?.error) toast.error(res.error);
            else toast.success("Invoice rejected.");
          }
        }
        setDecisionOpen(false);
      } finally {
        setPendingKey(null);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No pending purchase orders.
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>{po.vendor.existingVendor.name}</TableCell>
                    <TableCell>{po.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(po.status)}>{po.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetails({ kind: "PO", data: po })}
                        >
                          <Eye className="size-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          disabled={isPending || pendingKey === `PO:APPROVE:${po.id}`}
                          onClick={() =>
                            openDecision({ kind: "PO", action: "APPROVE", data: po })
                          }
                        >
                          {pendingKey === `PO:APPROVE:${po.id}` ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Approving…
                            </>
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending || pendingKey === `PO:REJECT:${po.id}`}
                          onClick={() =>
                            openDecision({ kind: "PO", action: "REJECT", data: po })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proforma Invoice Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PI Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proformaInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No pending proforma invoices.
                  </TableCell>
                </TableRow>
              ) : (
                proformaInvoices.map((pi) => (
                  <TableRow key={pi.id}>
                    <TableCell className="font-medium">{pi.piNumber}</TableCell>
                    <TableCell>{pi.vendor.existingVendor.name}</TableCell>
                    <TableCell>{pi.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(pi.status)}>{pi.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openDetails({ kind: "PI", data: pi })}
                        >
                          <Eye className="size-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          disabled={isPending || pendingKey === `PI:APPROVE:${pi.id}`}
                          onClick={() =>
                            openDecision({ kind: "PI", action: "APPROVE", data: pi })
                          }
                        >
                          {pendingKey === `PI:APPROVE:${pi.id}` ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Approving…
                            </>
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={isPending || pendingKey === `PI:REJECT:${pi.id}`}
                          onClick={() =>
                            openDecision({ kind: "PI", action: "REJECT", data: pi })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Vendor Invoice Approvals</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No pending vendor invoices.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber || invoice.id}
                    </TableCell>
                    <TableCell>{invoice.vendor.existingVendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{invoice.type}</Badge>
                    </TableCell>
                    <TableCell>{invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex flex-wrap justify-end gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            openDetails({ kind: "INVOICE", data: invoice })
                          }
                        >
                          <Eye className="size-4" />
                          View
                        </Button>
                        <Button
                          size="sm"
                          disabled={
                            isPending ||
                            pendingKey === `INVOICE:APPROVE:${invoice.id}`
                          }
                          onClick={() =>
                            openDecision({
                              kind: "INVOICE",
                              action: "APPROVE",
                              data: invoice,
                            })
                          }
                        >
                          {pendingKey === `INVOICE:APPROVE:${invoice.id}` ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Approving…
                            </>
                          ) : (
                            "Approve"
                          )}
                        </Button>
                        {onRequestRevision ? (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              isPending ||
                              pendingKey === `INVOICE:REVISION:${invoice.id}`
                            }
                            onClick={() =>
                              openDecision({
                                kind: "INVOICE",
                                action: "REVISION",
                                data: invoice,
                              })
                            }
                          >
                            Request revision
                          </Button>
                        ) : null}
                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={
                            isPending || pendingKey === `INVOICE:REJECT:${invoice.id}`
                          }
                          onClick={() =>
                            openDecision({
                              kind: "INVOICE",
                              action: "REJECT",
                              data: invoice,
                            })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Sheet open={detailOpen} onOpenChange={setDetailOpen}>
        <SheetContent className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>
              {detail?.kind === "PO"
                ? `Purchase Order ${detail.data.poNumber}`
                : detail?.kind === "PI"
                  ? `Proforma Invoice ${detail.data.piNumber}`
                  : detail
                    ? `Invoice ${detail.data.invoiceNumber || detail.data.id}`
                    : "Details"}
            </SheetTitle>
            <SheetDescription>
              Review the document details before taking action.
            </SheetDescription>
          </SheetHeader>
          {detail ? (
            <div className="mt-6 space-y-4 text-sm">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={statusVariant(detail.data.status)}>
                  {detail.data.status}
                </Badge>
                {"vendor" in detail.data ? (
                  <span className="text-muted-foreground">
                    Vendor:{" "}
                    <span className="text-foreground font-medium">
                      {detail.data.vendor.existingVendor.name}
                    </span>
                  </span>
                ) : null}
              </div>

              {"notes" in detail.data && detail.data.notes ? (
                <div className="rounded-lg border border-border p-3">
                  <p className="text-xs font-medium text-muted-foreground">
                    Notes
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{detail.data.notes}</p>
                </div>
              ) : null}

              {("items" in detail.data && detail.data.items && detail.data.items.length > 0) ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Line items
                  </p>
                  <div className="rounded-lg border border-border">
                    <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs text-muted-foreground">
                      <div className="col-span-6">Description</div>
                      <div className="col-span-2 text-right">Qty</div>
                      <div className="col-span-2 text-right">Rate</div>
                      <div className="col-span-2 text-right">Total</div>
                    </div>
                    <Separator />
                    {detail.data.items.map((it) => (
                      <div
                        key={it.id}
                        className="grid grid-cols-12 gap-2 px-3 py-2"
                      >
                        <div className="col-span-6">{it.description}</div>
                        <div className="col-span-2 text-right">
                          {Number(it.qty).toFixed(2)}
                        </div>
                        <div className="col-span-2 text-right">
                          {Number(it.unitPrice).toFixed(2)}
                        </div>
                        <div className="col-span-2 text-right font-medium">
                          {Number(it.total).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {detail.kind === "INVOICE" &&
              detail.data.documents &&
              detail.data.documents.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Documents
                  </p>
                  <ul className="space-y-1">
                    {detail.data.documents.map((d) => (
                      <li key={d.id}>
                        <a
                          href={d.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="text-primary underline underline-offset-4"
                        >
                          View document
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}
        </SheetContent>
      </Sheet>

      <AlertDialog open={decisionOpen} onOpenChange={setDecisionOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {decision?.action === "APPROVE"
                ? "Confirm approval"
                : decision?.action === "REVISION"
                  ? "Request revision"
                  : "Confirm rejection"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {decision?.action === "APPROVE"
                ? "This will approve the document and move it to the next stage."
                : "Add a reason. This will be visible to the vendor/admin and logged in audit."}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {reasonRequired ? (
            <div className="space-y-2">
              <Textarea
                value={decisionReason}
                onChange={(e) => setDecisionReason(e.target.value)}
                placeholder="Reason"
                className="min-h-[90px]"
              />
              <p className="text-xs text-muted-foreground">
                Please be specific. This message will help resolve issues faster.
              </p>
            </div>
          ) : null}

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                submitDecision();
              }}
              disabled={isPending || (reasonRequired && decisionReason.trim().length === 0)}
            >
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Working…
                </>
              ) : decision?.action === "APPROVE" ? (
                "Approve"
              ) : decision?.action === "REVISION" ? (
                "Request revision"
              ) : (
                "Reject"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function useCallbackStatusVariant() {
  return (status: string): "default" | "secondary" | "destructive" | "outline" => {
    if (status === "SUBMITTED") return "default";
    if (status === "APPROVED" || status === "PAYMENT_CONFIRMED") return "default";
    if (status === "REJECTED") return "destructive";
    if (status === "REVISION_REQUESTED" || status === "PAYMENT_FAILED") return "outline";
    if (status === "PAYMENT_INITIATED" || status === "PAYMENT_PROCESSING") return "secondary";
    return "secondary";
  };
}
