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
import { IconArrowRightDashed } from "@tabler/icons-react";

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
  userId: string;
  action: "DELETED" | "CREATED" | "UPDATED"; // add more if needed
  model: string;
  recordId: string;
  vendorId: string;
  oldData: InvoiceData | null;
  newData: InvoiceData | null;
  description: string;
  user: User;
}


export default function LogsClient() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<Filters>({
    q: "",
    model: "",
    action: "",
    from: "",
    to: "",
  });
  const [selectedLog, setSelectedLog] = useState<AuditLogEntry | null>(null);

  async function fetchLogs() {
    setLoading(true);
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => v && params.set(k, v));

    try {
      const res = await fetch(`/api/logs?${params}`);
      const json = await res.json();
      setLogs(json.data || []);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchLogs();

    console.log(":L:LL:LL", logs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

 
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Log Entries</CardTitle>
          <CardDescription>Filter and explore all system audit logs</CardDescription>
        </CardHeader>
        <CardContent>
          <LogFilters onChange={setFilters} onSearch={fetchLogs} />

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