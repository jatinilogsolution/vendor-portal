
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Maximize2, Minimize2, FileText, X } from "lucide-react";

interface WorkflowPDFViewerProps {
    url: string;
    title: string;
    trigger?: React.ReactNode;
}

export function WorkflowPDFViewer({ url, title, trigger }: WorkflowPDFViewerProps) {
    const [open, setOpen] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);

    if (!url) return null;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Eye className="w-4 h-4" />
                        View PDF
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className={isFullScreen ? "max-w-[100vw] h-screen m-0 p-0" : "max-w-4xl h-[80vh]"}>
                <DialogHeader className={isFullScreen ? "p-4 border-b bg-background" : "px-6 py-4 border-b"}>
                    <div className="flex items-center justify-between w-full pr-8">
                        <DialogTitle className="flex items-center gap-2 text-sm font-medium">
                            <FileText className="w-4 h-4 text-primary" />
                            {title}
                        </DialogTitle>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setIsFullScreen(!isFullScreen)}
                            >
                                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                asChild
                            >
                                <a href={url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </Button>
                        </div>
                    </div>
                </DialogHeader>
                <div className="flex-1 w-full h-full bg-muted/20 relative overflow-hidden">
                    <iframe
                        src={`${url}#toolbar=0`}
                        className="w-full h-full border-none"
                        title={title}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
}
