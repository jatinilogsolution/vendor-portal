"use client";

import { format } from "date-fns";
import {
  FileText,
  Edit,
  Trash2,
  PlusCircle,
  User,
  Database,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { LogEntry } from "@/hooks/useLogs";
import { ScrollArea } from "@/components/ui/scroll-area";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface ActivityTimelineProps {
  logs: LogEntry[];
  maxItems?: number;
}

export default function ActivityTimeline({
  logs,
  maxItems = 50,
}: ActivityTimelineProps) {
  const displayLogs = logs.slice(0, maxItems);

  const getActionIcon = (action: string) => {
    switch (action) {
      case "CREATE":
        return <PlusCircle className="h-4 w-4 text-green-600" />;
      case "UPDATE":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "DELETE":
        return <Trash2 className="h-4 w-4 text-red-600" />;
      case "LOGIN":
        return <User className="h-4 w-4 text-purple-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case "CREATE":
        return "border-green-600";
      case "UPDATE":
        return "border-blue-600";
      case "DELETE":
        return "border-red-600";
      case "LOGIN":
        return "border-purple-600";
      default:
        return "border-gray-600";
    }
  };

  if (displayLogs.length === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          No activity to display
        </CardContent>
      </Card>
    );
  }

  return (
    <ScrollArea className="h-[600px] pr-4">
      <div className="relative space-y-4">
        {/* Timeline line */}
        <div className="absolute left-6 top-2 bottom-2 w-px bg-border" />

        {displayLogs.map((log, index) => (
          <div key={log.id} className="relative flex gap-4">
            {/* Action icon */}
            <div
              className={`relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 bg-background ${getActionColor(
                log.action,
              )}`}
            >
              {getActionIcon(log.action)}
            </div>

            {/* Content */}
            <Card className="flex-1">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{log.action}</Badge>
                      <Badge variant="secondary">
                        <Database className="mr-1 h-3 w-3" />
                        {log.model}
                      </Badge>
                    </div>

                    <div className="text-sm font-medium prose prose-sm dark:prose-invert max-w-none">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {log.description || "No description"}
                      </ReactMarkdown>
                    </div>

                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {log.user?.name || log.user?.email || "Unknown user"}
                      </span>
                      {log.recordId && (
                        <span className="font-mono">
                          ID: {log.recordId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 text-right">
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.createdAt), "MMM dd, yyyy")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(log.createdAt), "HH:mm:ss")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
