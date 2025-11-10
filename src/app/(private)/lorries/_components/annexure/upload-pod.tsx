// components/annexure/UploadPod.tsx
"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { uploadAttachmentToAzure, deleteAttachmentFromAzure } from "@/services/azure-blob";
import { toast } from "sonner";
import { Upload, Eye } from "lucide-react";

export default function UploadPod({ lrNumber, initialFileUrl, fileNumber }: { lrNumber: string; initialFileUrl?: string | null; fileNumber?: string | null; }) {
  const [fileUrl, setFileUrl] = useState<string | null>(initialFileUrl ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleDrop = (files: File[]) => setFile(files[0] || null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return toast.error("Select file");
    setLoading(true);
    try {
      const name = `pod/${fileNumber ?? "nofile"}/${lrNumber}-${file.name}`;
      if (fileUrl) await deleteAttachmentFromAzure(fileUrl);
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadAttachmentToAzure(name, fd);
      // call your action to link pod to LR in DB
      await fetch("/api/lorries/attachPod", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lrNumber, fileNumber, url }) });
      setFileUrl(url);
      toast.success("POD uploaded");
      setOpen(false);
      setFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex gap-2">
        {fileUrl ? (
          <Button variant="outline" size="sm" onClick={() => window.open(fileUrl!, "_blank")}>
            <Eye size={14} /> View
          </Button>
        ) : (
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <Upload size={14} /> Upload POD
          </Button>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[520px]">
          <DialogHeader>
            <DialogTitle>Upload POD for {lrNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <Dropzone onDrop={handleDrop} maxFiles={1} maxSize={10 * 1024 * 1024}>
              <DropzoneEmptyState />
              <DropzoneContent />
            </Dropzone>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!file || loading}>{loading ? "Uploading..." : "Upload"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
