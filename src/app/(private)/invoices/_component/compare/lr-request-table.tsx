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
import { Prisma } from "@/generated/prisma";

type DataType = Prisma.InvoiceGetPayload<{
  include: {
    LRRequest: true
    vendor: true
  }
}>

export const LRRequestsTable = ({ requests }: { requests: DataType }) => {
  const [expandedFiles, setExpandedFiles] = React.useState<Set<string>>(new Set());

  // Group LR requests by fileNumber
  const groupedByFile = React.useMemo(() => {
    const grouped = new Map<string, typeof requests.LRRequest>();
    
    requests.LRRequest.forEach(lr => {
      if (!grouped.has(lr.fileNumber)) {
        grouped.set(lr.fileNumber, []);
      }
      grouped.get(lr.fileNumber)!.push(lr);
    });

    return Array.from(grouped.entries()).map(([fileNumber, lrs]) => {
      // For each file, use the price from the FIRST LR (since all LRs in same file share same pricing)
      const firstLr = lrs[0];
      
      return {
        fileNumber,
        lrs,
        lrCount: lrs.length,
        // Pricing is per file, not per LR
        priceOffered: firstLr.priceOffered || 0,
        priceSettled: firstLr.priceSettled || 0,
        extraCost: firstLr.extraCost || 0,
      };
    });
  }, [requests.LRRequest]);

  // Calculate variance: Offered - Settled - Tax (proportional) - Extra
  const calculateFileVariance = (offered: number, settled: number, extra: number, taxAmount: number, fileCount: number, totalFiles: number) => {
    // Distribute tax proportionally across files based on their settled amount
    const totalSettled = groupedByFile.reduce((sum, g) => sum + g.priceSettled, 0);
    const fileTaxShare = totalSettled > 0 ? (settled / totalSettled) * taxAmount : 0;
    
    return offered - settled - fileTaxShare - extra;
  };

  const getVarianceIcon = (variance: number) => {
    if (variance > 0) return <TrendingUp className="h-3 w-3" />;
    if (variance < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getVarianceColor = (variance: number) => {
    if (variance > 0) return "text-green-500"; // Positive variance = saved money
    if (variance < 0) return "text-destructive"; // Negative variance = overspent
    return "text-muted-foreground";
  };

  const toggleFile = (fileNumber: string) => {
    setExpandedFiles(prev => {
      const next = new Set(prev);
      if (next.has(fileNumber)) {
        next.delete(fileNumber);
      } else {
        next.add(fileNumber);
      }
      return next;
    });
  };

  // Calculate invoice totals
  const invoiceSubtotal = requests.subtotal;
  const invoiceTaxAmount = requests.taxAmount;
  const invoiceTotalExtra = requests.totalExtra;
  const invoiceGrandTotal = requests.grandTotal;
  
  // Calculate total offered and settled across all FILES (not LRs)
  const totalOffered = groupedByFile.reduce((sum, group) => sum + group.priceOffered, 0);
  const totalSettled = groupedByFile.reduce((sum, group) => sum + group.priceSettled, 0);
  const totalExtra = groupedByFile.reduce((sum, group) => sum + group.extraCost, 0);
  
  // Calculate total variance: Offered - Settled - Tax - Extra
  const totalVariance = totalOffered - totalSettled - invoiceTaxAmount - totalExtra;

  return (
    <div className="space-y-4">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Total Offered</p>
          <p className="text-xl font-bold">₹{totalOffered.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{groupedByFile.length} files</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Subtotal (Settled)</p>
          <p className="text-xl font-bold">₹{totalSettled.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">{requests.LRRequest.length} LRs total</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Tax ({requests.taxRate}%)</p>
          <p className="text-xl font-bold text-blue-600">₹{invoiceTaxAmount.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">On subtotal</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Extra Costs</p>
          <p className="text-xl font-bold text-orange-600">₹{totalExtra.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground mt-1">Additional charges</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-xs text-muted-foreground mb-1 font-medium">Total Variance</p>
          <p className={`text-xl font-bold flex items-center gap-1 ${getVarianceColor(totalVariance)}`}>
            {getVarianceIcon(totalVariance)}
            ₹{Math.abs(totalVariance).toLocaleString()}
          </p>
          <p className="text-[10px] text-muted-foreground mt-1">
            {totalVariance > 0 ? 'Saved' : 'Overspent'}
          </p>
        </div>
      </div>

      {/* Grand Total Card */}
      <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-primary/80 font-medium mb-1">Invoice Grand Total</p>
            <p className="text-3xl font-bold text-primary">₹{invoiceGrandTotal.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-2">Calculation</p>
            <p className="text-sm font-mono">
              ₹{totalSettled} + ₹{invoiceTaxAmount} + ₹{totalExtra}
            </p>
          </div>
        </div>
      </div>

      {/* Grouped LR Requests Table */}
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="text-xs font-semibold h-10 w-12"></TableHead>
              <TableHead className="text-xs font-semibold h-10">File No.</TableHead>
              <TableHead className="text-xs font-semibold h-10">LR Count</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">AWL Cost</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Vendor Cost</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Extra</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByFile.map((group) => {
              const isExpanded = expandedFiles.has(group.fileNumber);
              
              // Calculate this file's share of tax
              const fileTaxShare = totalSettled > 0 
                ? (group.priceSettled / totalSettled) * invoiceTaxAmount 
                : 0;
              
              const fileVariance = group.priceOffered - group.priceSettled - fileTaxShare - group.extraCost;

              return (
                <React.Fragment key={group.fileNumber}>
                  {/* File Group Row */}
                  <TableRow 
                    className="hover:bg-muted/50 cursor-pointer font-medium bg-muted/30"
                    onClick={() => toggleFile(group.fileNumber)}
                  >
                    <TableCell className="py-3">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      <Badge variant="outline" className="font-semibold">
                        {group.fileNumber}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm py-3">
                      <Badge variant="secondary">{group.lrCount} LR{group.lrCount > 1 ? 's' : ''}</Badge>
                    </TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">
                      ₹{group.priceOffered.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm py-3 text-right font-semibold">
                      ₹{group.priceSettled.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm py-3 text-right">
                      {group.extraCost > 0 ? (
                        <span className="font-semibold text-orange-600">
                          ₹{group.extraCost.toLocaleString()}
                        </span>
                      ) : (
                        "-"
                      )}
                    </TableCell>
                    <TableCell className="text-sm py-3 text-right">
                      <div className={`flex items-center justify-end gap-1 font-semibold ${getVarianceColor(fileVariance)}`}>
                        {getVarianceIcon(fileVariance)}
                        ₹{Math.abs(fileVariance).toLocaleString()}
                      </div>
                    </TableCell>
                  </TableRow>

                  {/* Expanded LR Details */}
                  {isExpanded && (
                    <>
                      {/* <TableRow className="bg-muted/10">
                        <TableCell colSpan={7} className="py-2 px-4">
                          <div className="text-xs text-muted-foreground">
                            <strong>Note:</strong> Price shown is for the entire file ({group.lrCount} LR{group.lrCount > 1 ? 's' : ''}), not per individual LR.
                          </div>
                        </TableCell>
                      </TableRow> */}
                      {group.lrs.map((lr, index) => (
                        <TableRow key={lr.id} className="hover:bg-muted/20 bg-background">
                          <TableCell className="py-2"></TableCell>
                          <TableCell className="text-xs py-2 pl-8">
                            <div className="flex items-center gap-2">
                              <span className="text-muted-foreground">#{index + 1}</span>
                              <div>
                                <div className="font-medium">{lr.LRNumber}</div>
                                <div className="text-muted-foreground text-[10px]">
                                  {new Date(lr.outDate).toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2" colSpan={5}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium">{lr.CustomerName}</div>
                                <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                                  <span>{lr.origin}</span>
                                  <ArrowRight className="h-2 w-2" />
                                  <span>{lr.destination}</span>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-muted-foreground text-[10px]">{lr.vehicleNo}</div>
                                <div className="text-muted-foreground text-[10px]">{lr.vehicleType}</div>
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </>
                  )}
                </React.Fragment>
              );
            })}
            
            {/* Totals Row */}
            <TableRow className="bg-muted/70 font-bold hover:bg-muted/70 border-t-2">
              <TableCell colSpan={3} className="text-sm py-4">
                TOTALS ({groupedByFile.length} Files, {requests.LRRequest.length} LRs)
              </TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalOffered.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalSettled.toLocaleString()}</TableCell>
              <TableCell className="text-sm py-4 text-right">₹{totalExtra.toLocaleString()}</TableCell>
              <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance)}`}>
                <div className="flex items-center justify-end gap-1">
                  {getVarianceIcon(totalVariance)}
                  ₹{Math.abs(totalVariance).toLocaleString()}
                </div>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Variance Explanation */}
      <div className="bg-muted/30 border border-border rounded-lg p-4">
        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
          <span className="text-primary">ℹ️</span> Important Notes
        </h3>
        <div className="space-y-2 text-xs text-muted-foreground">
          <p>
            <strong>Pricing Model:</strong> All LRs with the same File Number share a single price. The price is calculated once per file, not per individual LR.
          </p>
          <p>
            <strong>Variance Formula:</strong> Offered - Settled - Tax (proportional) - Extra Costs
          </p>
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-3 w-3 text-success" />
              <span className="text-green-500 font-medium">Positive variance</span>
              <span>= Money saved (good)</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="h-3 w-3 text-destructive" />
              <span className="text-destructive font-medium">Negative variance</span>
              <span>= Overspent (needs review)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};