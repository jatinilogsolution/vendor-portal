"use client";

import { useMemo, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type VpVendor = {
  id: string;
  vendorType: string;
  billingType?: string | null;
  recurringCycle?: string | null;
  existingVendor: { name: string };
};

type Category = {
  id: string;
  name: string;
};

type Item = {
  id: string;
  name: string;
  code: string;
  defaultPrice: number;
};

type ProformaInvoice = {
  id: string;
  piNumber: string;
  status: string;
  grandTotal: number;
  taxRate: number;
  createdAt: string;
  convertedToPoId?: string | null;
  vendor: { existingVendor: { name: string } };
};

type PiFormValues = {
  vendorId: string;
  categoryId?: string;
  validityDate?: string;
  paymentTerms?: string;
  notes?: string;
  taxRate?: number;
  items: {
    itemId?: string;
    description: string;
    qty: number;
    unitPrice: number;
  }[];
};

export default function ProformaInvoicePage({
  vendors,
  categories,
  items,
  proformaInvoices,
  onCreate,
  onSubmit,
  onSendToVendor,
  onConvertToPo,
}: {
  vendors: VpVendor[];
  categories: Category[];
  items: Item[];
  proformaInvoices: ProformaInvoice[];
  onCreate: (payload: any) => Promise<{ error?: string; success?: boolean }>;
  onSubmit: (piId: string) => Promise<{ error?: string; success?: boolean }>;
  onSendToVendor: (piId: string) => Promise<{ error?: string; success?: boolean }>;
  onConvertToPo?: (piId: string) => Promise<{ error?: string; poId?: string; success?: boolean }>;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PiFormValues>({
    defaultValues: {
      vendorId: "",
      categoryId: "__none__",
      validityDate: "",
      paymentTerms: "",
      notes: "",
      taxRate: 0,
      items: [
        {
          itemId: "",
          description: "",
          qty: 1,
          unitPrice: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const selectedItems = form.watch("items");
  const taxRate = Number(form.watch("taxRate") || 0);

  const totals = useMemo(() => {
    const subtotal = selectedItems.reduce(
      (sum, item) => sum + Number(item.qty || 0) * Number(item.unitPrice || 0),
      0
    );
    const taxAmount = (subtotal * taxRate) / 100;
    const grandTotal = subtotal + taxAmount;
    return { subtotal, taxAmount, grandTotal };
  }, [selectedItems, taxRate]);

  const handleCreate = (values: PiFormValues, status: "DRAFT" | "SUBMITTED") => {
    setStatusMessage(null);
    startTransition(async () => {
      const res = await onCreate({
        ...values,
        status,
        categoryId: values.categoryId === "__none__" ? null : values.categoryId,
        items: values.items.map((item) => ({
          ...item,
          itemId: item.itemId || null,
          qty: Number(item.qty),
          unitPrice: Number(item.unitPrice),
        })),
      });
      if (res?.error) {
        setStatusMessage(res.error);
      } else {
        setStatusMessage("Proforma invoice saved.");
        form.reset();
      }
    });
  };

  const handleSubmitPi = (piId: string) => {
    startTransition(async () => {
      const res = await onSubmit(piId);
      if (res?.error) setStatusMessage(res.error);
      else setStatusMessage("Proforma invoice submitted to boss.");
    });
  };

  const handleSendPi = (piId: string) => {
    startTransition(async () => {
      const res = await onSendToVendor(piId);
      if (res?.error) setStatusMessage(res.error);
      else setStatusMessage("PI sent to vendor.");
    });
  };

  const handleConvertToPo = (piId: string) => {
    if (!onConvertToPo) return;
    startTransition(async () => {
      const res = await onConvertToPo(piId);
      if (res?.error) setStatusMessage(res.error);
      else setStatusMessage(res.poId ? "PO created. You can edit and submit it from Purchase Orders." : "Converted.");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Proforma Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {statusMessage ? (
            <div className="text-sm text-muted-foreground">{statusMessage}</div>
          ) : null}
          <form className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Vendor</label>
                <Select
                  value={form.watch("vendorId")}
                  onValueChange={(value) => form.setValue("vendorId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select vendor" />
                  </SelectTrigger>
                  <SelectContent>
                    {vendors.map((vendor) => (
                      <SelectItem key={vendor.id} value={vendor.id}>
                        {vendor.existingVendor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <Select
                  value={form.watch("categoryId") || "__none__"}
                  onValueChange={(value) => form.setValue("categoryId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Assign category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">Unassigned</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Validity Date</label>
                <Input
                  type="date"
                  value={form.watch("validityDate") || ""}
                  onChange={(event) =>
                    form.setValue("validityDate", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Payment Terms</label>
                <Input
                  value={form.watch("paymentTerms") || ""}
                  onChange={(event) =>
                    form.setValue("paymentTerms", event.target.value)
                  }
                  placeholder="Payment terms"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <Textarea
                value={form.watch("notes") || ""}
                onChange={(event) => form.setValue("notes", event.target.value)}
                placeholder="Optional notes"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold">Line Items</h3>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    append({ description: "", qty: 1, unitPrice: 0, itemId: "" })
                  }
                >
                  Add Item
                </Button>
              </div>
              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid gap-3 md:grid-cols-[2fr_1fr_1fr_1fr_auto]"
                  >
                    <Select
                      value={form.watch(`items.${index}.itemId`) || "__none__"}
                      onValueChange={(value) => {
                        const item = items.find((i) => i.id === value);
                        if (item) {
                          form.setValue(
                            `items.${index}.description`,
                            `${item.name} (${item.code})`
                          );
                          form.setValue(
                            `items.${index}.unitPrice`,
                            item.defaultPrice
                          );
                        }
                        form.setValue(
                          `items.${index}.itemId`,
                          value === "__none__" ? "" : value
                        );
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">Manual</SelectItem>
                        {items.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
                            {item.code} - {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                      value={form.watch(`items.${index}.description`) || ""}
                      onChange={(event) =>
                        form.setValue(
                          `items.${index}.description`,
                          event.target.value
                        )
                      }
                      placeholder="Description"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={form.watch(`items.${index}.qty`) || 0}
                      onChange={(event) =>
                        form.setValue(
                          `items.${index}.qty`,
                          Number(event.target.value)
                        )
                      }
                      placeholder="Qty"
                    />
                    <Input
                      type="number"
                      step="0.01"
                      value={form.watch(`items.${index}.unitPrice`) || 0}
                      onChange={(event) =>
                        form.setValue(
                          `items.${index}.unitPrice`,
                          Number(event.target.value)
                        )
                      }
                      placeholder="Unit Price"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-[1fr_200px] items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Tax Rate (%)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={form.watch("taxRate") || 0}
                  onChange={(event) =>
                    form.setValue("taxRate", Number(event.target.value))
                  }
                />
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{totals.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax</span>
                  <span>{totals.taxAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{totals.grandTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                disabled={isPending}
                onClick={form.handleSubmit((values) =>
                  handleCreate(values, "DRAFT")
                )}
              >
                Save Draft
              </Button>
              <Button
                type="button"
                disabled={isPending}
                onClick={form.handleSubmit((values) =>
                  handleCreate(values, "SUBMITTED")
                )}
              >
                Submit to Boss
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proforma Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PI Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {proformaInvoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No proforma invoices yet.
                  </TableCell>
                </TableRow>
              ) : (
                proformaInvoices.map((pi) => (
                  <TableRow key={pi.id}>
                    <TableCell className="font-medium">{pi.piNumber}</TableCell>
                    <TableCell>{pi.vendor.existingVendor.name}</TableCell>
                    <TableCell>
                      <Badge variant={pi.status === "DRAFT" ? "secondary" : "default"}>
                        {pi.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{pi.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(pi.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {pi.status === "DRAFT" ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSubmitPi(pi.id)}
                        >
                          Submit
                        </Button>
                      ) : pi.status === "APPROVED" ? (
                        <>
                          {!pi.convertedToPoId && onConvertToPo && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertToPo(pi.id)}
                              disabled={isPending}
                            >
                              Convert to PO
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleSendPi(pi.id)}
                          >
                            Send to Vendor
                          </Button>
                          {pi.convertedToPoId && (
                            <span className="text-xs text-muted-foreground">Converted</span>
                          )}
                        </>
                      ) : pi.status === "SENT_TO_VENDOR" || pi.status === "ACCEPTED" ? (
                        <>
                          {!pi.convertedToPoId && onConvertToPo && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleConvertToPo(pi.id)}
                              disabled={isPending}
                            >
                              Convert to PO
                            </Button>
                          )}
                          {pi.convertedToPoId && (
                            <span className="text-xs text-muted-foreground">Converted to PO</span>
                          )}
                          {!pi.convertedToPoId && (
                            <span className="text-xs text-muted-foreground">Sent / Accepted</span>
                          )}
                        </>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {pi.status === "SUBMITTED" ? "Awaiting Boss" : pi.status}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
