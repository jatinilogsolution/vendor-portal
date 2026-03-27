// src/components/vendor-portal/ui/vp-page-header.tsx
import { Separator } from "@/components/ui/separator"

interface VpPageHeaderProps {
    title: string
    description?: string
    actions?: React.ReactNode
}

export function VpPageHeader({ title, description, actions }: VpPageHeaderProps) {
    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                    {description && (
                        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                    )}
                </div>
                {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
            </div>
            <Separator />
        </div>
    )
}