"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type Vendor = {
  id: string;
  vendorType: string;
  existingVendor: { name: string };
};

type Invoice = {
  id: string;
  invoiceNumber?: string | null;
  status: string;
  documents: { id: string; filePath: string }[];
};

export default function VendorDocumentsPage({
  vendor,
  invoices,
  onUpload,
}: {
  vendor: Vendor | null;
  invoices: Invoice[];
  onUpload: (formData: FormData) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!vendor) {
    return (
      <Card>
        <CardContent className="py-6 text-muted-foreground">
          Vendor profile not found.
        </CardContent>
      </Card>
    );
  }

  if (vendor.vendorType !== "IT") {
    return (
      <Card>
        <CardContent className="py-6 text-muted-foreground">
          Document uploads are available for IT vendors only.
        </CardContent>
      </Card>
    );
  }

  const handleUpload = (formData: FormData) => {
    setMessage(null);
    startTransition(async () => {
      const res = await onUpload(formData);
      if (res?.error) setMessage(res.error);
      else setMessage("Document uploaded.");
    });
  };

  return (
    <div className="space-y-6">
      {message ? (
        <div className="text-sm text-muted-foreground">{message}</div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Upload Supporting Document</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleUpload} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Invoice</label>
              <select
                name="invoiceId"
                className="h-9 rounded-md border bg-transparent px-3 text-sm"
                required
              >
                <option value="">Select invoice</option>
                {invoices.map((invoice) => (
                  <option key={invoice.id} value={invoice.id}>
                    {invoice.invoiceNumber || invoice.id} ({invoice.status})
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Document URL</label>
              <Input name="fileUrl" placeholder="https://..." required />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">File Name</label>
              <Input name="fileName" placeholder="Invoice.pdf" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending}>
                Upload
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Documents</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground">
                    No invoices found.
                  </TableCell>
                </TableRow>
              ) : (
                invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber || invoice.id}
                    </TableCell>
                    <TableCell>
                      <Badge>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {invoice.documents.length === 0
                        ? "No documents"
                        : invoice.documents.length}
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
