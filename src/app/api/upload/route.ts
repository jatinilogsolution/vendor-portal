import { deleteAttachmentFromAzure, uploadAttachmentToAzure } from "@/services/azure-blob";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const formData = await req.formData();
        const path = formData.get("path") as string;

        if (!path) {
            return NextResponse.json({ error: "Path is required" }, { status: 400 });
        }

        const url = await uploadAttachmentToAzure(path, formData);
        return NextResponse.json({ url });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }
};

export const DELETE = async (req: NextRequest) => {
    try {
        const { searchParams } = new URL(req.url);
        const fileUrl = searchParams.get("url");

        if (!fileUrl) {
            return NextResponse.json({ error: "URL is required" }, { status: 400 });
        }

        await deleteAttachmentFromAzure(fileUrl);
        return NextResponse.json({ message: "File deleted successfully" });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
};
