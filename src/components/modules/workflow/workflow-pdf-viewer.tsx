import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink, Eye, Maximize2, Minimize2, FileText, Download, X } from "lucide-react";
import { cn } from "@/lib/utils";

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
          <Button variant="outline" size="sm" className="gap-2 group">
            <Eye className="w-4 h-4 transition-transform group-hover:scale-110" />
            View PDF
          </Button>
        )}
      </DialogTrigger>
      <AnimatePresence>
        {open && (
          <DialogContent
            className={cn(
              "flex flex-col overflow-hidden p-0 gap-0 border-0",
              isFullScreen
                ? "max-w-[100vw] max-h-screen w-screen h-screen rounded-none"
                : "max-w-5xl w-[95vw] h-[90vh] rounded-2xl shadow-2xl"
            )}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "flex items-center justify-between border-b bg-card",
                isFullScreen ? "px-6 py-4" : "px-5 py-3"
              )}
            >
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
                  <FileText className="w-5 h-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <DialogTitle className="text-base font-semibold line-clamp-1">
                    {title}
                  </DialogTitle>
                  <span className="text-xs text-muted-foreground">PDF Document</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <a href={url} download>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </a>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 gap-2 text-muted-foreground hover:text-foreground"
                  asChild
                >
                  <a href={url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Open</span>
                  </a>
                </Button>
                <div className="w-px h-6 bg-border mx-1" />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground hover:text-foreground"
                  onClick={() => setIsFullScreen(!isFullScreen)}
                >
                  {isFullScreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 text-muted-foreground  hover:bg-destructive/10 hover:text-destructive"
                  onClick={() => setOpen(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="flex-1 w-full bg-muted/30 relative overflow-hidden"
            >
              <iframe
                src={`${url}#toolbar=0&navpanes=0`}
                className="w-full h-full border-none"
                title={title}
              />
              
              {/* Decorative gradient overlay at top */}
              <div className="absolute top-0 left-0 right-0 h-8 bg-linear-to-b from-background/20 to-transparent pointer-events-none" />
            </motion.div>
          </DialogContent>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
