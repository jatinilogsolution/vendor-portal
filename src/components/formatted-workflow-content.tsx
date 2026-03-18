"use client";

import React from "react";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Send,
  Truck,
  Info,
  XCircle,
  ExternalLink,
  FileText as FileIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface FormattedWorkflowContentProps {
  content: string;
  isAuthor?: boolean;
  className?: string;
  textClassName?: string;
  nested?: boolean; // New prop to handle nesting in <a> tags
}

const StatusBadge = ({ status }: { status: string }) => {
  const config = {
    label: status,
    icon: <Info className="w-3 h-3" />,
    bgClass: "bg-blue-50 dark:bg-blue-950/30",
    textClass: "text-blue-700 dark:text-blue-400",
    borderClass: "border-blue-200 dark:border-blue-800",
  };

  switch (status.toUpperCase()) {
    case "REJECTED":
      config.icon = <XCircle className="w-3 h-3" />;
      config.bgClass = "bg-red-50 dark:bg-red-950/30";
      config.textClass = "text-red-700 dark:text-red-400";
      config.borderClass = "border-red-200 dark:border-red-800";
      break;
    case "SUBMITTED":
      config.icon = <Send className="w-3 h-3" />;
      config.bgClass = "bg-amber-50 dark:bg-amber-950/30";
      config.textClass = "text-amber-700 dark:text-amber-400";
      config.borderClass = "border-amber-200 dark:border-amber-800";
      break;
    case "APPROVED":
      config.icon = <CheckCircle2 className="w-3 h-3" />;
      config.bgClass = "bg-emerald-50 dark:bg-emerald-950/30";
      config.textClass = "text-emerald-700 dark:text-emerald-400";
      config.borderClass = "border-emerald-200 dark:border-emerald-800";
      break;
    case "FORWARDED":
      config.icon = <Truck className="w-3 h-3" />;
      config.bgClass = "bg-indigo-50 dark:bg-indigo-950/30";
      config.textClass = "text-indigo-700 dark:text-indigo-400";
      config.borderClass = "border-indigo-200 dark:border-indigo-800";
      break;
    case "AUTHORIZED":
      config.icon = <CheckCircle2 className="w-3 h-3" />;
      config.bgClass = "bg-purple-50 dark:bg-purple-950/30";
      config.textClass = "text-purple-700 dark:text-purple-400";
      config.borderClass = "border-purple-200 dark:border-purple-800";
      break;
    case "SYSTEM":
      config.icon = <AlertCircle className="w-3 h-3" />;
      config.bgClass = "bg-slate-50 dark:bg-slate-900";
      config.textClass = "text-slate-700 dark:text-slate-400";
      config.borderClass = "border-slate-200 dark:border-slate-800";
      break;
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase mb-1",
        config.bgClass,
        config.textClass,
        config.borderClass,
      )}
    >
      {config.icon}
      {status}
    </Badge>
  );
};

