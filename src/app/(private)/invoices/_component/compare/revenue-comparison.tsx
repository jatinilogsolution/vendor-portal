"use client"
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export type FinsCosting = {
  charge_code: string;
  allocated_cost: number;
  revenue: number;
  revgl_code: string;
  costgl_code: string;
};

export type LRRequest = {
 id: string;
   LRNumber: string;
   annexureId: string;
   createdAt: string; // ISO string
   updatedAt: string;
   outDate: string; // ISO string
   origin: string;
   destination: string;
   CustomerName: string;
   vehicleNo: string;
   vehicleType: string;
   priceOffered: number;
   priceSettled: number;
   extraCost: number | null;
   lrPrice: number;
   modifiedPrice: number | null;
   podlink: string;
   remark: string;
   status: string;
   tvendorId: string;
   groupId: string;
   isInvoiced: boolean;
    fileNumber: string;
  finsCosting?: FinsCosting[];
};

export type Invoice = {
  LRRequest: LRRequest[];
  subtotal: number;
};

const getVarianceIcon = (variance: number) => {
  if (variance > 0) return <TrendingUp className="h-3 w-3" />;
  if (variance < 0) return <TrendingDown className="h-3 w-3" />;
  return <Minus className="h-3 w-3" />;
};

const getVarianceColor = (variance: number) => {
  if (variance > 0) return "text-green-500";
  if (variance < 0) return "text-destructive";
  return "text-muted-foreground";
};

export const RevenueComparison = ({ invoice }: { invoice: Invoice }) => {
  const lrs = invoice.LRRequest;
const uniqueSettled = Array.from(
  new Map(
    lrs.map(lr => [lr.fileNumber, lr])   // keep last entry per fileno
  ).values()
);

const totalSettled = uniqueSettled.reduce(
  (sum, lr) => sum + ((lr.lrPrice || 0) + (lr.extraCost || 0)),
  0
);
  // Calculate totals
//   const totalSettled = lrs.reduce((sum, lr) => sum + (lr.lrPrice+ lr[0].extraCost || 0), 0);
  const totalRevenue = lrs.reduce((sum, lr) => {
    const finsTotalRevenue = lr.finsCosting?.reduce((s, f) => s + f.revenue, 0) || 0;
    return sum + finsTotalRevenue;
  }, 0);
  const totalVariance = totalSettled - totalRevenue;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="text-xs font-semibold h-10">LR Number</TableHead>
              <TableHead className="text-xs font-semibold h-10">Customer</TableHead>
              <TableHead className="text-xs font-semibold h-10">Route</TableHead>
              <TableHead className="text-xs font-semibold h-10">Vehicle</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">LR Cost</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Total Revenue</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Variance</TableHead>
              <TableHead className="text-xs font-semibold h-10">Breakdown</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {lrs.map((lr) => {
              const finsTotalRevenue = lr.finsCosting?.reduce((sum, f) => sum + f.revenue, 0) || 0;
              const lrVariance = finsTotalRevenue - (lr.priceSettled || 0)  ;

              return (
                <React.Fragment key={lr.id}>
                  <TableRow className="hover:bg-muted/50">
                    <TableCell className="text-sm py-3 font-medium">
                      <Badge variant="outline">{lr.LRNumber}</Badge>
                    </TableCell>
                    <TableCell className="text-sm py-3">{lr.CustomerName}</TableCell>
                    <TableCell className="text-xs py-3 text-muted-foreground">
                      {lr.origin} → {lr.destination}
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      <Badge variant="secondary">{lr.vehicleNo}</Badge>
                    </TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">₹{(lr.lrPrice || 0).toLocaleString()}</TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">₹{finsTotalRevenue.toLocaleString()}</TableCell>
                    <TableCell className={`text-sm py-3 text-right ${getVarianceColor(lrVariance)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {getVarianceIcon(lrVariance)}
                        ₹{Math.abs(lrVariance).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs py-3">
                      {lr.finsCosting && lr.finsCosting.length > 0 ? (
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {lr.finsCosting.length} item{lr.finsCosting.length > 1 ? 's' : ''}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  </TableRow>

                  {/* Revenue Breakdown Rows */}
                  {lr.finsCosting && lr.finsCosting.length > 0 && (
                    <>
                      {lr.finsCosting.map((fins, idx) => (
                        <TableRow key={`${lr.id}-fins-${idx}`} className="bg-muted/20 hover:bg-muted/30">
                          <TableCell colSpan={3} className="text-xs py-2 pl-12 text-muted-foreground">
                            {fins.charge_code}
                          </TableCell>
                          <TableCell className="text-xs py-2"></TableCell>
                          <TableCell className="text-xs py-2 text-right">Cost Code: {fins.costgl_code}</TableCell>
                          <TableCell className="text-xs py-2 text-right font-semibold text-green-600">₹{fins.revenue.toLocaleString()}</TableCell>
                          <TableCell className="text-xs py-2 text-right text-muted-foreground">Rev Code: {fins.revgl_code}</TableCell>
                          <TableCell className="text-xs py-2"></TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })}

            {/* Totals Row */}
            <TableRow className="bg-muted/70 font-bold hover:bg-muted/70 border-t-2">
              <TableCell colSpan={4} className="text-sm py-4">TOTAL ({lrs.length} LRs)</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalSettled.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalRevenue.toLocaleString()}</TableCell>
              <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance)}`}>
                <div className="flex items-center justify-end gap-1">
                  {getVarianceIcon(totalVariance)}
                  ₹{Math.abs(totalVariance).toLocaleString()}
                </div>
              </TableCell>
              <TableCell className="text-sm py-4"></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
