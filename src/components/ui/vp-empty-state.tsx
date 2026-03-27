// src/components/vendor-portal/ui/vp-empty-state.tsx
import { Button } from "@/components/ui/button"
import { TablerIcon } from "@tabler/icons-react"

interface VpEmptyStateProps {
    icon: typeof TablerIcon
    title: string
    description?: string
    action?: { label: string; onClick: () => void }
}

export function VpEmptyState({ icon: Icon, title, description, action }: VpEmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
                <Icon size={28} stroke={1.5} className="text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold">{title}</h3>
            {description && (
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>
            )}
            {action && (
                <Button size="sm" className="mt-4" onClick={action.onClick}>
                    {action.label}
                </Button>
            )}
        </div>
    )
}