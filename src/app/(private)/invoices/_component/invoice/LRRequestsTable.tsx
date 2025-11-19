"use client"
import React from "react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Invoice, FileGroup, LRRequest } from "./types";
import { FileRow } from "./FileRow";
import { TotalsRow } from "./TotalsRow";

interface LRRequestsTableProps {
  requests: Invoice;
}

export const LRRequestsTable = ({ requests }: LRRequestsTableProps) => {
  const [expandedFiles, setExpandedFiles] = React.useState<Set<string>>(new Set());
  const [expandedLRs, setExpandedLRs] = React.useState<Set<string>>(new Set());

  const groupedByFile = React.useMemo(() => {
    const grouped = new Map<string, LRRequest[]>();

    requests?.LRRequest.forEach((lr) => {
      if (!grouped.has(lr.fileNumber)) grouped.set(lr.fileNumber, []);
      grouped.get(lr.fileNumber)!.push(lr);
    });

    return Array.from(grouped.entries()).map(([fileNumber, lrs]): FileGroup => {
      const lrCount = lrs.length;
      const awlOffered = lrs[0].priceOffered;
      const vendorSettled = lrs[0].priceSettled;
      const lrPriceTotal = lrs.reduce((s, x) => s + (x.lrPrice || 0), 0);
      const extraCost = lrs.reduce((s, x) => s + (x.extraCost || 0), 0);
      const fileRevenue = lrs.reduce(
        (sum, lr) =>
          sum + (lr.finsCosting?.reduce((a, f) => a + (f.revenue || 0), 0) || 0),
        0
      );
      const jobCost = lrs.reduce(
        (sum, lr) =>
          sum + (lr.finsCosting?.reduce((a, f) => a + (f.allocated_cost || 0), 0) || 0),
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
        fileRevenue,
        jobCost
      };
    });
  }, [requests?.LRRequest]);

  const toggleFile = React.useCallback((fileNumber: string) => {
    setExpandedFiles((prev) => {
      const next = new Set(prev);
      if (next.has(fileNumber)) {
        next.delete(fileNumber);
      } else {
        next.add(fileNumber);
      }
      return next;
    });
  }, []);

  const toggleLR = React.useCallback((lrId: string) => {
    setExpandedLRs((prev) => {
      const next = new Set(prev);
      if (next.has(lrId)) {
        next.delete(lrId);
      } else {
        next.add(lrId);
      }
      return next;
    });
  }, []);

  const invoiceTaxAmount = requests?.taxAmount || 0;
  const totalOffered = groupedByFile.reduce((sum, g) => sum + g.awlOffered, 0);
  const totalVendorSettled = groupedByFile.reduce((sum, g) => sum + g.vendorSettled, 0);
  const totalLrPrice = groupedByFile.reduce((sum, g) => sum + g.lrPriceTotal, 0);
  const totalExtra = groupedByFile.reduce((sum, g) => sum + (g.extraCost || 0), 0);
  const totalVariance = totalOffered - totalLrPrice - invoiceTaxAmount - totalExtra;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/70 hover:bg-muted/70">
              <TableHead className="text-xs font-semibold h-10 w-12" />
              <TableHead className="text-xs font-semibold h-10">File No.</TableHead>
              <TableHead className="text-xs font-semibold h-10">LR Count</TableHead>
              

              <TableHead className="text-xs font-semibold h-10 text-right">PRQ Cost</TableHead>
               <TableHead className="text-xs font-semibold h-10 text-right">
                Job Cost
              </TableHead>

              <TableHead className="text-xs font-semibold h-10 text-right">Actual Cost</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">
                Revenue
              </TableHead>
              {/* <TableHead className="text-xs font-semibold h-10 text-right">
                Job Cost
              </TableHead> */}

              <TableHead className="text-xs font-semibold h-10 text-right">Extra</TableHead>
              <TableHead className="text-xs font-semibold h-10 text-right">Variance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedByFile.map((group) => (
              <FileRow
                key={group.fileNumber}
                group={group}
                isExpanded={expandedFiles.has(group.fileNumber)}
                onToggle={() => toggleFile(group.fileNumber)}
                expandedLRs={expandedLRs}
                onToggleLR={toggleLR}
                invoiceTaxAmount={invoiceTaxAmount}
                totalLrPrice={totalLrPrice}
              />
            ))}

            <TotalsRow
              totalFiles={groupedByFile.length}
              totalLRs={requests?.LRRequest.length || 0}
              totalOffered={totalOffered}
              totalVendorSettled={totalVendorSettled}
              totalLrPrice={totalLrPrice}
              totalExtra={totalExtra}
              totalVariance={totalVariance}
            />
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
