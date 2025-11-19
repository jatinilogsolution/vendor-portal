import { FinsCosting } from "./types";
import { formatCurrency } from "./utils";

interface FinsCostingBreakdownProps {
  finsCosting: FinsCosting[];
}

export const FinsCostingBreakdown = ({ finsCosting }: FinsCostingBreakdownProps) => {
  return (
    <div className="text-xs space-y-2">
      <div className="font-semibold">Fins Costing Breakdown</div>
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
            {finsCosting.map((f, i) => (
              <tr key={i} className="border-b hover:bg-muted/40 transition">
                <td className="px-3 py-2 text-primary-foreground/70">{f.charge_code}</td>
                <td className="px-3 py-2">{formatCurrency(f.allocated_cost || 0)}</td>
                <td className="px-3 py-2">{formatCurrency(f.revenue || 0)}</td>
                <td className="px-3 py-2">{f.revgl_code}</td>
                <td className="px-3 py-2">{f.costgl_code}</td>
                <td className="px-3 py-2">{f.LR_No}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
