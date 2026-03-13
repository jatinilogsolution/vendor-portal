"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type PurchaseOrder = {
  id: string;
  poNumber: string;
  status: string;
  grandTotal: number;
  sentToVendorAt?: string | null;
};

export default function VendorPurchaseOrdersPage({
  purchaseOrders,
  onAcknowledge,
}: {
  purchaseOrders: PurchaseOrder[];
  onAcknowledge: (poId: string) => Promise<{ error?: string; success?: boolean }>;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Purchase Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Sent</TableHead>
              <TableHead>Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {purchaseOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No purchase orders pending acknowledgement.
                </TableCell>
              </TableRow>
            ) : (
              purchaseOrders.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>
                    <Badge>{po.status}</Badge>
                  </TableCell>
                  <TableCell>{po.grandTotal.toFixed(2)}</TableCell>
                  <TableCell>
                    {po.sentToVendorAt
                      ? new Date(po.sentToVendorAt).toLocaleDateString()
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="sm"
                      disabled={isPending}
                      onClick={() =>
                        startTransition(() => {
                          void onAcknowledge(po.id);
                        })
                      }
                    >
                      Acknowledge
                    </Button>
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
