"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { 
    AlertCircle, 
    CheckCircle2, 
    MessageSquare, 
    FileText as FileIcon, 
    ExternalLink,
    Lock,
    Info,
    History,
    XCircle,
    Send,
    Truck
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
                config.borderClass
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
    nested = false
}: FormattedWorkflowContentProps) {
    let status: string | null = null;
    let reason: string | null = null;

    // 1. Extract [STATUS]
    const bracketMatch = content.match(/^\[(SUBMITTED|REJECTED|SYSTEM|UPDATED|APPROVED|QUERY|DISPUTE|FORWARDED)\]/i);
    if (bracketMatch) {
        status = bracketMatch[1].toUpperCase();
    }

    // 2. Extract Reason: ...
    const reasonMatch = content.match(/Reason:\s*(.*?)(?=\s*(\||\[View Document\]|$))/i);
    if (reasonMatch) {
        reason = reasonMatch[1].trim();
    }

    let displayContent = content.replace(/^\[.*?\]\s*/, "");
    
    // If we have a special reason block, we might want to remove it from main text to avoid duplication
    // But sometimes it's better to keep it if it's part of a sentence.
    // For now, let's keep it in displayContent but highlight it.

    const parts = displayContent.split(/(\[.*?\]\(.*?\)|https?:\/\/[^\s\)]+)/g);

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex items-center gap-2 flex-wrap">
                {status && <StatusBadge status={status} />}
                {isAuthor && (
                    <Badge variant="outline" className="text-[10px] font-medium opacity-60">You</Badge>
                )}
            </div>

            {reason && (
                <div className="bg-red-500/5 border-l-4 border-red-500 p-3 rounded-r-lg my-1">
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 uppercase tracking-widest mb-1">Rejection Reason</p>
                    <p className="text-sm font-medium text-foreground leading-relaxed">
                        {reason}
                    </p>
                </div>
            )}

            <div className={cn("whitespace-pre-wrap wrap-break-word text-sm leading-relaxed", textClassName)}>
                {parts.map((part, idx) => {
                    const markdownMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
                    if (markdownMatch) {
                        const [, text, url] = markdownMatch;
                        
                        const handleLinkClick = (e: React.MouseEvent) => {
                            if (nested) {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(url, '_blank', 'noopener,noreferrer');
                            }
                        };

                        return nested ? (
                                <span
                                    key={idx}
                                    onClick={handleLinkClick}
                                    role="button"
                                    className={cn(
                                        "inline-flex  items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-semibold transition-all hover:bg-accent/50 my-1 cursor-pointer",
                                        isAuthor
                                            ? "bg-primary/10 border-primary/20 text-primary"
                                            : "bg-muted border-border text-foreground hover:bg-muted/80 shadow-sm"
                                    )}
                                >
                                    <FileIcon className="w-3 h-3 opacity-70" />
                                    {text}
                                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                </span>
                            ) : (
                                <a
                                    key={idx}
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] font-semibold transition-all hover:bg-accent/50 my-1",
                                        isAuthor
                                            ? "bg-primary/10 border-primary/20 text-primary"
                                            : "bg-muted border-border text-foreground hover:bg-muted/80 shadow-sm"
                                    )}
                                >
                                    <FileIcon className="w-3 h-3 opacity-70" />
                                    {text}
                                    <ExternalLink className="w-2.5 h-2.5 opacity-50" />
                                </a>
                            );
                    }

                    if (part.startsWith("http")) {
                        const handleLinkClick = (e: React.MouseEvent) => {
                            if (nested) {
                                e.preventDefault();
                                e.stopPropagation();
                                window.open(part, '_blank', 'noopener,noreferrer');
                            }
                        };

                        return nested ? (
                            <span
                                key={idx}
                                onClick={handleLinkClick}
                                role="button"
                                className="text-primary font-medium underline underline-offset-4 hover:opacity-80 cursor-pointer"
                            >
                                {part}
                            </span>
                        ) : (
                            <a
                                key={idx}
                                href={part}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary font-medium underline underline-offset-4 hover:opacity-80"
                            >
                                {part}
                            </a>
                        );
                    }

                    // Handle | key-value pairs if not a reason (as reason is handled separately)
                    if (part.includes("|")) {
                        const pairs = part.split("|").map(p => p.trim()).filter(Boolean);
                        return (
                            <div key={idx} className="flex flex-col gap-1.5 mb-1.5 p-3 rounded border border-dashed border-primary/40 bg-secondary-foreground/50">
                                {pairs.map((pair, pIdx) => {
                                    const [key, ...valueParts] = pair.split(":");
                                    const value = valueParts.join(":").trim();
                                    if (key && value) {
                                        return (
                                            <div key={pIdx} className="flex items-center justify-between gap-4 text-[11px]">
                                                <span className="font-semibold uppercase tracking-tight opacity-60 shrink-0">{key}</span>
                                                <div className="h-px flex-1 bg-border/20 border-dotted border-b"></div>
                                                <span className="font-medium text-foreground">{value}</span>
                                            </div>
                                        );
                                    }
                                    return <span key={pIdx} className="opacity-80 italic text-xs">{pair}</span>;
                                })}
                            </div>
                        );
                    }

                    return <span key={idx}>{part}</span>;
                })}
            </div>
        </div>
    );
}
