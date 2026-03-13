"use client";

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

type Invoice = {
  id: string;
  invoiceNumber?: string | null;
  status: string;
  totalAmount: number;
  payments: {
    id: string;
    status: string;
    paymentDate?: string | null;
    transactionRef?: string | null;
    amount: number;
  }[];
};

export default function VendorPaymentsPage({ invoices }: { invoices: Invoice[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Status</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Paid On</TableHead>
              <TableHead>Reference</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No payment records yet.
                </TableCell>
              </TableRow>
            ) : (
              invoices.map((invoice) => {
                const payment = invoice.payments?.[0];
                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">
                      {invoice.invoiceNumber || invoice.id}
                    </TableCell>
                    <TableCell>
                      <Badge>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{invoice.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      {payment ? <Badge>{payment.status}</Badge> : "—"}
                    </TableCell>
                    <TableCell>
                      {payment?.paymentDate
                        ? new Date(payment.paymentDate).toLocaleDateString()
                        : "—"}
                    </TableCell>
                    <TableCell>{payment?.transactionRef || "—"}</TableCell>
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
