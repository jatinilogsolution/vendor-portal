"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type PurchaseOrder = {
  id: string;
  poNumber: string;
  status: string;
  grandTotal: number;
};

type ProformaInvoice = {
  id: string;
  piNumber: string;
  status: string;
  grandTotal: number;
};

type Invoice = {
  id: string;
  invoiceNumber?: string | null;
  status: string;
  type: string;
  totalAmount: number;
  submittedAt?: string | null;
  poId?: string | null;
  piId?: string | null;
  documents: { id: string }[];
  payments: { id: string; status: string }[];
};

type DigitalFormValues = {
  invoiceNumber?: string;
  poId?: string;
  piId?: string;
  taxRate?: number;
  notes?: string;
  items: {
    description: string;
    qty: number;
    unitPrice: number;
  }[];
};

export default function VendorInvoicesPage({
  purchaseOrders,
  proformaInvoices,
  invoices,
  onCreateInvoice,
}: {
  purchaseOrders: PurchaseOrder[];
  proformaInvoices: ProformaInvoice[];
  invoices: Invoice[];
  onCreateInvoice: (payload: any) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const [pdfValues, setPdfValues] = useState({
    invoiceNumber: "",
    poId: "__none__",
    piId: "__none__",
    subtotal: "",
    taxRate: "0",
    notes: "",
    fileUrl: "",
  });

  const digitalForm = useForm<DigitalFormValues>({
    defaultValues: {
      invoiceNumber: "",
      poId: "__none__",
      piId: "__none__",
      taxRate: 0,
      notes: "",
      items: [{ description: "", qty: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: digitalForm.control,
    name: "items",
  });

  const digitalItems = digitalForm.watch("items");
  const digitalTaxRate = Number(digitalForm.watch("taxRate") || 0);

  const digitalTotals = useMemo(() => {
    const subtotal = digitalItems.reduce(
      (sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0),
      0
    );
    const taxAmount = (subtotal * digitalTaxRate) / 100;
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  }, [digitalItems, digitalTaxRate]);

  const handlePdfSubmit = () => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await onCreateInvoice({
        type: "PDF",
        invoiceNumber: pdfValues.invoiceNumber,
        poId: pdfValues.poId === "__none__" ? null : pdfValues.poId,
        piId: pdfValues.piId === "__none__" ? null : pdfValues.piId,
        subtotal: Number(pdfValues.subtotal),
        taxRate: Number(pdfValues.taxRate),
        notes: pdfValues.notes,
        fileUrl: pdfValues.fileUrl,
      });
      if (res?.error) {
        setStatusMessage(res.error);
      } else {
        setStatusMessage("PDF invoice submitted.");
        setPdfValues({
          invoiceNumber: "",
          poId: "__none__",
          piId: "__none__",
          subtotal: "",
          taxRate: "0",
          notes: "",
          fileUrl: "",
        });
      }
    });
  };

  const handleDigitalSubmit = digitalForm.handleSubmit((values) => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await onCreateInvoice({
        type: "DIGITAL",
        invoiceNumber: values.invoiceNumber,
        poId: values.poId === "__none__" ? null : values.poId,
        piId: values.piId === "__none__" ? null : values.piId,
        taxRate: Number(values.taxRate || 0),
        notes: values.notes,
        lineItems: values.items.map((item) => ({
          description: item.description,
          qty: Number(item.qty),
          unitPrice: Number(item.unitPrice),
        })),
      });
      if (res?.error) {
        setStatusMessage(res.error);
      } else {
        setStatusMessage("Digital invoice submitted.");
        digitalForm.reset();
      }
    });
  });

  return (
    <div className="space-y-6">
      {statusMessage ? (
        <div className="text-sm text-muted-foreground">{statusMessage}</div>
      ) : null}

      <Tabs defaultValue="pdf">
        <TabsList>
          <TabsTrigger value="pdf">PDF Invoice</TabsTrigger>
          <TabsTrigger value="digital">Digital Invoice</TabsTrigger>
        </TabsList>

        <TabsContent value="pdf">
          <Card>
            <CardHeader>
              <CardTitle>Submit PDF Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Number</label>
                  <Input
                    value={pdfValues.invoiceNumber}
                    onChange={(event) =>
                      setPdfValues((prev) => ({
                        ...prev,
                        invoiceNumber: event.target.value,
                      }))
                    }
                    placeholder="Vendor invoice number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Subtotal</label>
                  <Input
                    type="number"
                    value={pdfValues.subtotal}
                    onChange={(event) =>
                      setPdfValues((prev) => ({
                        ...prev,
                        subtotal: event.target.value,
                      }))
                    }
                    placeholder="Subtotal amount"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={pdfValues.taxRate}
                    onChange={(event) =>
                      setPdfValues((prev) => ({
                        ...prev,
                        taxRate: event.target.value,
                      }))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">PDF URL</label>
                  <Input
                    value={pdfValues.fileUrl}
                    onChange={(event) =>
                      setPdfValues((prev) => ({
                        ...prev,
                        fileUrl: event.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link to PO</label>
                  <Select
                    value={pdfValues.poId}
                    onValueChange={(value) =>
                      setPdfValues((prev) => ({ ...prev, poId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No PO</SelectItem>
                      {purchaseOrders.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.poNumber} ({po.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link to PI</label>
                  <Select
                    value={pdfValues.piId}
                    onValueChange={(value) =>
                      setPdfValues((prev) => ({ ...prev, piId: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No PI</SelectItem>
                      {proformaInvoices.map((pi) => (
                        <SelectItem key={pi.id} value={pi.id}>
                          {pi.piNumber} ({pi.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={pdfValues.notes}
                  onChange={(event) =>
                    setPdfValues((prev) => ({
                      ...prev,
                      notes: event.target.value,
                    }))
                  }
                  placeholder="Invoice notes"
                />
              </div>

              <Button disabled={isPending} onClick={handlePdfSubmit}>
                Submit PDF Invoice
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="digital">
          <Card>
            <CardHeader>
              <CardTitle>Create Digital Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Invoice Number</label>
                  <Input
                    value={digitalForm.watch("invoiceNumber") || ""}
                    onChange={(event) =>
                      digitalForm.setValue("invoiceNumber", event.target.value)
                    }
                    placeholder="Vendor invoice number"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input
                    type="number"
                    value={digitalForm.watch("taxRate") || 0}
                    onChange={(event) =>
                      digitalForm.setValue("taxRate", Number(event.target.value))
                    }
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link to PO</label>
                  <Select
                    value={digitalForm.watch("poId") || "__none__"}
                    onValueChange={(value) =>
                      digitalForm.setValue("poId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PO" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No PO</SelectItem>
                      {purchaseOrders.map((po) => (
                        <SelectItem key={po.id} value={po.id}>
                          {po.poNumber} ({po.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Link to PI</label>
                  <Select
                    value={digitalForm.watch("piId") || "__none__"}
                    onValueChange={(value) =>
                      digitalForm.setValue("piId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select PI" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">No PI</SelectItem>
                      {proformaInvoices.map((pi) => (
                        <SelectItem key={pi.id} value={pi.id}>
                          {pi.piNumber} ({pi.status})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Notes</label>
                <Textarea
                  value={digitalForm.watch("notes") || ""}
                  onChange={(event) =>
                    digitalForm.setValue("notes", event.target.value)
                  }
                  placeholder="Invoice notes"
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Line Items</h3>
                  <Button
                    size="sm"
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({ description: "", qty: 1, unitPrice: 0 })
                    }
                  >
                    Add item
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div key={field.id} className="grid gap-3 md:grid-cols-4">
                    <Input
                      value={digitalItems[index]?.description || ""}
                      onChange={(event) =>
                        digitalForm.setValue(
                          `items.${index}.description`,
                          event.target.value
                        )
                      }
                      placeholder="Description"
                    />
                    <Input
                      type="number"
                      value={digitalItems[index]?.qty || 0}
                      onChange={(event) =>
                        digitalForm.setValue(
                          `items.${index}.qty`,
                          Number(event.target.value)
                        )
                      }
                      placeholder="Qty"
                    />
                    <Input
                      type="number"
                      value={digitalItems[index]?.unitPrice || 0}
                      onChange={(event) =>
                        digitalForm.setValue(
                          `items.${index}.unitPrice`,
                          Number(event.target.value)
                        )
                      }
                      placeholder="Unit price"
                    />
                    <div className="flex items-center gap-2">
                      <div className="text-sm text-muted-foreground">
                        {(Number(digitalItems[index]?.qty || 0) *
                          Number(digitalItems[index]?.unitPrice || 0)).toFixed(2)}
                      </div>
                      <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        onClick={() => remove(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div>Subtotal: {digitalTotals.subtotal.toFixed(2)}</div>
                <div>Tax: {digitalTotals.taxAmount.toFixed(2)}</div>
                <div>Total: {digitalTotals.totalAmount.toFixed(2)}</div>
              </div>

              <Button disabled={isPending} onClick={handleDigitalSubmit}>
                Submit Digital Invoice
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Submitted Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Docs</TableHead>
                <TableHead>Payment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No invoices submitted yet.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => {
                  const latestPayment = invoice.payments?.[0];
                  return (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">
                        {invoice.invoiceNumber || invoice.id}
                      </TableCell>
                      <TableCell>
                        <Badge>{invoice.type}</Badge>
                      </TableCell>
                      <TableCell>{invoice.totalAmount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge>{invoice.status}</Badge>
                      </TableCell>
                      <TableCell>{invoice.documents?.length || 0}</TableCell>
                      <TableCell>
                        {latestPayment ? (
                          <Badge>{latestPayment.status}</Badge>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
