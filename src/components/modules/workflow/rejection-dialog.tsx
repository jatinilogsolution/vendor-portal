"use client";

import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface RejectionDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (reason: string, affectedLRs?: string) => Promise<void>;
    title: string;
    description: string;
    showAffectedLRs?: boolean;
}

export function RejectionDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    showAffectedLRs = false
}: RejectionDialogProps) {
    const [reason, setReason] = useState("");
    const [affectedLRs, setAffectedLRs] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleConfirm = async () => {
        if (!reason.trim()) {
            setError("Please provide a reason for rejection");
            return;
        }

        try {
            setIsSubmitting(true);
            setError(null);
            await onConfirm(reason, showAffectedLRs ? affectedLRs : undefined);
            setReason("");
            setAffectedLRs("");
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to reject. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="reason" className="text-sm font-medium">
                            Reason for Rejection <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="reason"
                            placeholder="Explain why this is being rejected..."
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>

                    {showAffectedLRs && (
                        <div className="grid gap-2">
                            <Label htmlFor="affectedLRs" className="text-sm font-medium">
                                Affected LR Numbers (Optional)
                            </Label>
                            <Input
                                id="affectedLRs"
                                placeholder="e.g. LR123, LR456"
                                value={affectedLRs}
                                onChange={(e) => setAffectedLRs(e.target.value)}
                            />
                            <p className="text-[10px] text-muted-foreground">
                                Specify which LRs have issues if it's not the whole group.
                            </p>
                        </div>
                    )}

                    {error && (
                        <Alert variant="destructive" className="py-2">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription className="text-xs">{error}</AlertDescription>
                        </Alert>
                    )}
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Rejecting..." : "Confirm Rejection"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
