// components/annexure/AnnexureValidationPanel.tsx
"use client"

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
 import * as XLSX from "xlsx";
import { toast } from "sonner";
import UploadExtraAttachment from "./upload-extra-attachment";
import UploadPod from "./upload-pod";

export default function AnnexureValidationPanel({ validationResponse, onClose }: any) {
  const { validationRows = [], grouped = {}, summary = {} } = validationResponse || {};
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [committing, setCommitting] = useState(false);

  useEffect(() => {
    // auto-select only FOUND and no annexure and no blocking issues (optional)
    const s = new Set<string>();
    (validationRows || []).forEach((r: any) => {
      if (r.status === "FOUND" && !(r.annexureId)) s.add(r.lrNumber);
    });
    setSelected(s);
  }, [validationRows]);

  const toggle = (lr: string) => {
    const s = new Set(selected);
    s.has(lr) ? s.delete(lr) : s.add(lr);
    setSelected(s);
  };

  const downloadCSV = () => {
    const rows = (validationRows || []).map((r: any) => ({
      lrNumber: r.lrNumber,
      fileNumber: r.fileNumber,
      freightCost: r.freightCost,
      extraCost: r.extraCost,
      status: r.status,
      issues: (r.issues || []).join("; "),
      podLink: r.podLink,
    }));
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "validation");
    XLSX.writeFile(wb, `annexure_validation_${Date.now()}.xlsx`);
  };

  const handleCommit = async () => {
    if (!selected.size) return toast.error("No LRs selected");
    setCommitting(true);
    try {
      const extractedData = (validationRows || []).map((r: any) => ({
        "LR Number": r.lrNumber,
        "Vendor Freight Cost": r.freightCost,
        "Extra Cost": r.extraCost,
        Remark: r.remark,
        fileNumber: r.fileNumber,
      }));

      const res = await fetch("/api/lorries/annexures/saveAnnexure", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Annexure-${new Date().toISOString().slice(0, 10)}`,
          fromDate: new Date().toISOString(),
          toDate: new Date().toISOString(),
          validatedLrs: Array.from(selected.values()),
          extractedData,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Commit failed");
      toast.success(`${data.updatedCount} LRs linked`);
      onClose?.();
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Commit failed");
    } finally {
      setCommitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Validation Summary</h3>
          <p className="text-sm text-muted-foreground">{summary.totalRows ?? validationRows.length} rows • {Object.keys(grouped).length} file groups</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={downloadCSV}>Export XLSX</Button>
          <Button onClick={handleCommit} disabled={committing}>{committing ? "Saving..." : "Confirm & Save Annexure"}</Button>
        </div>
      </div>

      {Object.entries(grouped).map(([fileNo, lrs]: any) => (
        <div key={fileNo} className="border rounded p-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <strong>File:</strong> {fileNo}
            </div>
            <div className="flex items-center gap-2">
              <UploadExtraAttachment fileNumber={fileNo} />
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead></TableHead>
                <TableHead>LR Number</TableHead>
                <TableHead>Freight</TableHead>
                <TableHead>Extra</TableHead>
                <TableHead>Remark</TableHead>
                <TableHead>POD</TableHead>
                <TableHead>Proof</TableHead>
                <TableHead>Issues</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {lrs.map((r: any) => (
                <TableRow key={r.lrNumber} className={`${r.issues?.length ? "bg-red-50" : ""}`}>
                  <TableCell className="text-center">
                    <input type="checkbox" checked={selected.has(r.lrNumber)} onChange={() => toggle(r.lrNumber)} />
                  </TableCell>
                  <TableCell>{r.lrNumber}</TableCell>
                  <TableCell>{r.freightCost}</TableCell>
                  <TableCell>{r.extraCost}</TableCell>
                  <TableCell>{r.remark}</TableCell>
                  <TableCell>
                    <UploadPod lrNumber={r.lrNumber} initialFileUrl={r.podLink ?? null} fileNumber={r.fileNumber} />
                  </TableCell>
                  <TableCell>{r.extraCostAttachment ? "Attached" : "Missing"}</TableCell>
                  <TableCell>{(r.issues || []).join("; ") || "-"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ))}
    </div>
  );
}
