"use client";

import { useState, useEffect, useRef } from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
    MessageSquare,
    Send,
    User,
    Clock,
    MoreHorizontal,
    X,
    Minus,
    Maximize2,
    Paperclip,
    FileText as FileIcon,
    Lock,
    EyeOff,
    Mail
} from "lucide-react";
import { addWorkflowComment, getWorkflowComments, sendCommentAsEmail } from "@/app/(private)/lorries/_action/workflow-comments.action";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserRoleEnum, InvoiceStatus } from "@/utils/constant";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { cn } from "@/lib/utils";
import { WorkflowPDFViewer } from "./workflow-pdf-viewer";

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

interface WorkflowCommentsProps {
    annexureId?: string;
    invoiceId?: string;
    currentUser: {
        id: string;
        name: string;
        role: string;
    };
    initiallyMinimized?: boolean;
}

export function WorkflowComments({ annexureId, invoiceId, currentUser, initiallyMinimized = true }: WorkflowCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMinimized, setIsMinimized] = useState(initiallyMinimized);
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
     const fileInputRef = useRef<HTMLInputElement>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchComments = async () => {
        try {
            const res = await getWorkflowComments({ annexureId, invoiceId, role: currentUser.role });
            if (res.success && res.data) {
                setComments(res.data as any);
            }
        } catch (error) {
            console.error("Failed to fetch comments", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchComments();
        const interval = setInterval(fetchComments, 10000); // Poll every 10 seconds for more "real-time" feel
        return () => clearInterval(interval);
    }, [annexureId, invoiceId]);

    useEffect(() => {
        if (scrollRef.current && !isMinimized) {
            const scrollContainer = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    }, [comments, isMinimized]);

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
                formData.append("path", "workflow/comments");

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
                isPrivate
            });

            if (res.success) {
                setNewComment("");
                setFile(null);
                fetchComments();
            } else {
                toast.error(res.error || "Failed to add comment");
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "An unexpected error occurred");
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

    if (isMinimized) {
        return (
            <div className="fixed bottom-6 right-6 z-50">
                <Button
                    size="icon"
                    className="h-14 w-14 rounded-full shadow-2xl hover:scale-105 transition-transform"
                    onClick={() => setIsMinimized(false)}
                >
                    <MessageSquare className="h-6 w-6" />
                    {comments.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] h-5 w-5 rounded-full flex items-center justify-center border-2 border-background">
                            {comments.length}
                        </span>
                    )}
                </Button>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] animate-in slide-in-from-bottom-5">
            <Card className="h-[550px] flex flex-col shadow-2xl border-primary/20 bg-background/95 backdrop-blur-sm">
                <CardHeader className="p-4 border-b bg-muted/40 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-semibold flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Internal Discussion
                    </CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => setIsMinimized(true)}
                        >
                            <Minus className="w-4 h-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 p-0 overflow-hidden">
                    <ScrollArea className="h-full px-4" ref={scrollRef}>
                        <div className="space-y-4 py-4">
                            {isLoading ? (
                                <div className="flex justify-center p-8">
                                    <Spinner className="w-6 h-6" />
                                </div>
                            ) : comments.length === 0 ? (
                                <div className="text-center py-12 text-muted-foreground italic text-sm">
                                    No messages yet. Start the conversation.
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div
                                        key={comment.id}
                                        className={cn(
                                            "flex flex-col gap-1",
                                            comment.authorId === currentUser.id ? 'items-end' : 'items-start',
                                            comment.isPrivate ? 'opacity-80' : ''
                                        )}
                                    >
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[10px] font-medium text-muted-foreground">
                                                {comment.authorId === currentUser.id ? 'You' : comment.Author.name}
                                            </span>
                                            <Badge variant="outline" className="text-[9px] py-0 px-1 font-normal opacity-70">
                                                {comment.authorRole}
                                            </Badge>
                                            {comment.isPrivate && (
                                                <Badge variant="secondary" className="text-[8px] py-0 px-1 bg-amber-100 text-amber-800 border-amber-200">
                                                    <Lock className="w-2 h-2 mr-1" />
                                                    PRIVATE
                                                </Badge>
                                            )}
                                        </div>
                                        <div
                                            className={cn(
                                                "max-w-[85%] p-3 rounded-2xl text-sm shadow-sm",
                                                comment.authorId === currentUser.id
                                                    ? 'bg-primary text-primary-foreground rounded-tr-none'
                                                    : 'bg-muted rounded-tl-none'
                                            )}
                                        >
                                            <div className="whitespace-pre-wrap wrap-reak-words">
                                                {comment.content.split(/(\[.*?\]\(.*?\))/g).map((part, idx) => {
                                                    // Match [text](url) pattern
                                                    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
                                                    if (linkMatch) {
                                                        const [, text, url] = linkMatch;
                                                        return (
                                                            <a
                                                                key={idx}
                                                                href={url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={cn(
                                                                    "font-semibold underline underline-offset-2 hover:opacity-80 transition-opacity inline-flex items-center gap-1",
                                                                    comment.authorId === currentUser.id
                                                                        ? "text-primary-foreground"
                                                                        : "text-primary"
                                                                )}
                                                            >
                                                                {text}
                                                                <svg className="w-3 h-3 inline ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                                                </svg>
                                                            </a>
                                                        );
                                                    }
                                                    return <span key={idx}>{part}</span>;
                                                })}
                                            </div>

                                            {comment.attachmentUrl && (
                                                <div className={cn(
                                                    "mt-2 pt-2 border-t flex items-center gap-2",
                                                    comment.authorId === currentUser.id ? "border-primary-foreground/20" : "border-muted-foreground/20"
                                                )}>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-2 text-[11px] truncate font-medium">
                                                            <FileIcon className="w-3 h-3 shrink-0" />
                                                            <span className="truncate">{comment.attachmentName}</span>
                                                        </div>
                                                    </div>
                                                    {comment.attachmentName?.toLowerCase().endsWith('.pdf') ? (
                                                        <WorkflowPDFViewer
                                                            url={comment.attachmentUrl}
                                                            title={comment.attachmentName}
                                                            trigger={
                                                                <Button
                                                                    variant="secondary"
                                                                    size="icon"
                                                                    className="h-6 w-6 rounded-full shrink-0"
                                                                >
                                                                    <Maximize2 className="w-3 h-3" />
                                                                </Button>
                                                            }
                                                        />
                                                    ) : (
                                                        <Button
                                                            variant="secondary"
                                                            size="icon"
                                                            className="h-6 w-6 rounded-full shrink-0"
                                                            asChild
                                                        >
                                                            <a href={comment.attachmentUrl} target="_blank" rel="noopener noreferrer">
                                                                <Maximize2 className="w-3 h-3" />
                                                            </a>
                                                        </Button>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-1 mt-0.5 px-1">
                                            <Clock className="w-2.5 h-2.5 text-muted-foreground/50" />
                                            <span className="text-[9px] text-muted-foreground/50">
                                                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                            </span>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-5 w-5 rounded-full text-muted-foreground/40 hover:text-primary transition-colors ml-1"
                                                title="Send as Email Notification"
                                                onClick={async () => {
                                                    const roleToNotify = currentUser.role === UserRoleEnum.TVENDOR ? UserRoleEnum.TADMIN : UserRoleEnum.TVENDOR;
                                                    const res = await sendCommentAsEmail({
                                                        commentId: comment.id,
                                                        userId: currentUser.id,
                                                        recipientRole: roleToNotify
                                                    });
                                                    if (res.success) {
                                                        toast.success("Notification sent via email");
                                                    } else {
                                                        toast.error("Failed to send email notification");
                                                    }
                                                }}
                                            >
                                                <Mail className="w-2.5 h-2.5" />
                                            </Button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="p-4 border-t bg-muted/20 flex flex-col gap-2">
                    {file && (
                        <div className="w-full flex items-center justify-between bg-background p-2 rounded-lg border text-xs gap-2 mb-2 animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center gap-2 min-w-0">
                                <FileIcon className="w-3 h-3 text-primary" />
                                <span className="truncate font-medium">{file.name}</span>
                                <span className="text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-5 w-5 rounded-full"
                                onClick={() => setFile(null)}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    )}

                    {/* Private Toggle for Admins */}
                    {[UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(currentUser.role as UserRoleEnum) && (
                        <div className="flex items-center gap-2 mb-2 px-1">
                            <Checkbox
                                id="isPrivate"
                                checked={isPrivate}
                                onCheckedChange={(val) => setIsPrivate(!!val)}
                            />
                            <Label
                                htmlFor="isPrivate"
                                className="text-[10px] text-muted-foreground uppercase tracking-wider font-semibold cursor-pointer select-none flex items-center gap-1"
                            >
                                <EyeOff className="w-3 h-3" />
                                Private <span className="text-[8px] opacity-70 font-normal">(Internal Discussion Only)</span>
                            </Label>
                        </div>
                    )}

                    <div className="relative w-full flex items-end gap-2">
                        <div className="relative flex-1">
                            <Textarea
                                placeholder="Type a message..."
                                className="min-h-[80px] w-full resize-none pr-10 text-sm bg-background/50 focus-visible:ring-primary/20"
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSubmit();
                                    }
                                }}
                            />
                            <div className="absolute top-2 right-2 flex flex-col gap-1">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-7 w-7 rounded-sm text-muted-foreground hover:text-primary transition-colors"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSubmitting || isUploading}
                                >
                                    <Paperclip className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                        <Button
                            size="icon"
                            className="h-10 w-10 rounded-xl shadow-lg hover:shadow-primary/20 transition-all shrink-0"
                            disabled={(!newComment.trim() && !file) || isSubmitting || isUploading}
                            onClick={handleSubmit}
                        >
                            {isSubmitting || isUploading ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}

