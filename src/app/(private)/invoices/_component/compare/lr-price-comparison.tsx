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

export type LRRequest = {
  id: string;
  LRNumber: string;
  priceOffered: number;
  priceSettled: number;
  lrPrice: number;
  modifiedPrice: number | null;
  CustomerName: string;
  origin: string;
  destination: string;
  outDate: string;
  fileNumber: string;
};

export type Invoice = {
  LRRequest: LRRequest[];
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

export const LRPriceComparison = ({ invoice }: { invoice: Invoice }) => {
  const lrs = invoice.LRRequest;

  // Calculate totals
  const totalOffered = lrs.reduce((sum, lr) => sum + (lr.priceOffered || 0), 0);
  const totalSettled = lrs.reduce((sum, lr) => sum + (lr.priceSettled || 0), 0);
  const totalLRPrice = lrs.reduce((sum, lr) => sum + (lr.lrPrice || 0), 0);
  const totalModified = lrs.reduce((sum, lr) => sum + (lr.modifiedPrice || 0), 0);

  const totalVariance1 = totalOffered - totalSettled;
  const totalVariance2 = totalSettled - totalLRPrice;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="text-xs font-semibold h-10">LR Number</TableHead>
              <TableHead className="text-xs font-semibold h-10">Customer</TableHead>
              <TableHead className="text-xs font-semibold h-10">Route</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Price Offered</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Price Settled</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Variance 1</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">LR Price</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Variance 2</TableHead>
              {totalModified > 0 && (
                <TableHead className="text-xs font-semibold h-10 text-right">Modified Price</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {lrs.map((lr) => {
              const variance1 = (lr.priceOffered || 0) - (lr.priceSettled || 0);
              const variance2 = (lr.priceSettled || 0) - (lr.lrPrice || 0);

              return (
                <TableRow key={lr.id} className="hover:bg-muted/50">
                  <TableCell className="text-sm py-3 font-medium">
                    <Badge variant="outline">{lr.LRNumber}</Badge>
                  </TableCell>
                  <TableCell className="text-sm py-3">{lr.CustomerName}</TableCell>
                  <TableCell className="text-xs py-3 text-muted-foreground">
                    {lr.origin} → {lr.destination}
                  </TableCell>
                  <TableCell className="text-sm py-3 text-right font-semibold">₹{(lr.priceOffered || 0).toLocaleString()}</TableCell>
                  <TableCell className="text-sm py-3 text-right font-semibold">₹{(lr.priceSettled || 0).toLocaleString()}</TableCell>
                  <TableCell className={`text-sm py-3 text-right ${getVarianceColor(variance1)}`}>
                    <div className="flex items-center justify-end gap-1">
                      {getVarianceIcon(variance1)}
                      ₹{Math.abs(variance1).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm py-3 text-right font-semibold">₹{(lr.lrPrice || 0).toLocaleString()}</TableCell>
                  <TableCell className={`text-sm py-3 text-right ${getVarianceColor(variance2)}`}>
                    <div className="flex items-center justify-end gap-1">
                      {getVarianceIcon(variance2)}
                      ₹{Math.abs(variance2).toLocaleString()}
                    </div>
                  </TableCell>
                  {totalModified > 0 && (
                    <TableCell className="text-sm py-3 text-right">
                      {lr.modifiedPrice ? `₹${lr.modifiedPrice.toLocaleString()}` : '-'}
                    </TableCell>
                  )}
                </TableRow>
              );
            })}

            {/* Totals Row */}
            <TableRow className="bg-muted/70 font-bold hover:bg-muted/70 border-t-2">
              <TableCell colSpan={3} className="text-sm py-4">TOTAL ({lrs.length} LRs)</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalOffered.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalSettled.toLocaleString()}</TableCell>
              <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance1)}`}>
                <div className="flex items-center justify-end gap-1">
                  {getVarianceIcon(totalVariance1)}
                  ₹{Math.abs(totalVariance1).toLocaleString()}
                </div>
              </TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalLRPrice.toLocaleString()}</TableCell>
              <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance2)}`}>
                <div className="flex items-center justify-end gap-1">
                  {getVarianceIcon(totalVariance2)}
                  ₹{Math.abs(totalVariance2).toLocaleString()}
                </div>
              </TableCell>
              {totalModified > 0 && (
                <TableCell className="text-sm py-4 text-right">₹{totalModified.toLocaleString()}</TableCell>
              )}
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
