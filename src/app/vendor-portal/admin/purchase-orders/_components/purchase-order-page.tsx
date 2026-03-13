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

type PurchaseOrder = {
  id: string;
  poNumber: string;
  status: string;
  grandTotal: number;
  taxRate: number;
  createdAt: string;
  vendor: { existingVendor: { name: string } };
};

type PoFormValues = {
  vendorId: string;
  categoryId?: string;
  deliveryDate?: string;
  deliveryAddress?: string;
  notes?: string;
  taxRate?: number;
  items: {
    itemId?: string;
    description: string;
    qty: number;
    unitPrice: number;
  }[];
};

export default function PurchaseOrderPage({
  vendors,
  categories,
  items,
  purchaseOrders,
  onCreate,
  onSubmit,
  onSendToVendor,
}: {
  vendors: VpVendor[];
  categories: Category[];
  items: Item[];
  purchaseOrders: PurchaseOrder[];
  onCreate: (payload: any) => Promise<{ error?: string; success?: boolean }>;
  onSubmit: (poId: string) => Promise<{ error?: string; success?: boolean }>;
  onSendToVendor: (poId: string) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<PoFormValues>({
    defaultValues: {
      vendorId: "",
      categoryId: "__none__",
      deliveryDate: "",
      deliveryAddress: "",
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

  const handleCreate = (values: PoFormValues, status: "DRAFT" | "SUBMITTED") => {
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
        setStatusMessage("Purchase order saved.");
        form.reset();
      }
    });
  };

  const handleSubmitPo = (poId: string) => {
    startTransition(async () => {
      const res = await onSubmit(poId);
      if (res?.error) setStatusMessage(res.error);
      else setStatusMessage("Purchase order submitted to boss.");
    });
  };

  const handleSendPo = (poId: string) => {
    startTransition(async () => {
      const res = await onSendToVendor(poId);
      if (res?.error) setStatusMessage(res.error);
      else setStatusMessage("PO sent to vendor.");
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create Purchase Order</CardTitle>
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
                <label className="text-sm font-medium">Delivery Date</label>
                <Input
                  type="date"
                  value={form.watch("deliveryDate") || ""}
                  onChange={(event) =>
                    form.setValue("deliveryDate", event.target.value)
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Delivery Address</label>
                <Input
                  value={form.watch("deliveryAddress") || ""}
                  onChange={(event) =>
                    form.setValue("deliveryAddress", event.target.value)
                  }
                  placeholder="Delivery address"
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
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {purchaseOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    No purchase orders yet.
                  </TableCell>
                </TableRow>
              ) : (
                purchaseOrders.map((po) => (
                  <TableRow key={po.id}>
                    <TableCell className="font-medium">{po.poNumber}</TableCell>
                    <TableCell>{po.vendor.existingVendor.name}</TableCell>
                    <TableCell>
                      <Badge variant={po.status === "DRAFT" ? "secondary" : "default"}>
                        {po.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{po.grandTotal.toFixed(2)}</TableCell>
                    <TableCell>
                      {new Date(po.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {po.status === "DRAFT" ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSubmitPo(po.id)}
                        >
                          Submit
                        </Button>
                      ) : po.status === "APPROVED" ? (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleSendPo(po.id)}
                        >
                          Send to Vendor
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {po.status === "SUBMITTED"
                            ? "Awaiting Boss"
                            : po.status === "SENT_TO_VENDOR"
                            ? "Sent to Vendor"
                            : po.status}
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
