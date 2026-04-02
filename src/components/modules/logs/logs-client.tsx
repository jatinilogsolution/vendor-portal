// components/modules/logs/logs-client.tsx
"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import LogFilters, { Filters } from "./logs-filters";
import JsonDiff from "./json-diff";
import ActivityTimeline from "./activity-timeline";
import { IconArrowRightDashed } from "@tabler/icons-react";

const PAGE_SIZE = 100;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface InvoiceData {
  id: string;
  referenceNumber: string;
  amount: number;
  status: string;
  customerName: string;
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  createdAt: string;
  userId: string | null;
  action: string;
  model: string;
  recordId: string | null;
  vendorId: string | null;
  oldData: InvoiceData | Record<string, unknown> | string | null;
  newData: InvoiceData | Record<string, unknown> | string | null;
  description: string | null;
  user: User | null;
}

interface LogsClientProps {
  viewMode?: "table" | "timeline";
  scope?: "transport" | "vendor";
}

export default function LogsClient({ viewMode = "table", scope }: LogsClientProps) {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Filters>({
    q: "",
    model: "",
    action: "",
    from: "",
    to: "",
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const rangeStart = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const rangeEnd = total === 0 ? 0 : Math.min(page * PAGE_SIZE, total);

  async function fetchLogs(targetPage = page) {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));
    if (scope) params.set("scope", scope);
    params.set("page", String(targetPage));
    params.set("pageSize", String(PAGE_SIZE));

    try {
      const res = await fetch(`/api/logs?${params}`);
      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || "Failed to fetch logs");
      }
      setLogs(json.data || []);
      setTotal(json.total || 0);
    } catch (err) {
      console.error("Failed to fetch logs", err);
      setLogs([]);
      setTotal(0);
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const handleSearch = () => {
    if (page !== 1) {
      setPage(1);
      return;
    }

    fetchLogs(1);
  };

  const renderPagination = () => (
    <div className="mt-4 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-muted-foreground">
        Showing {rangeStart}-{rangeEnd} of {total} logs
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={loading || page <= 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">
          Page {page} of {totalPages}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={loading || page >= totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          Next 100
        </Button>
      </div>
    </div>
  );

  const getActionBadge = (action: string) => {
    switch (action) {
      case "CREATE":
        return <Badge className="bg-green-600">CREATE</Badge>;
      case "UPDATE":
        return <Badge variant="default">UPDATE</Badge>;
      case "DELETE":
        return <Badge variant="destructive">DELETE</Badge>;
      default:
        return <Badge variant="secondary">{action}</Badge>;
    }
  };

  // Render timeline view
  if (viewMode === "timeline") {
    return (
      <>
        <Card>
          <CardHeader>
            <CardTitle>Activity Timeline</CardTitle>
            <CardDescription>
              {error ? error : `Chronological view of ${total} audit events in 100-row pages`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LogFilters onChange={setFilters} onSearch={handleSearch} />
            <div className="mt-6">
              {loading ? (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <Skeleton className="h-20 flex-1" />
                    </div>
                  ))}
                </div>
              ) : (
                <ActivityTimeline logs={logs} maxItems={PAGE_SIZE} />
              )}
            </div>
            {renderPagination()}
          </CardContent>
        </Card>

        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                Changes • {selectedLog?.model} {selectedLog?.recordId}
              </DialogTitle>
              <DialogDescription>
                Visual diff of the data change
              </DialogDescription>
            </DialogHeader>
            {selectedLog && (
              <JsonDiff oldData={selectedLog.oldData as any} newData={selectedLog.newData as any} />
            )}
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Render table view

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>
            {error ? error : `Filter and explore ${total} boss-visible audit logs in 100-row pages`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LogFilters onChange={setFilters} onSearch={handleSearch} />

          <div className="mt-6 rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Record</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Vendor</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-24"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-48" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-20" /></TableCell>
                    </TableRow>
                  ))
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                      No logs found
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono text-xs">
                        {format(new Date(log.createdAt), "yyyy-MM-dd HH:mm:ss")}
                      </TableCell>
                      <TableCell>{getActionBadge(log.action)}</TableCell>
                      <TableCell className="font-medium">{log.model}</TableCell>
                      <TableCell>{log.recordId || "-"}</TableCell>
                      <TableCell>{log.user?.name || log.user?.email || log.user?.id || "-"}</TableCell>
                      <TableCell>{log.vendorId || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.description || "-"}
                      </TableCell>
                      <TableCell>
                        {(log.oldData || log.newData) && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLog(log)}
                          >
                            <IconArrowRightDashed className="text-primary animate-pulse" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {renderPagination()}
        </CardContent>
      </Card>

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="max-w-4xl max-h-screen overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Changes • {selectedLog?.model} {selectedLog?.recordId}
            </DialogTitle>
            <DialogDescription>
              Visual diff of the data change
            </DialogDescription>
          </DialogHeader>
          {selectedLog && (
            <JsonDiff oldData={selectedLog.oldData as any} newData={selectedLog.newData as any} />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
