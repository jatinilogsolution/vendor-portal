import { TableCell, TableRow } from "@/components/ui/table";
import { getVarianceIcon, getVarianceColor, formatCurrency } from "./utils";

interface TotalsRowProps {
  totalFiles: number;
  totalLRs: number;
  totalOffered: number;
  totalVendorSettled: number;
  totalLrPrice: number;
  totalExtra: number;
  totalVariance: number;
}

export const TotalsRow = ({
  totalFiles,
  totalLRs,
  totalOffered,
  totalVendorSettled,
  totalLrPrice,
  totalExtra,
  totalVariance,
}: TotalsRowProps) => {
  const VarianceIcon = getVarianceIcon(totalVariance);

  return (
    <TableRow className="bg-muted/70 font-bold hover:bg-muted/70 border-t-2">
      <TableCell colSpan={3} className="text-sm py-4">
        TOTALS ({totalFiles} Files, {totalLRs} LRs)
      </TableCell>
      <TableCell className="text-sm py-4 text-right">{formatCurrency(totalOffered)}</TableCell>
      <TableCell className="text-sm py-4 text-right">{formatCurrency(totalVendorSettled)}</TableCell>
      <TableCell className="text-sm py-4 text-right">{formatCurrency(totalLrPrice)}</TableCell>
      <TableCell className="text-sm py-4 text-right">{formatCurrency(totalExtra)}</TableCell>
      <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance)}`}>
        <div className="flex items-center justify-end gap-1">
          <VarianceIcon className="h-3 w-3" />
          {formatCurrency(Math.abs(totalVariance))}
        </div>
      </TableCell>
    </TableRow>
  );
};
