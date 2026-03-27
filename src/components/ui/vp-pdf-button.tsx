// src/components/vendor-portal/ui/vp-pdf-button.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { IconDownload } from "@tabler/icons-react"
import { toast } from "sonner"

interface VpPdfButtonProps {
    label?: string
    filename: string
    onGenerate: () => Promise<void>
    variant?: "outline" | "default" | "ghost"
    size?: "sm" | "default"
}

export function VpPdfButton({
    label = "Download PDF",
    filename,
    onGenerate,
    variant = "outline",
    size = "sm",
}: VpPdfButtonProps) {
    const [loading, setLoading] = useState(false)

    const handle = async () => {
        setLoading(true)
        try {
            await onGenerate()
        } catch {
            toast.error("Failed to generate PDF")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant={variant} size={size} onClick={handle} disabled={loading}>
            <IconDownload size={14} className="mr-1.5" />
            {loading ? "Generating…" : label}
        </Button>
    )
}