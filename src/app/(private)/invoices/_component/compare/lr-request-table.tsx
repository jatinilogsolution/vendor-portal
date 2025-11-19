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
import { ArrowRight, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from "lucide-react";
import { IconChevronDownRight } from '@tabler/icons-react';
import { IconChevronUpLeft } from '@tabler/icons-react';
import { Button } from '@/components/ui/button';

export type FinsCosting = {
  charge_code: string;
  allocated_cost: number;
  revenue: number;
  revgl_code: string;
  costgl_code: string;
  LR_No: string;
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
  finsCosting?: FinsCosting[]; // optional in case empty
  fileNumber: string;
};

export type Vendor = {
  id: string;
  name: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceURI: string;
  billTo: string;
  billToGstin: string;
  billToId: string;
  grandTotal: number;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  totalExtra: number;
  hasDiscrepancy: boolean;
  discrepancyNotes?: string | null;
  poId?: string | null;
  refernceNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  vendor: Vendor;
  LRRequest: LRRequest[];
};

export const LRRequestsTable = ({ requests }: { requests: Invoice }) => {
  const [expandedFiles, setExpandedFiles] = React.useState<Set<string>>(new Set());
  const [expandedLRs, setExpandedLRs] = React.useState<Set<string>>(new Set());


  // Group LR requests by fileNumber and compute aggregates properly
  const groupedByFile = React.useMemo(() => {
    const grouped = new Map<string, LRRequest[]>();

    requests?.LRRequest.forEach(lr => {
      if (!grouped.has(lr.fileNumber)) grouped.set(lr.fileNumber, []);
      grouped.get(lr.fileNumber)!.push(lr);
    });
    return Array.from(grouped.entries()).map(([fileNumber, lrs]) => {
      const lrCount = lrs.length;
      const awlOffered = lrs[0].priceOffered 
      const vendorSettled = lrs[0].priceSettled // vendor price (original scheme)
      const lrPriceTotal = lrs.reduce((s, x) => s + (x.lrPrice || 0), 0); // sum of lrPrice for this file (your "settle" definition)
      const extraCost = lrs.reduce((s, x) => s + (x.extraCost || 0), 0);
      const fileRevenue = lrs.reduce(
        (sum, lr) =>
          sum +
          (lr.finsCosting?.reduce((a, f) => a + (f.revenue || 0), 0) || 0),
        0
      );
      return {
        fileNumber,
        lrs,
        lrCount,
        awlOffered,
        vendorSettled,
        lrPriceTotal,
        extraCost,
        fileRevenue
      };
    });
  }, [requests?.LRRequest]);

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

  const toggleFile = (fileNumber: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileNumber)) next.delete(fileNumber);
      else next.add(fileNumber);
      return next;
    });
  };

  const toggleLR = (lrId: string) => {
    setExpandedLRs(prev => {
      const next = new Set(prev);
      if (next.has(lrId)) next.delete(lrId);
      else next.add(lrId);
      return next;
    });
  };

  // Totals
  const invoiceSubtotal = requests?.subtotal || 0;
  const invoiceTaxAmount = requests?.taxAmount || 0;
  const invoiceTotalExtra = requests?.totalExtra || 0;

  const totalOffered = groupedByFile.reduce((sum, g) => sum + g.awlOffered, 0);
  const totalVendorSettled = groupedByFile.reduce((sum, g) => sum + g.vendorSettled, 0);
  const totalLrPrice = groupedByFile.reduce((sum, g) => sum + g.lrPriceTotal, 0);
  const totalExtra = groupedByFile.reduce((sum, g) => sum + (g.extraCost || 0), 0);
  // overall variance: AWL offered - LR Price Total - invoice tax - extras
  const totalVariance = totalOffered - totalLrPrice - invoiceTaxAmount - totalExtra;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="text-xs font-semibold h-10 w-12"></TableHead>
              <TableHead className="text-xs font-semibold h-10">File No.</TableHead>
              <TableHead className="text-xs font-semibold h-10">LR Count</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">PRQ Cost</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Vendor Cost</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">LR Price (Sum)</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Revenue (Sum)</TableHead>

              <TableHead className="text-xs font-semibold h-10 text-right">Extra</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByFile.map((group) => {
              const isExpanded = expandedFiles.has(group.fileNumber);
              const fileTaxShare = totalLrPrice ? (group.lrPriceTotal / totalLrPrice) * invoiceTaxAmount : 0;
              const fileVariance = group.awlOffered - group.lrPriceTotal - fileTaxShare - (group.extraCost || 0);

              return (
                <React.Fragment key={group.fileNumber}>
                  {/* File Row */}
                  <TableRow className="hover:bg-muted/50 cursor-pointer font-medium bg-muted/30" onClick={() => toggleFile(group.fileNumber)}>
                    <TableCell className="py-3">{isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}</TableCell>
                    <TableCell className="text-sm py-3 space-x-4">
                      <Badge variant="outline" className="font-semibold">{group.fileNumber}</Badge>
                      <Badge variant={"secondary"} className="border border-primary">{group.lrs[0].vehicleNo} - {group.lrs[0].vehicleType}</Badge>
                    </TableCell>
                    <TableCell className="text-sm py-3"><Badge variant="secondary">{group.lrCount} LR{group.lrCount > 1 ? 's' : ''}</Badge></TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">₹{group?.awlOffered}</TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">₹{group.vendorSettled.toLocaleString()}</TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">₹{group.lrPriceTotal.toLocaleString()}</TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">₹{group.fileRevenue.toLocaleString()}</TableCell>

                    <TableCell className="text-sm py-3 text-right">{group.extraCost ? <span className="font-semibold text-orange-600">₹{group.extraCost.toLocaleString()}</span> : '-'}</TableCell>
                    <TableCell className={`text-sm py-3 text-right ${getVarianceColor(fileVariance)}`}>
                      <div className="flex items-center justify-end gap-1">
                        {getVarianceIcon(fileVariance)} ₹{Math.abs(fileVariance).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded LR Rows with Revenue Variance and breakdown */}
                  {isExpanded && group.lrs.map((lr, index) => {
                    // Revenue for this LR: sum of finsCosting.revenue for this LR
                    const finsTotalRevenue = lr.finsCosting?.reduce((sum, f) => sum + (f.revenue || 0), 0) || 0;
                    // variance: LR Price (lr.lrPrice) - revenue from fins (as you described)
                    const lrVariance = finsTotalRevenue - (lr.lrPrice || 0);
                    const finsAllocatedCost = lr.finsCosting?.reduce((sum, f) => sum + (f.allocated_cost || 0), 0) || 0;
                    return (
                      <React.Fragment key={lr.id}>
                        <TableRow className="hover:bg-muted/20 bg-background">
                          <TableCell className="py-2"></TableCell>
                          <TableCell className="text-xs py-2 pl-8">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">#{index + 1}</span>
                              <div>
                                <div className="font-medium">{lr.LRNumber}</div>
                                <div className="text-muted-foreground text-[10px]">{new Date(lr.outDate).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="text-xs py-2">{lr.CustomerName}</TableCell>

                          {/* <TableCell className="text-xs py-2">AWL: ₹{(lr.priceOffered || 0).toLocaleString()}</TableCell> */}

                          {/* <TableCell className="text-xs py-2">Vendor: ₹{(lr.priceSettled || 0).toLocaleString()}</TableCell> */}

                          <TableCell className="text-xs py-2">LR Price: ₹{(lr.lrPrice || 0).toLocaleString()}</TableCell>
                          <TableCell className="text-xs py-2">Allocated: ₹{finsAllocatedCost.toLocaleString()}</TableCell>
                          <TableCell className="text-xs py-2">Revenue: ₹{finsTotalRevenue.toLocaleString()}</TableCell>

                          <TableCell className={`text-xs py-2 ${getVarianceColor(lrVariance)}`}>
                            <div className="flex items-center gap-1">
                              {getVarianceIcon(lrVariance)}
                              ₹{Math.abs(lrVariance).toLocaleString()}
                            </div>
                          </TableCell>
                          <TableRow className=" h-full bg-background/80 flex items-center justify-center">

                            <Button
                              variant={"secondary"}

                              className=" text-primary-foreground  mt-1 w-full text-right"
                              onClick={(e) => { e.stopPropagation(); toggleLR(lr.id); }}
                            >
                              {expandedLRs.has(lr.id) ? "Hide" : "View"}
                            </Button>

                          </TableRow>

                        </TableRow>

                        {/* Fins Costing Breakdown - collapsible per LR */}
                        {expandedLRs.has(lr.id) && lr.finsCosting && lr.finsCosting.length > 0 && (
                          <TableRow className="bg-surface/60 hover:bg-none">
                            <TableCell></TableCell>
                            <TableCell colSpan={6} className="py-2 px-8" >
                              <div className="text-xs font-semibold mb-2">Fins Costing Breakdown</div>

                              <div className="overflow-x-auto border rounded-md">
                                <table className="min-w-full text-xs">
                                  <thead>
                                    <tr className="text-left text-primary-foreground bg-muted/80 border-b">
                                      <th className="px-3 py-2 w-28">Charge Code</th>
                                      <th className="px-3 py-2 w-32">Allocated Cost</th>
                                      <th className="px-3 py-2 w-28">Revenue</th>
                                      <th className="px-3 py-2 w-20">Rev GL</th>
                                      <th className="px-3 py-2 w-20">Cost GL</th>
                                      <th className="px-3 py-2 w-24">LR No.</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {lr.finsCosting.map((f, i) => (
                                      <tr key={i} className="border-b hover:bg-muted/40 transition">
                                        <td className="px-3 py-2 text-primary-foreground/70">{f.charge_code}</td>
                                        <td className="px-3 py-2">
                                          ₹{(f.allocated_cost || 0).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2">
                                          ₹{(f.revenue || 0).toLocaleString()}
                                        </td>
                                        <td className="px-3 py-2">{f.revgl_code}</td>
                                        <td className="px-3 py-2">{f.costgl_code}</td>
                                        <td className="px-3 py-2">{f.LR_No}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>

                            </TableCell>
                          </TableRow>
                        )}

                        {/* Row with action to toggle fins detail */}

                      </React.Fragment>
                    );
                  })}
                </React.Fragment>
              );
            })}

            {/* Totals Row */}
            <TableRow className="bg-muted/70 font-bold hover:bg-muted/70 border-t-2">
              <TableCell colSpan={3} className="text-sm py-4">
                TOTALS ({groupedByFile.length} Files, {requests?.LRRequest.length} LRs)
              </TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalOffered.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalVendorSettled.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalLrPrice.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalExtra.toLocaleString()}</TableCell>
              <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance)}`}>
                <div className="flex items-center justify-end gap-1">
                  {getVarianceIcon(totalVariance)} ₹{Math.abs(totalVariance).toLocaleString()}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
