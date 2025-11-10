// lib/annexure-utils.ts
export function downloadCsv(rows: any[], filename = "report.csv") {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const lines = [headers.join(",")];
  for (const r of rows) {
    const line = headers.map((h) => {
      const v = r[h] ?? "";
      return typeof v === "string" && v.includes(",") ? `"${String(v).replace(/"/g, '""')}"` : String(v);
    }).join(",");
    lines.push(line);
  }
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
}
