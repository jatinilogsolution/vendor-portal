 

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
