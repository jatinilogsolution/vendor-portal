"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  MessageSquare,
  Send,
  Clock,
  X,
  Minus,
  Maximize2,
  Minimize2,
  Paperclip,
  FileText as FileIcon,
  Lock,
  EyeOff,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Info,
  History,
  Loader2,
  MessagesSquare,
  Mail,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { WorkflowPDFViewer } from "./workflow-pdf-viewer";
import { ManualNotificationDialog } from "./manual-notification-dialog";
import {
  addWorkflowComment,
  getWorkflowComments,
} from "@/app/(private)/lorries/_action/workflow-comments.action";

interface Comment {
  id: string;
  content: string;
  authorId: string;
  authorRole: string;
  createdAt: Date;
  Author: {
    name: string;
    image?: string | null;
  };
  attachmentUrl?: string | null;
  attachmentName?: string | null;
  isPrivate?: boolean;
}

// IndexedDB Utility
const DB_NAME = "WorkflowChatDB";
const STORE_NAME = "comments";

const initDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 2); // Increased version for index migration
    request.onupgradeneeded = (event: any) => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("annexureId", "annexureId", { unique: false });
        store.createIndex("invoiceId", "invoiceId", { unique: false });
      } else {
        const store = event.currentTarget.transaction.objectStore(STORE_NAME);
        if (!store.indexNames.contains("annexureId")) {
          store.createIndex("annexureId", "annexureId", { unique: false });
        }
        if (!store.indexNames.contains("invoiceId")) {
          store.createIndex("invoiceId", "invoiceId", { unique: false });
        }
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

const storeComments = async (comments: Comment[]) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  comments.forEach((c) => store.put(c));
  return new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
};

const getLocalComments = async (annexureId?: string, invoiceId?: string) => {
  const db = await initDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  
  let request: IDBRequest;
  if (annexureId) {
    request = store.index("annexureId").getAll(annexureId);
  } else if (invoiceId) {
    request = store.index("invoiceId").getAll(invoiceId);
  } else {
    request = store.getAll();
  }

  return new Promise<Comment[]>((resolve) => {
    request.onsuccess = () => {
      const all = request.result as Comment[];
      resolve(all.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()));
    };
  });
};

interface WorkflowCommentsProps {
  annexureId?: string;
  invoiceId?: string;
  currentUser: {
    id: string;
    name: string;
    role: string;
  };
  initiallyMinimized?: boolean;
  availableRecipients?: Array<{ email: string; name: string; id?: string }>;
}

 

import { FormattedWorkflowContent } from "../../formatted-workflow-content";

// Message bubble component
const MessageBubble = ({
  comment,
  isAuthor,
  currentUserRole,
  invoiceId,
  annexureId,
  availableRecipients,
}: {
  comment: Comment;
  isAuthor: boolean;
  currentUserRole: string;
  invoiceId?: string;
  annexureId?: string;
  availableRecipients: any[];
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex flex-col gap-1 max-w-[85%]",
        isAuthor ? "items-end ml-auto" : "items-start"
      )}
    >
      {/* Author info */}
      <div className="flex items-center gap-2 px-1">
        <span className="text-[11px] font-medium text-muted-foreground">
          {isAuthor ? "You" : comment.Author.name}
        </span>
        <Badge
          variant="outline"
          className="text-[9px] py-0 h-4 px-1.5 font-normal"
        >
          {comment.authorRole}
        </Badge>
        {comment.isPrivate && (
          <Badge className="text-[9px] py-0 h-4 px-1.5 bg-amber-100 text-amber-700 border-amber-200 hover:bg-amber-100">
            <Lock className="w-2.5 h-2.5 mr-1" />
            PRIVATE
          </Badge>
        )}
      </div>

      {/* Message bubble */}
      <div
        className={cn(
          "px-4 py-3 rounded-2xl shadow-sm transition-shadow hover:shadow-md",
          isAuthor
            ? "bg-primary/10 dark:text-primary-foreground text-secondary rounded-br-md"
            : "bg-muted/80 backdrop-blur-sm border border-border/50 rounded-bl-md"
        )}
      >
        <FormattedWorkflowContent content={comment.content} isAuthor={isAuthor} />

        {/* Attachment */}
        {comment.attachmentUrl && (
          <div
            className={cn(
              "mt-3 pt-3 border-t flex items-center gap-3",
              isAuthor ? "border-white/20" : "border-border"
            )}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-lg shrink-0",
                  isAuthor ? "bg-white/20" : "bg-primary/10"
                )}
              >
                <FileIcon
                  className={cn("w-4 h-4", isAuthor ? "" : "text-primary")}
                />
              </div>
              <span className="text-xs font-medium truncate">
                {comment.attachmentName}
              </span>
            </div>
            {comment.attachmentName?.toLowerCase().endsWith(".pdf") ? (
              <WorkflowPDFViewer
                url={comment.attachmentUrl}
                title={comment.attachmentName}
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-lg shrink-0",
                      isAuthor ? "hover:bg-white/20" : "hover:bg-primary/10"
                    )}
                  >
                    <Maximize2 className="w-4 h-4" />
                  </Button>
                }
              />
            ) : (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg shrink-0",
                  isAuthor ? "hover:bg-white/20" : "hover:bg-primary/10"
                )}
                asChild
              >
                <a
                  href={comment.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Timestamp & Email Notification */}
      <div className="flex items-center gap-3 px-1 mt-0.5 opacity-60 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-1.5">
          <Clock className="w-2.5 h-2.5" />
          <span className="text-[9px] font-medium tracking-tight">
            {formatDistanceToNow(new Date(comment.createdAt), {
              addSuffix: true,
            })}
          </span>
        </div>

        <ManualNotificationDialog
          currentUserRole={currentUserRole}
          entityName={invoiceId ? "Invoice" : "Annexure"}
          recipientEmail={""}
          availableRecipients={availableRecipients}
          defaultDescription={`Regarding message from ${comment.Author.name}:\n\n"${comment.content}"`}
          path={
            invoiceId
              ? `/invoices/${invoiceId}`
              : `/lorries/annexure/${annexureId}`
          }
          trigger={
            <button
              className="group/mail flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
              title="Forward via Email"
            >
              <Mail className="w-2.5 h-2.5 transition-transform group-hover/mail:-translate-y-px" />
              Notify
            </button>
          }
        />
      </div>
    </motion.div>
  );
};

