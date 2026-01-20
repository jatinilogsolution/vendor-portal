"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { CloudUpload, X, Trash, FileText, RefreshCw, Eye } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { uploadAttachmentToAzure, deleteAttachmentFromAzure } from "@/services/azure-blob";
import { upsertDocument } from "@/app/(private)/profile/_action/document";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";

import {
    FileUpload,
    FileUploadDropzone,
    FileUploadItem,
    FileUploadItemDelete,
    FileUploadItemMetadata,
    FileUploadItemPreview,
    FileUploadList,
    FileUploadTrigger,
} from "@/components/ui/file-upload";

const formSchema = z.object({
    files: z
        .array(z.custom<File>())
        .min(1, "Please select a file")
        .max(1, "Please select only 1 file")
        .refine((files) => files.every((file) => file.size <= 5 * 1024 * 1024), {
            message: "File size must be less than 5MB",
            path: ["files"],
        }),
});

type FormValues = z.infer<typeof formSchema>;

interface DocumentUploadProps {
    linkedId: string;
    linkedCode: string; // e.g., "PAN_CARD"
    label: string;      // e.g., "PAN Card"
    description?: string;
    existingDoc?: {
        url: string;
        id: string;
        label?: string;
    } | null;
    onUploadComplete?: (url: string) => void;
    entryBy: string;
    readOnly?: boolean;
}

export default function DocumentUpload({
    linkedId,
    linkedCode,
    label,
    description,
    existingDoc,
    onUploadComplete,
    entryBy,
    readOnly = false
}: DocumentUploadProps) {
    const [isReplacing, setIsReplacing] = React.useState(false);
    const [currentDoc, setCurrentDoc] = React.useState(existingDoc);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            files: [],
        },
    });

    // Update local state if prop changes
    React.useEffect(() => {
        setCurrentDoc(existingDoc);
    }, [existingDoc]);

    const onSubmit = async (data: FormValues) => {
        if (data.files.length === 0) return;

        toast.loading(`Uploading ${label}...`, { id: "upload" });

        try {
            const file = data.files[0];
            const formData = new FormData();
            formData.append("file", file);

            // Create a unique path: vendor-docs/{linkedId}/{linkedCode}_{timestamp}_{filename}
            const azurePath = `user/vendor-docs/${linkedId}/${linkedCode}_${Date.now()}_${file.name}`;

            const url = await uploadAttachmentToAzure(azurePath, formData);

            // Save metadata to DB
            const result = await upsertDocument({
                linkedId,
                linkedCode,
                url,
                label,
                description,
                entryBy
            });

            if (!result.success) {
                throw new Error(result.error);
            }

            setCurrentDoc({
                url,
                id: result.document!.id,
                label: result.document!.label
            });

            setIsReplacing(false);
            form.reset();

            if (onUploadComplete) {
                onUploadComplete(url);
            }

            toast.success(`${label} uploaded successfully!`, { id: "upload" });

        } catch (err) {
            console.error(err);
            toast.error("Upload failed", { id: "upload" });
        }
    };

    // If we have an existing document and we are not replacing it, show the "View" state
    if (currentDoc && !isReplacing) {
        return (
            <div className="border rounded-lg p-4 space-y-3 bg-card">
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                            <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h4 className="font-medium">{label}</h4>
                            <p className="text-sm text-muted-foreground">
                                {description || "Document uploaded"}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" asChild>
                            <a href={currentDoc.url} target="_blank" rel="noopener noreferrer" className="gap-2">
                                <Eye className="h-4 w-4" />
                                View
                            </a>
                        </Button>
                        {!readOnly && (
                            <Button variant="ghost" size="sm" onClick={() => setIsReplacing(true)} className="gap-2">
                                <RefreshCw className="h-4 w-4" />
                                Replace
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    if (readOnly) {
        return (
            <div className="border rounded-lg p-4 bg-card opacity-60">
                <div className="mb-4">
                    <h4 className="font-medium">{label}</h4>
                    <p className="text-sm text-muted-foreground">Not uploaded</p>
                </div>
            </div>
        )
    }

    return (
        <div className="border rounded-lg p-4 bg-card">
            <div className="mb-4">
                <h4 className="font-medium">{label}</h4>
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
            </div>

            <Form {...form}>
                <div className="w-full">
                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <FileUpload
                                        value={field.value}
                                        onValueChange={field.onChange}
                                        accept="image/*,application/pdf"
                                        maxFiles={1}
                                        maxSize={5 * 1024 * 1024}
                                        onFileReject={(_, message) => {
                                            form.setError("files", { message });
                                        }}
                                    >
                                        <FileUploadDropzone className="flex-col gap-2 border-dashed h-32">
                                            <CloudUpload className="size-8 text-muted-foreground" />
                                            <div className="text-center">
                                                <p className="text-sm font-medium">Drag & drop or click to upload</p>
                                                <p className="text-xs text-muted-foreground">PDF or Image up to 5MB</p>
                                            </div>
                                            <FileUploadTrigger asChild>
                                                <Button variant="link" size="sm" className="hidden">
                                                    choose files
                                                </Button>
                                            </FileUploadTrigger>
                                        </FileUploadDropzone>

                                        <FileUploadList>
                                            {field.value.map((file, index) => (
                                                <FileUploadItem key={index} value={file}>
                                                    <FileUploadItemPreview />
                                                    <FileUploadItemMetadata />
                                                    <FileUploadItemDelete asChild>
                                                        <Button variant="ghost" size="icon" className="size-7">
                                                            <X />
                                                        </Button>
                                                    </FileUploadItemDelete>
                                                </FileUploadItem>
                                            ))}
                                        </FileUploadList>
                                    </FileUpload>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end gap-2 mt-4">
                        {isReplacing && (
                            <Button type="button" variant="ghost" onClick={() => setIsReplacing(false)}>
                                Cancel
                            </Button>
                        )}
                        <Button
                            type="button"
                            onClick={form.handleSubmit(onSubmit)}
                            disabled={form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Uploading..." : "Upload"}
                        </Button>
                    </div>
                </div>
            </Form>
        </div>
    );
}
