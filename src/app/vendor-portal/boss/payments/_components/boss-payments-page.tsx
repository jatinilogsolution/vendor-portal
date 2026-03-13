"use client";

import { useMemo, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Payment = {
  id: string;
  status: string;
  amount: number;
  paymentMode?: string | null;
  transactionRef?: string | null;
  paymentDate?: string | null;
};

type Invoice = {
  id: string;
  invoiceNumber?: string | null;
  status: string;
  totalAmount: number;
  vendor: { existingVendor: { name: string } };
  payments: Payment[];
};

type Draft = {
  amount: string;
  paymentMode: string;
  transactionRef: string;
};

export default function BossPaymentsPage({
  invoices,
  onInitiatePayment,
  onUpdatePaymentStatus,
}: {
  invoices: Invoice[];
  onInitiatePayment: (payload: any) => Promise<{ error?: string; success?: boolean }>;
  onUpdatePaymentStatus: (
    paymentId: string,
    status: "PROCESSING" | "COMPLETED" | "FAILED",
    transactionRef?: string
  ) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [drafts, setDrafts] = useState<Record<string, Draft>>({});
  const [pendingKey, setPendingKey] = useState<string | null>(null);

  const getDraft = (invoice: Invoice) =>
    drafts[invoice.id] || {
      amount: invoice.totalAmount.toFixed(2),
      paymentMode: "",
      transactionRef: "",
    };

  const updateDraft = (invoiceId: string, field: keyof Draft, value: string) => {
    setDrafts((prev) => ({
      ...prev,
      [invoiceId]: { ...prev[invoiceId], [field]: value },
    }));
  };

  const handleInitiate = (invoice: Invoice) => {
    const draft = getDraft(invoice);
    const key = `INITIATE:${invoice.id}`;
    setPendingKey(key);
    startTransition(async () => {
      const res = await onInitiatePayment({
        invoiceId: invoice.id,
        amount: Number(draft.amount || invoice.totalAmount),
        paymentMode: draft.paymentMode,
        transactionRef: draft.transactionRef,
      });
      if (res?.error) toast.error(res.error);
      else toast.success("Payment initiated.");
      setPendingKey(null);
    });
  };

  const handleUpdate = (
    payment: Payment,
    invoice: Invoice,
    status: "PROCESSING" | "COMPLETED" | "FAILED"
  ) => {
    const draft = getDraft(invoice);
    const key = `UPDATE:${payment.id}:${status}`;
    setPendingKey(key);
    startTransition(async () => {
      const res = await onUpdatePaymentStatus(payment.id, status, draft.transactionRef);
      if (res?.error) toast.error(res.error);
      else toast.success(`Payment marked ${status.toLowerCase()}.`);
      setPendingKey(null);
    });
  };

  const totals = useMemo(() => invoices.reduce((sum, i) => sum + i.totalAmount, 0), [
    invoices,
  ]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invoice Payments</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-sm text-muted-foreground">
          Pending total: {totals.toFixed(2)}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Invoice Status</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment Status</TableHead>
              <TableHead>Paid On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No invoices ready for payment.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                const latestPayment = invoice.payments?.[0];
                const canInitiate = !latestPayment || latestPayment.status === "FAILED";
                const canUpdate =
                  !!latestPayment && latestPayment.status !== "COMPLETED";
                const draft = getDraft(invoice);

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber || invoice.id}
                    </TableCell>
                    <TableCell>{invoice.vendor.existingVendor.name}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        className="w-[120px]"
                        value={draft.amount}
                        onChange={(event) =>
                          updateDraft(invoice.id, "amount", event.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      {latestPayment ? (
                        <Badge variant={latestPayment.status === "FAILED" ? "destructive" : "default"}>
                          {latestPayment.status}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {latestPayment?.paymentDate
                        ? new Date(latestPayment.paymentDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell className="space-y-2">
                      <div className="flex flex-wrap gap-2">
                        <Input
                          className="w-[140px]"
                          placeholder="Mode"
                          value={draft.paymentMode}
                          onChange={(event) =>
                            updateDraft(invoice.id, "paymentMode", event.target.value)
                          }
                        />
                        <Input
                          className="w-[180px]"
                          placeholder="Transaction ref"
                          value={draft.transactionRef}
                          onChange={(event) =>
                            updateDraft(invoice.id, "transactionRef", event.target.value)
                          }
                        />
                      </div>
                      {canInitiate ? (
                        <Button
                          size="sm"
                          disabled={isPending || pendingKey === `INITIATE:${invoice.id}`}
                          onClick={() => handleInitiate(invoice)}
                        >
                          {pendingKey === `INITIATE:${invoice.id}` ? (
                            <>
                              <Loader2 className="size-4 animate-spin" />
                              Initiating…
                            </>
                          ) : (
                            "Initiate"
                          )}
                        </Button>
                      ) : canUpdate && latestPayment ? (
                        <div className="flex flex-wrap gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isPending || pendingKey === `UPDATE:${latestPayment.id}:PROCESSING`}
                            onClick={() => handleUpdate(latestPayment, invoice, "PROCESSING")}
                          >
                            Mark Processing
                          </Button>
                          <Button
                            size="sm"
                            disabled={isPending || pendingKey === `UPDATE:${latestPayment.id}:COMPLETED`}
                            onClick={() => handleUpdate(latestPayment, invoice, "COMPLETED")}
                          >
                            Mark Completed
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            disabled={isPending || pendingKey === `UPDATE:${latestPayment.id}:FAILED`}
                            onClick={() => handleUpdate(latestPayment, invoice, "FAILED")}
                          >
                            Mark Failed
                          </Button>
                        </div>
                      ) : latestPayment ? (
                        <div className="text-xs text-muted-foreground">
                          Payment completed
                        </div>
                      ) : null}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