export function WorkflowComments({
  annexureId,
  invoiceId,
  currentUser,
  initiallyMinimized = true,
  availableRecipients = [],
}: WorkflowCommentsProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMinimized, setIsMinimized] = useState(initiallyMinimized);
  const [isExpanded, setIsExpanded] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [showNewMessageButton, setShowNewMessageButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [lastSeen, setLastSeen] = useState<number>(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement>(null);
  const lastCreatedAtRef = useRef<Date | undefined>(undefined);
  const commentsRef = useRef<Comment[]>([]);
  const isFetchingRef = useRef<boolean>(false);
  const isMinimizedRef = useRef<boolean>(initiallyMinimized);

  // Load last seen from localStorage
  useEffect(() => {
    const key = `chat_seen_${annexureId || invoiceId}`;
    const saved = localStorage.getItem(key);
    if (saved) setLastSeen(parseInt(saved));
  }, [annexureId, invoiceId]);

  // Update unread count when comments or lastSeen change
  useEffect(() => {
    if (!comments.length) return;
    const count = comments.filter(c => new Date(c.createdAt).getTime() > lastSeen).length;
    setUnreadCount(count);
  }, [comments, lastSeen]);

  // Sync refs with state
  useEffect(() => {
    isMinimizedRef.current = isMinimized;
  }, [isMinimized]);

  // Sync commentsRef with comments state
  useEffect(() => {
    commentsRef.current = comments;
  }, [comments]);

  // Update lastSeen when scrolled to bottom or opened
  const updateLastSeen = () => {
    if (isMinimizedRef.current) return;
    
    const scrollContainer = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
      const currentComments = commentsRef.current;
      if (isNearBottom && currentComments.length > 0) {
        const latestTime = new Date(currentComments[currentComments.length - 1].createdAt).getTime();
        setLastSeen(latestTime);
        const key = `chat_seen_${annexureId || invoiceId}`;
        localStorage.setItem(key, latestTime.toString());
      }
    }
  };

  const fetchComments = async (isManual = false) => {
    if (isFetchingRef.current) return;
    try {
      isFetchingRef.current = true;
      const currentComments = commentsRef.current;

      // If no comments in state, try to load from IndexedDB
      if (!isManual && currentComments.length === 0) {
        const local = await getLocalComments(annexureId, invoiceId);
        if (local.length > 0) {
          setComments(local);
          lastCreatedAtRef.current = local[local.length - 1].createdAt;
          setIsLoading(false);
          
        }
      }

      const res = await getWorkflowComments({
        annexureId,
        invoiceId,
        role: currentUser.role,
        lastCreatedAt: lastCreatedAtRef.current,
      });

      if (res.success && res.data && res.data.length > 0) {
        const newComments = res.data as any[];
        
        // Merge and deduplicate
        setComments(prev => {
          const combined = [...prev, ...newComments];
          const unique = Array.from(new Map(combined.map(c => [c.id, c])).values());
          const sorted = unique.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
          
          // Update ref for the next fetch
          if (sorted.length > 0) {
            lastCreatedAtRef.current = sorted[sorted.length - 1].createdAt;
          }

          // Store in IndexedDB
          storeComments(sorted.map(c => ({ ...c, annexureId, invoiceId })));
          
          return sorted;
        });

        // Check for new message button: ONLY if not minimized and we are away from bottom
        setTimeout(() => {
          const isCurrentlyMinimized = isMinimizedRef.current;
          if (scrollRef.current && !isCurrentlyMinimized && !isManual) {
            const scrollContainer = scrollRef.current.querySelector("[data-radix-scroll-area-viewport]");
            if (scrollContainer) {
              const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
              if (!isNearBottom) {
                setShowNewMessageButton(true);
              }
            }
          }
        }, 150);
      }
    } catch (error) {
      console.error("Failed to fetch comments", error);
    } finally {
      setIsLoading(false);
      isFetchingRef.current = false;
    }
  };

  useEffect(() => {
    fetchComments();
    const interval = setInterval(() => fetchComments(), 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, [annexureId, invoiceId]);

  useEffect(() => {
    if (scrollRef.current && !isMinimized && !showNewMessageButton) {
      const scrollContainer = scrollRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      );
      if (scrollContainer) {
        // Only auto-scroll if we are already at the bottom 
        const isNearBottom = scrollContainer.scrollHeight - scrollContainer.scrollTop - scrollContainer.clientHeight < 100;
        if (isNearBottom) {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
          updateLastSeen();
        }
      }
    }
  }, [comments, isMinimized, showNewMessageButton]);

  // Initial scroll to bottom when opening chat
  useEffect(() => {
    if (!isMinimized && comments.length > 0) {
      setTimeout(() => scrollToBottom("auto"), 50);
    }
  }, [isMinimized]);

  // Update last seen when chat is expanded
  useEffect(() => {
    if (!isMinimized) {
      setTimeout(updateLastSeen, 300); // Wait for transition
    }
  }, [isMinimized]);

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    const scrollContainer = scrollRef.current?.querySelector("[data-radix-scroll-area-viewport]");
    if (scrollContainer) {
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior
      });
      setShowNewMessageButton(false);
      setTimeout(updateLastSeen, behavior === "smooth" ? 500 : 10);
    }
  };

  const handleSubmit = async () => {
    if ((!newComment.trim() && !file) || isSubmitting) return;

    let attachmentUrl = "";
    let attachmentName = "";

    try {
      setIsSubmitting(true);

      if (file) {
        setIsUploading(true);
        const formData = new FormData();
        formData.append("file", file);
        formData.append("path", `invoices/${invoiceId}/workflow/`);

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!uploadRes.ok) throw new Error("File upload failed");
        const uploadData = await uploadRes.json();
        attachmentUrl = uploadData.url;
        attachmentName = file.name;
        setIsUploading(false);
      }

      const res = await addWorkflowComment({
        content: newComment,
        authorId: currentUser.id,
        authorRole: currentUser.role,
        attachmentUrl,
        attachmentName,
        annexureId,
        invoiceId,
        isPrivate,
      });

      if (res.success) {
        setNewComment("");
        setFile(null);
        setIsPrivate(false);
        fetchComments(true);
        // Force scroll to bottom after your own message
        setTimeout(scrollToBottom, 100);
      } else {
        toast.error(res.error || "Failed to add comment");
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // Minimized floating button
  if (isMinimized) {
    return (
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <Button
          size="lg"
          className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 bg-primary hover:bg-primary/90"
          onClick={() => setIsMinimized(false)}
        >
          <MessagesSquare className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-background font-bold shadow-sm">
              {unreadCount}
            </span>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 50, scale: 0.9 }}
      transition={{ type: "spring", damping: 25, stiffness: 300 }}
      className={cn(
        "fixed z-50 transition-all duration-300",
        isExpanded
          ? "inset-4 sm:inset-6"
          : "bottom-6 right-6 w-[380px] sm:w-[420px]"
      )}
    >
      <Card
        className={cn(
          "flex flex-col border border-primary glass py-0 shadow-2xl overflow-hidden bg-background/95 backdrop-blur-md bg-linear-to-br from-background/95 via-background/90 to-background/95 bg-[url('https://www.awlindia.com/assets/images/heaer-logo.webp')] bg-size-[240px] bg-center bg-no-repeat bg-blend-overlay",
          isExpanded ? "h-full" : "h-[600px]"
        )}
      >
        {/* Header */}
        <CardHeader className="p-4 pb-4! border-b bg-muted/30 flex flex-row items-center justify-between  shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10">
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-bold tracking-tight">
                Internal Discussion
              </CardTitle>
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {comments.length} messages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={() => setIsMinimized(true)}
            >
              <Minus className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 p-0 overflow-hidden relative">
          <ScrollArea 
            className="h-full" 
            ref={scrollRef}
            onScrollCapture={(e) => {
              const el = e.currentTarget.querySelector("[data-radix-scroll-area-viewport]");
              if (el) {
                const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
                if (isBottom) {
                  setShowNewMessageButton(false);
                  updateLastSeen();
                }
              }
            }}
          >
            <div className="space-y-6 p-4 pb-8">
              {isLoading && comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3">
                  <Loader2 className="w-8 h-8 animate-spin text-primary/40" />
                  <span className="text-xs font-medium text-muted-foreground/60 tracking-wider uppercase">
                    Loading conversation
                  </span>
                </div>
              ) : comments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-40">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-muted border-2 border-dashed border-border">
                    <MessagesSquare className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold">No messages yet</p>
                    <p className="text-xs">Start the discussion below</p>
                  </div>
                </div>
              ) : (
                <AnimatePresence mode="popLayout" initial={false}>
                  {comments.map((comment) => (
                    <MessageBubble
                      key={comment.id}
                      comment={comment}
                      isAuthor={comment.authorId === currentUser.id}
                      currentUserRole={currentUser.role}
                      invoiceId={invoiceId}
                      annexureId={annexureId}
                      availableRecipients={availableRecipients}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>
          </ScrollArea>

          {/* New message notification button */}
          <AnimatePresence>
            {showNewMessageButton && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10"
              >
                <Button 
                  size="sm" 
                  className="rounded-full shadow-2xl bg-primary/95 hover:bg-primary text-primary-foreground gap-2 pr-3 h-10 px-4 backdrop-blur-sm hover:scale-105 active:scale-95 transition-all border border-white/20"
                  onClick={() => scrollToBottom()}
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-white/20 shadow-inner">
                     <MessagesSquare className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold tracking-tight">
                    {unreadCount > 0 ? `${unreadCount} new messages` : "New messages below"}
                  </span>
                  <div className="animate-bounce">
                    <Minimize2 className="w-3.5 h-3.5 rotate-180" />
                  </div>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>

        {/* Input footer */}
        <CardFooter className="p-2! border-t bg-muted/20 flex flex-col gap-3 shrink-0 backdrop-blur-sm">
          {/* File preview */}
          <AnimatePresence>
            {file && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 10 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: 10 }}
                className="w-full"
              >
                <div className="flex items-center gap-3 p-3 bg-background/50 border border-primary/20 rounded-xl shadow-sm">
                  <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                    <FileIcon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{file.name}</p>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
                    onClick={() => setFile(null)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Private toggle */}
          {["BOSS", "TADMIN", "Admin"].includes(currentUser.role) && (
            <div className="flex items-center gap-2 w-full px-1">
              <Checkbox
                id="isPrivate"
                checked={isPrivate}
                onCheckedChange={(val) => setIsPrivate(!!val)}
                className="rounded border-muted-foreground/30 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
              />
              <Label
                htmlFor="isPrivate"
                className="text-[10px] font-bold text-muted-foreground/70 cursor-pointer select-none flex items-center gap-1.5 uppercase tracking-wider"
              >
                <EyeOff className="w-3 h-3" />
                Private message <span className="text-[9px] lowercase opacity-60 font-medium">(internal only)</span>
              </Label>
            </div>
          )}

          {/* Input area */}
          <div className="relative w-full flex items-end gap-2">
            <div className="relative flex-1 group">
              <Textarea
                placeholder="Type your message..."
                className="   w-full resize-none pr-12 text-sm bg-background/80 border-border/50 focus-visible:ring-primary/20 rounded-2xl shadow-inner transition-all hover:border-primary/30"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSubmitting || isUploading}
              >
                <Paperclip className="w-4 h-4" />
              </Button>
            </div>
            <Button
              size="icon"
              className="h-12 w-12 rounded-2xl shadow-lg hover:shadow-primary/30 transition-all shrink-0 bg-primary hover:bg-primary/90 active:scale-95 group"
              disabled={(!newComment.trim() && !file) || isSubmitting || isUploading}
              onClick={handleSubmit}
            >
              {isSubmitting || isUploading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
