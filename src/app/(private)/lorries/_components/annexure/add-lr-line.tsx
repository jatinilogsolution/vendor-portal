// "use client";

// import React from "react";
//  import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Card, CardContent } from "@/components/ui/card";
// import { AlertCircle, PlusCircle } from "lucide-react";
// import { toast } from "sonner";
// import { validateFileAdd } from "../../_action/annexure";

// interface Props {
//   annexureId: string;
//   onAdd: (lrs: { id: string; lrNumber: string }[]) => void;
// }

// export default function AddLRInline({ annexureId, onAdd }: Props) {
//   const [lrInput, setLrInput] = React.useState("");
//   const [loading, setLoading] = React.useState(false);
//   const [validated, setValidated] = React.useState<any | null>(null);

//   async function handleCheck() {
//     if (!lrInput.trim()) {
//       return toast.error("Enter LR number");
//     }

//     setLoading(true);
//     setValidated(null);

//     const res = await validateFileAdd(lrInput.trim(), annexureId);

//     setLoading(false);

//     if (res.error) {
//       toast.error(res.error);
//       return;
//     }

//     setValidated(res);
//   }

//   function handleAdd() {
//     if (!validated) return;
//     onAdd(validated.lrs);
//     toast.success("LRs added to annexure");
//     setValidated(null);
//     setLrInput("");
//   }

//   return (
//     <Card className="border rounded-2xl mt-6 shadow-sm">
//       <CardContent className="p-6 space-y-5">

//         {/* INPUT */}
//         <div className="flex items-center gap-3">
//           <Input
//             value={lrInput}
//             onChange={(e) => setLrInput(e.target.value)}
//             placeholder="Enter LR Number..."
//             className="max-w-xs"
//           />
//           <Button onClick={handleCheck} disabled={loading}>
//             {loading ? "Checking..." : "Validate"}
//           </Button>
//         </div>

//         {/* VALIDATED BLOCK */}
//         {validated && (
//           <div className="p-4 border rounded-xl bg-muted/40">
//             <div className="flex items-center gap-2 mb-3">
//               <PlusCircle className="h-5 w-5 text-green-600" />
//               <p className="font-medium">
//                 File <span className="font-bold">{validated.fileNumber}</span> detected
//               </p>
//             </div>

//             <p className="text-sm text-muted-foreground mb-3">
//               Total LRs in this file: {validated.totalLRs}
//             </p>

//             <div className="space-y-2 max-h-40 overflow-auto border rounded-lg p-2 bg-white">
//               {validated.lrs.map((lr: any) => (
//                 <div
//                   key={lr.id}
//                   className="flex items-center justify-between border-b last:border-none pb-1"
//                 >
//                   <span className="font-mono">{lr.lrNumber}</span>
//                   <span className="text-xs text-muted-foreground">
//                     {lr.remark || "No remark"}
//                   </span>
//                 </div>
//               ))}
//             </div>

//             <Button className="mt-4 w-full" onClick={handleAdd}>
//               Add all LRs to annexure
//             </Button>
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }

"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Props {
  annexureId: string;
  onAdd: (lrs: { id: string; lrNumber: string }[]) => void;
}

export default function AddLRInline({ annexureId, onAdd }: Props) {
  const [lrInput, setLrInput] = React.useState("");
  const [validated, setValidated] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  // -------------------------------------------------
  // STEP 1 → CHECK LR VALIDATION
  // -------------------------------------------------
  async function handleCheck() {
    if (!lrInput.trim()) {
      toast.error("Enter LR number");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/lorries/annexures/${annexureId}/validate-lr`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lrNumber: lrInput.trim() }),
      });

      const data = await res.json();
      setValidated(data);
    } catch {
      toast.error("Failed to validate LR");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------
  // STEP 2 → ADD LR
  // -------------------------------------------------
  async function handleAdd() {
    if (!validated?.valid) {
      toast.error("Validation failed");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`/api/lorries/annexures/${annexureId}/add-lrs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lrNumbers: [validated.lrNumber],
        }),
      });

      const data = await res.json();

      if (!res.ok) return toast.error(data.error);

      // Auto attach missing LRs for file
      if (data.requiresMissingGroupAdd) {
        const ok = confirm(
          `This file contains ${data.missingCount} more LRs.\nAttach all of them?`
        );

        if (ok) {
          await fetch(`/api/lorries/annexures/${annexureId}/add-missing`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileNumber: data.fileNumber }),
          });

          toast.success("All missing LRs attached.");
        }
      }

      toast.success("LR Added");
      onAdd(data.attached ?? []);
      setLrInput("");
      setValidated(null);
    } catch {
      toast.error("Failed to add LR");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------------------------------
  // UI
  // -------------------------------------------------
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <h3 className="font-medium">Add LR (Inline)</h3>

      <div className="flex gap-2">
        <Input
          value={lrInput}
          onChange={(e) => setLrInput(e.target.value)}
          placeholder="Enter LR number"
        />
        <Button onClick={handleCheck} disabled={loading}>
          Check
        </Button>
      </div>

      {/* Validation Status */}
      {validated && (
        <div className="space-y-2 border p-3 rounded-md">
          <p className="font-medium">Validation Result:</p>

          {!validated.valid && (
            <Badge variant="destructive">{validated.reason}</Badge>
          )}

          {validated.valid && (
            <Badge variant="default">LR is Valid</Badge>
          )}

          {/* Already used flags */}
          {validated.alreadyInvoiced && (
            <Badge variant="destructive">Already Invoiced</Badge>
          )}

          {validated.alreadyAnnexured && (
            <Badge variant="destructive">
              Already in Annexure {validated.belongsToFile}
            </Badge>
          )}

          {/* Show file number */}
          {validated.fileNumber && (
            <div className="text-sm">
              File Number: <b>{validated.fileNumber}</b>
            </div>
          )}

          {/* Missing LR warning */}
          {validated.requiresFullFileAttach && (
            <div className="text-yellow-600 text-sm">
              This file has <b>{validated.missingCount}</b> missing LRs.
            </div>
          )}

          {/* Add button */}
          {validated.valid && (
            <Button onClick={handleAdd} disabled={loading}>
              Add LR
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
