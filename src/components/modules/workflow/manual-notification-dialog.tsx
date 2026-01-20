
"use client";

import { useState, useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { 
    Mail, 
    Send, 
    X, 
    MessageSquare, 
    AlertTriangle, 
    Clock, 
    FileText as FileIcon, 
    XCircle, 
    AlertCircle,
    Plus 
} from "lucide-react";
import { sendManualNotification } from "@/app/(private)/invoices/_action/manual-workflow.action";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

import { UserRoleEnum } from "@/utils/constant";

interface ManualNotificationDialogProps {
    recipientEmail?: string;
    recipientId?: string;
    entityName: string;
    path?: string;
    trigger?: React.ReactNode;
    currentUserRole: string;
    availableRecipients?: Array<{ email: string; name: string; id?: string }>;
    defaultDescription?: string;
}

export function ManualNotificationDialog({
    recipientEmail: initialRecipientEmail,
    recipientId: initialRecipientId,
    entityName,
    path,
    trigger,
    currentUserRole,
    availableRecipients = [],
    defaultDescription = ""
}: ManualNotificationDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [title, setTitle] = useState(`Regarding ${entityName}`);
    const [type, setType] = useState("NOTICE");
    const [description, setDescription] = useState(defaultDescription);
    const [selectedEmails, setSelectedEmails] = useState<string[]>(initialRecipientEmail ? [initialRecipientEmail] : []);
    const [extraEmails, setExtraEmails] = useState("");
    const [notifyBoss, setNotifyBoss] = useState(false);
    const [notifyTAdmin, setNotifyTAdmin] = useState(false);
    const [notifyVendor, setNotifyVendor] = useState(false);
    const [isManualEmail, setIsManualEmail] = useState(!initialRecipientEmail && availableRecipients.length === 0);

    const isVendor = currentUserRole === UserRoleEnum.TVENDOR;
    const isAdmin = [UserRoleEnum.BOSS, UserRoleEnum.TADMIN].includes(currentUserRole as any);

    // Notification types based on role
    const typeOptions = isVendor 
        ? [
            { value: "QUERY", label: "Query", icon: <MessageSquare className="w-3.5 h-3.5" /> },
            { value: "DISPUTE", label: "Dispute", icon: <AlertTriangle className="w-3.5 h-3.5" /> },
            { value: "UPDATE", label: "Update", icon: <Clock className="w-3.5 h-3.5" /> },
          ]
        : [
            { value: "NOTICE", label: "Notice", icon: <FileIcon className="w-3.5 h-3.5" /> },
            { value: "REJECTION", label: "Rejection", icon: <XCircle className="w-3.5 h-3.5" /> },
            { value: "ERROR", label: "Error", icon: <AlertCircle className="w-3.5 h-3.5" /> },
          ];

    // Sync state when props or open state changes
    useEffect(() => {
        if (open) {
            setDescription(defaultDescription);
            setExtraEmails("");
            setNotifyBoss(false);
            setNotifyTAdmin(false);
            setNotifyVendor(false);
            setType(isVendor ? "QUERY" : "NOTICE");
            if (initialRecipientEmail) {
                setSelectedEmails([initialRecipientEmail]);
                setIsManualEmail(false);
            } else if (availableRecipients.length > 0) {
                setSelectedEmails([]);
                setIsManualEmail(false);
            } else {
                setIsManualEmail(true);
            }
        }
    }, [open, defaultDescription, initialRecipientEmail, availableRecipients, isVendor]);

    const recipientLabel = isVendor ? "Internal Notification" : "Select Recipients";

    const handleSend = async () => {
        if (!isVendor && !notifyBoss && !notifyTAdmin && !notifyVendor && !selectedEmails.length && !extraEmails.trim()) {
            toast.error("Please select at least one recipient or group");
            return;
        }

        if (!title.trim() || !description.trim()) {
            toast.error("Please fill in subject and message");
            return;
        }

        try {
            setIsLoading(true);
            
            const res = await sendManualNotification({
                to: selectedEmails.join(','),
                extraEmails: extraEmails,
                notifyInternal: isVendor, // Vendors always notify internal
                notifyBoss,
                notifyTAdmin,
                notifyVendor,
                recipientId: initialRecipientId, 
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
                    <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                        <Mail className="w-5 h-5 text-primary" />
                        Send Notification
                    </DialogTitle>
                    <DialogDescription>
                        Send a custom email notification regarding <strong>{entityName}</strong>.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-5 py-4">
                    {isVendor ? (
                        <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-center gap-3">
                            <div className="bg-primary/10 p-2 rounded-full">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-semibold">Recipient: All Admins & Boss</span>
                                <span className="text-xs text-muted-foreground">This message will be broadcasted to all internal management users.</span>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 bg-muted/30 p-4 rounded-xl border">
                            <div className="grid gap-3">
                                <Label className="text-[11px] font-bold opacity-70 uppercase tracking-widest px-1">Broadcast To Groups</Label>
                                <div className="flex flex-wrap gap-4 px-1">
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="groupBoss" checked={notifyBoss} onCheckedChange={(v) => setNotifyBoss(!!v)} className="data-[state=checked]:bg-primary" />
                                        <Label htmlFor="groupBoss" className="text-xs font-medium cursor-pointer">Boss Users</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="groupTadmin" checked={notifyTAdmin} onCheckedChange={(v) => setNotifyTAdmin(!!v)} className="data-[state=checked]:bg-primary" />
                                        <Label htmlFor="groupTadmin" className="text-xs font-medium cursor-pointer">TAdmin Users</Label>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Checkbox id="groupVendor" checked={notifyVendor} onCheckedChange={(v) => setNotifyVendor(!!v)} className="data-[state=checked]:bg-primary" />
                                        <Label htmlFor="groupVendor" className="text-xs font-medium cursor-pointer">Linked Vendor</Label>
                                    </div>
                                </div>
                            </div>

                            <Separator className="opacity-50" />

                            <div className="grid gap-2">
                                <div className="flex items-center justify-between px-1">
                                    <Label className="text-[11px] font-bold opacity-70 uppercase tracking-widest">Individual Recipients</Label>
                                    {availableRecipients.length > 0 && (
                                        <Button 
                                            variant="link" 
                                            className="h-auto p-0 text-[10px] uppercase font-bold hover:no-underline text-primary"
                                            onClick={() => setIsManualEmail(!isManualEmail)}
                                        >
                                            {isManualEmail ? "Select from list" : "Custom Email"}
                                        </Button>
                                    )}
                                </div>
                                
                                {!isManualEmail && availableRecipients.length > 0 ? (
                                    <div className="grid gap-2">
                                        {selectedEmails.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5 p-2 bg-background border rounded-lg">
                                                {selectedEmails.map(email => (
                                                    <Badge key={email} variant="outline" className="flex items-center gap-1 text-[10px] bg-background">
                                                        {email}
                                                        <X className="w-2 h-2 cursor-pointer" onClick={() => setSelectedEmails(prev => prev.filter(e => e !== email))} />
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
                                        <Select 
                                            onValueChange={(val) => {
                                                if (!selectedEmails.includes(val)) setSelectedEmails(prev => [...prev, val]);
                                            }}
                                        >
                                            <SelectTrigger className="w-full bg-background border-primary/10 h-9">
                                                <SelectValue placeholder="Add recipient from list..." />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {availableRecipients.map((r, i) => (
                                                    <SelectItem key={i} value={r.email} disabled={selectedEmails.includes(r.email)}>
                                                        <div className="flex flex-col items-start gap-0.5">
                                                            <span className="font-medium text-xs">{r.name}</span>
                                                            <span className="text-[10px] opacity-60">{r.email}</span>
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                ) : (
                                    <Input 
                                        id="to" 
                                        value={selectedEmails.join(',')} 
                                        onChange={(e) => setSelectedEmails(e.target.value.split(',').map(s => s.trim()))}
                                        placeholder="Enter comma-separated emails..."
                                        className="bg-background border-primary/10 focus-visible:ring-primary/20 h-9 text-sm" 
                                    />
                                )}
                            </div>

                            <div className="grid gap-1.5 px-1">
                                <Label htmlFor="extra" className="text-[11px] font-bold opacity-70 uppercase tracking-tight flex items-center gap-1.5">
                                    <Plus className="w-3 h-3" />
                                    Extra Emails
                                </Label>
                                <Input 
                                    id="extra"
                                    value={extraEmails}
                                    onChange={(e) => setExtraEmails(e.target.value)}
                                    placeholder="e.g. boss@company.com, admin@company.com"
                                    className="bg-background border-primary/10 h-8 text-xs focus-visible:ring-primary/20"
                                />
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="type" className="text-sm font-semibold">Notification Type</Label>
                            <Select value={type} onValueChange={setType}>
                                <SelectTrigger id="type" className="bg-muted/50 border-primary/10 h-10">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {typeOptions.map((opt) => (
                                        <SelectItem key={opt.value} value={opt.value}>
                                            <div className="flex items-center gap-2">
                                                {opt.icon}
                                                <span>{opt.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
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
