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

interface Props {
  userName: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isBanning: boolean;
}

export function BanUserDialog({
  userName,
  isOpen,
  onClose,
  onConfirm,
  isBanning,
}: Props) {
  const [reason, setReason] = useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Ban {userName}</DialogTitle>
          <DialogDescription>
            Are you sure you want to ban this user? They will lose access to the
            portal immediately.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <label htmlFor="reason" className="text-sm font-medium">
              Reason for banning
            </label>
            <Textarea
              id="reason"
              placeholder="Enter reason for banning..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="h-24"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isBanning}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!reason.trim() || isBanning}
          >
            {isBanning ? "Banning..." : "Confirm Ban"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
