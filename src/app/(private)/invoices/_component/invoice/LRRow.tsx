import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { LRRequest } from "./types";
import { getVarianceIcon, getVarianceColor, formatCurrency, formatDate } from "./utils";
import { FinsCostingBreakdown } from "./FinsCostingBreakdown";
import Link from "next/link";
// import { IconLink } from "@tabler/icons-react";
import { IconExternalLink } from "@tabler/icons-react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface LRRowProps {
  lr: LRRequest;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

export const LRRow = ({ lr, index, isExpanded, onToggle }: LRRowProps) => {
  const finsTotalRevenue = lr.finsCosting?.reduce((sum, f) => sum + (f.revenue || 0), 0) || 0;
  const finsAllocatedCost = lr.finsCosting?.reduce((sum, f) => sum + (f.allocated_cost || 0), 0) || 0;
  const lrVariance = finsTotalRevenue - (lr.lrPrice || 0);

  const VarianceIcon = getVarianceIcon(lrVariance);

  return (
    <>
      <TableRow className="hover:bg-muted/20 bg-background">
         <TableCell className="py-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            {isExpanded ? <ChevronDown /> : <ChevronRight />}
          </Button>
        </TableCell>

        <TableCell className="text-xs py-2 pl-8">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">#{index + 1}</span>
            <div>
              <div className="font-medium">{lr.LRNumber}</div>
              <div className="text-muted-foreground text-[10px]">{formatDate(lr.outDate)}</div>
            </div>
          </div>
        </TableCell>
        <TableCell className="text-xs py-2">{lr.CustomerName}</TableCell>
        <TableCell className="text-xs py-2">Job Cost: {formatCurrency(finsAllocatedCost)}</TableCell>

        <TableCell className="text-xs py-2">Actual Cost: {formatCurrency(lr.lrPrice || 0)}</TableCell>
        <TableCell className="text-xs py-2">Revenue: {formatCurrency(finsTotalRevenue)}</TableCell>

        <TableCell className={`text-xs py-2 ${getVarianceColor(lrVariance)}`}>
          <div className="flex items-center gap-1">
            <VarianceIcon className="h-3 w-3" />
            {/* {finsTotalRevenue - } */}
            {formatCurrency(Math.abs(lrVariance))}
          </div>
        </TableCell>

        <TableCell className="py-2" />
       
        <TableCell className="text-sm">
          <Link href={lr.podlink}>
            <div className="flex items-center justify-center hover:text-primary duration-300 gap-x-2">
              Pod

              <IconExternalLink className="text-primary size-4 scale-95" />

            </div>
          </Link>
        </TableCell>

      </TableRow>

      {isExpanded && lr.finsCosting && lr.finsCosting.length > 0 && (
        <TableRow className="bg-muted/30 hover:bg-muted/30">
          <TableCell />
          <TableCell colSpan={7} className="py-4 px-8">
            <FinsCostingBreakdown finsCosting={lr.finsCosting} />
          </TableCell>
        </TableRow>
      )}
    </>
  );
};
