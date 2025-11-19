import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FileGroup } from "./types";
import { getVarianceIcon, getVarianceColor, formatCurrency } from "./utils";
import { LRRow } from "./LRRow";

interface FileRowProps {
  group: FileGroup;
  isExpanded: boolean;
  onToggle: () => void;
  expandedLRs: Set<string>;
  onToggleLR: (lrId: string) => void;
  invoiceTaxAmount: number;
  totalLrPrice: number;
}

export const FileRow = ({
  group,
  isExpanded,
  onToggle,
  expandedLRs,
  onToggleLR,
  invoiceTaxAmount,
  totalLrPrice,
}: FileRowProps) => {
  const fileTaxShare = totalLrPrice ? (group.lrPriceTotal / totalLrPrice) * invoiceTaxAmount : 0;
  const fileVariance = group.fileRevenue - group.lrPriceTotal - fileTaxShare - (group.extraCost || 0);
  const VarianceIcon = getVarianceIcon(fileVariance);

  return (
    <>
      <TableRow
        className="hover:bg-muted/50 cursor-pointer font-medium bg-muted/30"
        onClick={onToggle}
      >
        <TableCell className="py-3">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </TableCell>
        <TableCell className="text-sm py-3 space-x-4">
          <Badge variant="outline" className="font-semibold">
            {group.fileNumber}
          </Badge>
          <Badge variant="secondary" className="border border-primary">
            {group.lrs[0].vehicleNo} - {group.lrs[0].vehicleType}
          </Badge>
        </TableCell>
        <TableCell className="text-sm py-3">
          <Badge variant="secondary">
            {group.lrCount} LR{group.lrCount > 1 ? "s" : ""}
          </Badge>
        </TableCell>
        <TableCell className="text-sm py-3 text-right font-semibold">
          {formatCurrency(group.awlOffered)}
        </TableCell>
          <TableCell className="text-sm py-3 text-right font-semibold">
          {formatCurrency(group.jobCost)}
        </TableCell>
        <TableCell className="text-sm py-3 text-right font-semibold">
          {formatCurrency(group.vendorSettled)}
        </TableCell>
        <TableCell className="text-sm py-3 text-right font-semibold">
          {formatCurrency(group.fileRevenue)}
        </TableCell>
      
        
        <TableCell className="text-sm py-3 text-right">
          {/* {group.extraCost ? ( */}
            <span className="font-semibold text-orange-600">
              {formatCurrency(group.extraCost || 0)}
            </span>
          {/* ) : (
            "0"
          )} */}
        </TableCell>
        <TableCell className={`text-sm py-3 text-right ${getVarianceColor(fileVariance)}`}>
          <div className="flex items-center justify-end gap-1">
            <VarianceIcon className="h-3 w-3" />
            {formatCurrency(Math.abs(fileVariance))}
          </div>
        </TableCell>
      </TableRow>

      {isExpanded &&
        group.lrs.map((lr, index) => (
          <LRRow
            key={lr.id}
            lr={lr}
            index={index}
            isExpanded={expandedLRs.has(lr.id)}
            onToggle={() => onToggleLR(lr.id)}
          />
        ))}
    </>
  );
};
