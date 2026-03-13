"use client";

import { useCallback, useMemo, useState, useTransition } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Loader2 } from "lucide-react";
import { getPosAndPisForVendor } from "../../_actions/invoices";

type Vendor = {
  id: string;
  existingVendor: { name: string };
};

type Invoice = {
  id: string;
  invoiceNumber: string | null;
  status: string;
  type: string;
  totalAmount: number;
  createdAt: string;
  submittedAt: string | null;
  vendor: { existingVendor: { name: string } };
  purchaseOrder: { poNumber: string } | null;
  proformaInvoice: { piNumber: string } | null;
  createdBy: { name: string | null };
};

type DigitalLineItem = {
  description: string;
  qty: number;
  unitPrice: number;
};

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SUBMITTED: "default",
  UNDER_REVIEW: "default",
  APPROVED: "default",
  REJECTED: "destructive",
  REVISION_REQUESTED: "outline",
  PAYMENT_INITIATED: "default",
  PAYMENT_CONFIRMED: "default",
};

export default function AdminInvoicesPage({
  vendors,
  invoices,
  onCreateInvoice,
}: {
  vendors: Vendor[];
  invoices: Invoice[];
  onCreateInvoice: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [selectedVendorId, setSelectedVendorId] = useState<string>("");
  const [pos, setPos] = useState<{ id: string; poNumber: string; status: string }[]>([]);
  const [pis, setPis] = useState<{ id: string; piNumber: string; status: string }[]>([]);
  const [loadingPosPis, setLoadingPosPis] = useState(false);

  const loadPosAndPis = useCallback((vendorId: string) => {
    if (!vendorId || vendorId === "__none__") {
      setPos([]);
      setPis([]);
      return;
    }
    setLoadingPosPis(true);
    getPosAndPisForVendor(vendorId)
      .then(({ purchaseOrders, proformaInvoices }) => {
        setPos(purchaseOrders);
        setPis(proformaInvoices);
      })
      .finally(() => setLoadingPosPis(false));
  }, []);

  const digitalForm = useForm<{
    vendorId: string;
    type: "PDF" | "DIGITAL";
    invoiceNumber: string;
    poId: string;
    piId: string;
    taxRate: number;
    notes: string;
    fileUrl: string;
    subtotal: string;
    items: DigitalLineItem[];
  }>({
    defaultValues: {
      vendorId: "__none__",
      type: "DIGITAL",
      invoiceNumber: "",
      poId: "__none__",
      piId: "__none__",
      taxRate: 0,
      notes: "",
      fileUrl: "",
      subtotal: "",
      items: [{ description: "", qty: 1, unitPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: digitalForm.control,
    name: "items",
  });

  const watchType = digitalForm.watch("type");
  const watchVendorId = digitalForm.watch("vendorId");
  const watchItems = digitalForm.watch("items");
  const watchTaxRate = digitalForm.watch("taxRate");

  const digitalTotals = useMemo(() => {
    const subtotal = watchItems.reduce((acc, item) => {
      const total = Number(item.qty || 0) * Number(item.unitPrice || 0);
      return acc + total;
    }, 0);
    const taxAmount = (subtotal * Number(watchTaxRate || 0)) / 100;
    const totalAmount = subtotal + taxAmount;
    return { subtotal, taxAmount, totalAmount };
  }, [watchItems, watchTaxRate]);

  const onVendorChange = (value: string) => {
    setSelectedVendorId(value);
    digitalForm.setValue("poId", "__none__");
    digitalForm.setValue("piId", "__none__");
    loadPosAndPis(value);
  };

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setErrorMessage(null);
      digitalForm.reset({
        vendorId: "__none__",
        type: "DIGITAL",
        invoiceNumber: "",
        poId: "__none__",
        piId: "__none__",
        taxRate: 0,
        notes: "",
        fileUrl: "",
        subtotal: "",
        items: [{ description: "", qty: 1, unitPrice: 0 }],
      });
      setPos([]);
      setPis([]);
      setSelectedVendorId("");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const values = digitalForm.getValues();

    formData.set("vendorId", values.vendorId === "__none__" ? "" : values.vendorId);
    formData.set("type", values.type);
    formData.set("poId", values.poId === "__none__" ? "" : values.poId);
    formData.set("piId", values.piId === "__none__" ? "" : values.piId);
    formData.set("invoiceNumber", values.invoiceNumber || "");
    formData.set("notes", values.notes || "");
    formData.set("taxRate", String(values.taxRate ?? 0));

    if (watchType === "PDF") {
      formData.set("fileUrl", values.fileUrl || "");
      formData.set("subtotal", values.subtotal || "0");
    } else {
      const items = values.items.filter((i) => i.description && i.qty > 0 && i.unitPrice >= 0);
      formData.set("lineItems", JSON.stringify(items));
    }

    startTransition(async () => {
      const res = await onCreateInvoice(formData);
      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.success) {
        handleOpenChange(false);
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle>All Invoices</CardTitle>
          <Sheet open={open} onOpenChange={handleOpenChange}>
            <SheetTrigger asChild>
              <Button size="sm">
                <Plus className="size-4" />
                Create invoice
              </Button>
            </SheetTrigger>
            <SheetContent className="flex flex-col overflow-y-auto sm:max-w-lg">
              <SheetHeader>
                <SheetTitle>Create invoice for vendor</SheetTitle>
                <SheetDescription>
                  Assign an invoice to a vendor. Optionally link to a PO or PI.
                </SheetDescription>
              </SheetHeader>

              <form
                id="admin-create-invoice"
                onSubmit={handleSubmit}
                className="flex flex-1 flex-col gap-6 py-6"
              >
                <input type="hidden" name="type" value={watchType} />
                <input type="hidden" name="vendorId" value={watchVendorId === "__none__" ? "" : watchVendorId} />

                <div className="space-y-2">
                  <Label>Vendor</Label>
                  <Select
                    value={watchVendorId}
                    onValueChange={(v) => {
                      digitalForm.setValue("vendorId", v);
                      onVendorChange(v);
                    }}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vendor" />
                    </SelectTrigger>
                    <SelectContent>
                      {vendors.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.existingVendor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Link to (optional)</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Select
                      value={digitalForm.watch("poId")}
                      onValueChange={(v) => {
                        digitalForm.setValue("poId", v);
                        if (v !== "__none__") digitalForm.setValue("piId", "__none__");
                      }}
                      disabled={!selectedVendorId || loadingPosPis}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="PO" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {pos.map((po) => (
                          <SelectItem key={po.id} value={po.id}>
                            {po.poNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={digitalForm.watch("piId")}
                      onValueChange={(v) => {
                        digitalForm.setValue("piId", v);
                        if (v !== "__none__") digitalForm.setValue("poId", "__none__");
                      }}
                      disabled={!selectedVendorId || loadingPosPis}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="PI" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__none__">None</SelectItem>
                        {pis.map((pi) => (
                          <SelectItem key={pi.id} value={pi.id}>
                            {pi.piNumber}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Invoice number (optional)</Label>
                  <Input
                    placeholder="INV-001"
                    className="bg-background"
                    {...digitalForm.register("invoiceNumber")}
                  />
                </div>

                <Tabs
                  value={watchType}
                  onValueChange={(v) => {
                    digitalForm.setValue("type", v as "PDF" | "DIGITAL");
                  }}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="DIGITAL">Digital</TabsTrigger>
                    <TabsTrigger value="PDF">PDF</TabsTrigger>
                  </TabsList>
                  <TabsContent value="PDF" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>File URL</Label>
                      <Input
                        placeholder="https://..."
                        required={watchType === "PDF"}
                        className="bg-background"
                        {...digitalForm.register("fileUrl")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Subtotal</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        required={watchType === "PDF"}
                        className="bg-background"
                        {...digitalForm.register("subtotal")}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="DIGITAL" className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <Label>Line items</Label>
                      <div className="space-y-2 rounded-lg border border-border p-3">
                        {fields.map((field, idx) => (
                          <div key={field.id} className="grid grid-cols-12 gap-2">
                            <Input
                              placeholder="Description"
                              className="col-span-6 bg-background"
                              {...digitalForm.register(`items.${idx}.description`)}
                            />
                            <Input
                              type="number"
                              min={0}
                              placeholder="Qty"
                              className="col-span-2 bg-background"
                              {...digitalForm.register(`items.${idx}.qty`, { valueAsNumber: true })}
                            />
                            <Input
                              type="number"
                              min={0}
                              step="0.01"
                              placeholder="Unit price"
                              className="col-span-3 bg-background"
                              {...digitalForm.register(`items.${idx}.unitPrice`, { valueAsNumber: true })}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="col-span-1"
                              onClick={() => remove(idx)}
                              disabled={fields.length <= 1}
                            >
                              ×
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => append({ description: "", qty: 1, unitPrice: 0 })}
                        >
                          Add line
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Subtotal: {digitalTotals.subtotal.toFixed(2)} | Tax (
                        {watchTaxRate}%): {digitalTotals.taxAmount.toFixed(2)} | Total:{" "}
                        {digitalTotals.totalAmount.toFixed(2)}
                      </p>
                    </div>
                  </TabsContent>
                </Tabs>

                <div className="space-y-2">
                  <Label>Tax rate (%)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    className="bg-background"
                    {...digitalForm.register("taxRate", { valueAsNumber: true })}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Notes"
                    className="min-h-[80px] resize-y bg-background"
                    {...digitalForm.register("notes")}
                  />
                </div>

                {errorMessage && (
                  <p className="text-sm text-destructive">{errorMessage}</p>
                )}
              </form>

              <SheetFooter>
                <Button
                  type="submit"
                  form="admin-create-invoice"
                  disabled={isPending || !watchVendorId || watchVendorId === "__none__"}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create invoice"
                  )}
                </Button>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              No invoices yet. Create one to assign to a vendor.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Created</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">
                      {inv.vendor.existingVendor.name}
                    </TableCell>
                    <TableCell>{inv.invoiceNumber || "—"}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[inv.status] ?? "secondary"}>
                        {inv.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{inv.type}</TableCell>
                    <TableCell className="text-right">
                      {Number(inv.totalAmount).toFixed(2)}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {inv.createdAt ? new Date(inv.createdAt).toLocaleDateString() : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
