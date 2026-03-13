"use client";

import { useState, useTransition } from "react";
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

type ProformaInvoice = {
  id: string;
  piNumber: string;
  status: string;
  grandTotal: number;
  sentToVendorAt?: string | null;
};

export default function VendorProformaInvoicesPage({
  proformaInvoices,
  onAccept,
  onDecline,
}: {
  proformaInvoices: ProformaInvoice[];
  onAccept: (piId: string) => Promise<{ error?: string; success?: boolean }>;
  onDecline: (piId: string, reason: string) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [isPending, startTransition] = useTransition();
  const [reasons, setReasons] = useState<Record<string, string>>({});

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Proforma Invoices</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PI Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {proformaInvoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No proforma invoices pending response.
                </TableCell>
              </TableRow>
            ) : (
              proformaInvoices.map((pi) => (
                <TableRow key={pi.id}>
                  <TableCell className="font-medium">{pi.piNumber}</TableCell>
                  <TableCell>
                    <Badge>{pi.status}</Badge>
                  </TableCell>
                  <TableCell>{pi.grandTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    {pi.sentToVendorAt
                      ? new Date(pi.sentToVendorAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell className="space-y-2">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() => {
                            void onAccept(pi.id);
                          })
                        }
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        disabled={isPending}
                        onClick={() =>
                          startTransition(() => {
                            void onDecline(pi.id, reasons[pi.id] || "");
                          })
                        }
                      >
                        Decline
                      </Button>
                    </div>
                    <Textarea
                      value={reasons[pi.id] || ""}
                      onChange={(event) =>
                        setReasons((prev) => ({
                          ...prev,
                          [pi.id]: event.target.value,
                        }))
                      }
                      placeholder="Decline reason"
                      className="min-h-[70px]"
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