export function FormattedWorkflowContent({
  content,
  isAuthor = false,
  className,
  textClassName,
  nested = false,
}: FormattedWorkflowContentProps) {
  let workflowStatus: string | null = null;
  let workflowReason: string | null = null;

  // 1. Extract [STATUS]
  const bracketMatch = content.match(
    /^\[(SUBMITTED|REJECTED|SYSTEM|UPDATED|APPROVED|QUERY|DISPUTE|FORWARDED|AUTHORIZED)\]/i,
  );
  if (bracketMatch) {
    workflowStatus = bracketMatch[1].toUpperCase();
  }

  // 2. Extract Reason: ... (logic kept for special highlighting)
  const reasonMatch = content.match(
    /(?:Reason|Remark|Rejection Reason):\s*(.*?)(?=\s*(\||\[View Document\]|$))/i,
  );
  if (reasonMatch) {
    workflowReason = reasonMatch[1].trim();
  }

  // Remove the [STATUS] tag from display content for markdown parsing
  let displayContent = content.replace(/^\[.*?\]\s*/, "");

  // Transform legacy "Key: Value" or "Key - Value" patterns into markdown bold/lists for better parsing
  // This helps when the source doesn't use proper markdown
  displayContent = displayContent
    .replace(
      /(File Number|LR Number|Invoice #|Ref|Vehicle|Customer):\s*([^\n|]+)/gi,
      "**$1:** $2",
    )
    .replace(
      /(?:Reason|Remark|Rejection Reason):\s*([^\n|]+)/gi,
      "> **$1:** $2",
    );

  // Custom renderer for ReactMarkdown
  const components = {
    a: ({ href, children }: any) => {
      const handleLinkClick = (e: React.MouseEvent) => {
        if (nested) {
          e.preventDefault();
          e.stopPropagation();
          window.open(href, "_blank", "noopener,noreferrer");
        }
      };

      if (nested) {
        return (
          <span
            onClick={handleLinkClick}
            role="button"
            className="text-primary font-medium underline underline-offset-4 hover:opacity-80 cursor-pointer"
          >
            {children} <ExternalLink className="inline-block w-3 h-3 ml-0.5" />
          </span>
        );
      }

      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary font-medium underline underline-offset-4 hover:opacity-80"
        >
          {children} <ExternalLink className="inline-block w-3 h-3 ml-0.5" />
        </a>
      );
    },
    p: ({ children }: any) => (
      <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-5 mb-2 space-y-1">{children}</ul>
    ),
    ol: ({ children }: any) => (
      <ol className="list-decimal pl-5 mb-2 space-y-1">{children}</ol>
    ),
    li: ({ children }: any) => <li className="pl-1 text-sm">{children}</li>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary/20 bg-muted/30 pl-4 py-2 my-2 italic text-muted-foreground rounded-r">
        {children}
      </blockquote>
    ),
    h1: ({ children }: any) => (
      <h1 className="text-lg font-bold mb-2 mt-4">{children}</h1>
    ),
    h2: ({ children }: any) => (
      <h2 className="text-base font-bold mb-2 mt-3">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-sm font-bold mb-1 mt-2">{children}</h3>
    ),
    code: ({ children }: any) => (
      <code className="bg-muted px-1.5 py-0.5 rounded text-[11px] font-mono border border-border">
        {children}
      </code>
    ),
    pre: ({ children }: any) => (
      <pre className="bg-muted p-2 rounded-lg border border-border overflow-x-auto my-2 text-xs">
        {children}
      </pre>
    ),
    // Table components
    table: ({ children }: any) => (
      <div className="my-2 rounded-md border w-full overflow-hidden">
        <table className="w-full text-sm text-left">{children}</table>
      </div>
    ),
    thead: ({ children }: any) => (
      <thead className="bg-muted/50 text-xs uppercase font-semibold text-muted-foreground">
        {children}
      </thead>
    ),
    tbody: ({ children }: any) => (
      <tbody className="divide-y">{children}</tbody>
    ),
    tr: ({ children }: any) => (
      <tr className="hover:bg-muted/30 transition-colors">{children}</tr>
    ),
    th: ({ children }: any) => (
      <th className="px-3 py-2 font-medium bg-muted/30">{children}</th>
    ),
    td: ({ children }: any) => (
      <td className="px-3 py-2 border-t border-border/50">{children}</td>
    ),
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex items-center gap-2 flex-wrap">
        {workflowStatus && <StatusBadge status={workflowStatus} />}
        {isAuthor && (
          <Badge
            variant="outline"
            className="text-[10px] font-medium opacity-60"
          >
            You
          </Badge>
        )}
      </div>

      {workflowReason && (
        <div className="bg-red-500/5 border-l-4 border-red-500 p-3 rounded-r-lg my-1">
          <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">
            Rejection Reason
          </p>
          <p className="text-sm font-medium text-foreground leading-relaxed">
            {workflowReason}
          </p>
        </div>
      )}

      <div className={cn("text-sm leading-relaxed", textClassName)}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {displayContent}
        </ReactMarkdown>
      </div>
    </div>
  );
}
