// components/annexure/UploadExtraAttachment.tsx
"use client"

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dropzone, DropzoneContent, DropzoneEmptyState } from "@/components/ui/shadcn-io/dropzone";
import { uploadAttachmentToAzure } from "@/services/azure-blob";
import { toast } from "sonner";

export default function UploadExtraAttachment({ fileNumber }: { fileNumber: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDrop = (files: File[]) => setFile(files[0] || null);

  const handleUpload = async () => {
    if (!file) return toast.error("Select file");
    setLoading(true);
    try {
      const name = `extra/${fileNumber}/${file.name}`;
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadAttachmentToAzure(name, fd);

      const res = await fetch("/api/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: "extra-cost",
          url,
          linkedId: fileNumber,
          description: `Extra cost proof for ${fileNumber}`,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save document");
      toast.success("Attachment uploaded");
      setFile(null);
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Dropzone onDrop={handleDrop} maxFiles={1} maxSize={10 * 1024 * 1024}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      <Button onClick={handleUpload} disabled={!file || loading}>{loading ? "Uploading..." : "Upload Extra"}</Button>
    </div>
  );
}
