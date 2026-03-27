// src/components/vendor-portal/ui/vp-stat-card.tsx
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TablerIcon } from "@tabler/icons-react"

interface VpStatCardProps {
    title: string
    value: number | string
    icon: typeof TablerIcon
    description?: string
    href?: string
    variant?: "default" | "warning" | "success" | "danger" | "info"
}

const VARIANT_STYLES = {
    default: "bg-slate-50 text-slate-600 dark:bg-slate-800",
    warning: "bg-amber-50 text-amber-600 dark:bg-amber-900/30",
    success: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30",
    danger: "bg-red-50 text-red-600 dark:bg-red-900/30",
    info: "bg-blue-50 text-blue-600 dark:bg-blue-900/30",
}

export function VpStatCard({
    title, value, icon: Icon, description, href, variant = "default",
}: VpStatCardProps) {
    const inner = (
        <Card className={cn("transition-shadow", href && "hover:shadow-md cursor-pointer")}>
            <CardContent className="flex items-center gap-4 p-5">
                <div className={cn("rounded-lg p-3", VARIANT_STYLES[variant])}>
                    <Icon size={22} stroke={1.5} />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                    {description && (
                        <p className="mt-0.5 truncate text-xs text-muted-foreground">{description}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
    return href ? <Link href={href}>{inner}</Link> : inner
}