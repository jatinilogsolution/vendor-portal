
"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Mail, Send } from "lucide-react";
import { sendManualNotification } from "@/app/(private)/invoices/_action/manual-workflow.action";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

interface ManualNotificationDialogProps {
    recipientEmail: string;
    recipientId?: string;
    entityName: string;
    path?: string;
    trigger?: React.ReactNode;
}

export function ManualNotificationDialog({
    recipientEmail,
    recipientId,
    entityName,
    path,
    trigger
}: ManualNotificationDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(`Regarding ${entityName}`);
    const [type, setType] = useState("NOTICE");
    const [description, setDescription] = useState("");

    const handleSend = async () => {
        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in all fields");
            return;
        }

        try {
            setIsLoading(true);
            const res = await sendManualNotification({
                to: recipientEmail,
                recipientId,
                title,
                description,
                type,
                path
            });

            if (res.success) {
                toast.success("Notification sent successfully");
                setOpen(false);
                setDescription("");
            } else {
                toast.error(res.error || "Failed to send notification");
            }
        } catch (error) {
            toast.error("An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline" size="sm" className="gap-2">
                        <Mail className="w-4 h-4" />
                        Send Notification
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Mail className="w-5 h-5 text-primary" />
                        Send Manual Notification
                    </DialogTitle>
                    <DialogDescription>
                        Send a custom email notification to {recipientEmail}.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="to">Recipient</Label>
                        <Input id="to" value={recipientEmail} disabled className="bg-muted" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type">Notification Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="NOTICE">Notice</SelectItem>
                                    <SelectItem value="REJECTION">Rejection</SelectItem>
                                    <SelectItem value="ERROR">Error</SelectItem>
                                    <SelectItem value="URGENT">Urgent</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title / Subject</Label>
                            <Input
                                id="title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Email subject"
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description / Message Body</Label>
                        <Textarea
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Type your message here..."
                            className="min-h-[150px] resize-none"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSend} disabled={isLoading} className="gap-2">
                        {isLoading ? <Spinner className="w-4 h-4" /> : <Send className="w-4 h-4" />}
                        Send Now
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
