
// components/annexure/UploadAnnexureExtractor.tsx
"use client"

import React, { useState } from "react";
import * as XLSX from "xlsx";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Download } from "lucide-react";
import { downloadCsv } from "@/lib/annexure-utils";
import AnnexureValidationPanel from "./annexure-validation-panel";
 
export default function UploadAnnexureExtractor() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [validationResponse, setValidationResponse] = useState<any | null>(null);
  const [showPanel, setShowPanel] = useState(false);

  const parseAndNormalize = (rawRows: any[]) => {
    return rawRows.map((row) => {
      const normalized: any = {};
      for (const key of Object.keys(row)) normalized[String(key).trim()] = row[key];
      normalized["LR Number"] = String(normalized["LR Number"] ?? normalized["LRNumber"] ?? normalized["LR"] ?? "").trim();
      normalized["Vendor Freight Cost"] = Number(normalized["Vendor Freight Cost"] ?? normalized["Freight"] ?? 0);
      normalized["Extra Cost"] = Number(normalized["Extra Cost"] ?? normalized["Extra"] ?? 0);
      normalized["Remark"] = String(normalized["Remark"] ?? normalized["Remarks"] ?? "").trim();
      normalized["fileNumber_sheet"] = String(normalized["File Number"] ?? normalized["fileNumber"] ?? "").trim() || null;
      return normalized;
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setLoading(true);
    try {
      const ab = await f.arrayBuffer();
      const wb = XLSX.read(ab, { type: "array" });
      const ws = wb.Sheets[wb.SheetNames[0]];
      const raw = XLSX.utils.sheet_to_json(ws, { defval: "" });
      const rows = parseAndNormalize(raw);

      if (rows.filter((r) => r["LR Number"]).length === 0) {
        toast.error("No LR Numbers found in sheet");
        setLoading(false);
        return;
      }

      // send entire parsed rows (no truncation)
      const res = await fetch("/api/lorries/annexures/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ annexureData: rows }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Validation API failed");
        setLoading(false);
        return;
      }
      setValidationResponse(data);
      setShowPanel(true);
      toast.success("Validation finished");
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to parse or validate file");
    } finally {
      setLoading(false);
    }
  };

  const downloadValidationCSV = () => {
    if (!validationResponse) return toast.error("No validation available");
    const rows = validationResponse.validationRows || [];
    downloadCsv(rows.map((r: any) => ({
      lrNumber: r.lrNumber,
      fileNumber: r.fileNumber,
      freightCost: r.freightCost,
      extraCost: r.extraCost,
      status: r.status,
      issues: (r.issues || []).join("; "),
    })), `annexure-validation-${Date.now()}.csv`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Annexure</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-3 items-center mb-4">
          <Input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
          <Button onClick={() => { if (file) handleFile({ target: { files: [file] } } as any); }} disabled={!file || loading}>
            <Upload size={14} /> {loading ? "Processing..." : "Validate"}
          </Button>
          <Button onClick={downloadValidationCSV} disabled={!validationResponse}>
            <Download size={14} /> Export CSV
          </Button>
        </div>

        {showPanel && validationResponse && (
          <AnnexureValidationPanel validationResponse={validationResponse} />
        )}
      </CardContent>
    </Card>
  );
}
