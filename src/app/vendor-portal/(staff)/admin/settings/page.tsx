// src/app/vendor-portal/(admin)/admin/settings/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { IconSettings, IconRefresh, IconDeviceFloppy } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
    Card, CardContent, CardDescription,
    CardHeader, CardTitle,
} from "@/components/ui/card"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { vpSettingSchema, VpSettingValues } from "@/validations/vp/delivery"
import {
    getVpSettings, upsertVpSetting,
    seedDefaultVpSettings, VpSettingRow,
} from "@/actions/vp/settings.action"

// ── Group settings by category ─────────────────────────────────

type GroupedSettings = Record<string, VpSettingRow[]>

function groupByCategory(rows: VpSettingRow[]): GroupedSettings {
    return rows.reduce<GroupedSettings>((acc, row) => {
        if (!acc[row.category]) acc[row.category] = []
        acc[row.category].push(row)
        return acc
    }, {})
}

const CATEGORY_LABELS: Record<string, string> = {
    GENERAL: "General",
    APPROVAL: "Approval Workflow",
    PAYMENT: "Payment",
    EMAIL: "Email Notifications",
}

// ── Inline editable setting row ────────────────────────────────

function SettingRow({
    setting, onSave,
}: {
    setting: VpSettingRow
    onSave: (id: string, values: VpSettingValues) => Promise<void>
}) {
    const [editing, setEditing] = useState(false)
    const [isPending, startTransition] = useTransition()

    const form = useForm<VpSettingValues>({
        resolver: zodResolver(vpSettingSchema),
        defaultValues: {
            category: setting.category,
            name: setting.name,
            value: setting.value ?? "",
            description: setting.description ?? "",
        },
    })

    const handleSave = (values: VpSettingValues) => {
        startTransition(async () => {
            await onSave(setting.id, values)
            setEditing(false)
        })
    }

    if (!editing) {
        return (
            <div className="flex items-center justify-between rounded-md border bg-muted/20 px-4 py-3">
                <div className="min-w-0">
                    <div className="flex items-center gap-2">
                        <code className="text-xs font-mono text-muted-foreground">{setting.name}</code>
                        {setting.value === "true" && (
                            <Badge variant="secondary" className="text-[10px]">Enabled</Badge>
                        )}
                        {setting.value === "false" && (
                            <Badge variant="outline" className="text-[10px]">Disabled</Badge>
                        )}
                    </div>
                    {setting.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground">{setting.description}</p>
                    )}
                    <p className="mt-1 text-sm font-medium">
                        {setting.value || <span className="text-muted-foreground italic">Not set</span>}
                    </p>
                </div>
                <Button
                    variant="ghost" size="sm" className="ml-3 shrink-0"
                    onClick={() => setEditing(true)}
                >
                    Edit
                </Button>
            </div>
        )
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(handleSave)}
                className="rounded-md border bg-background p-4 space-y-3 shadow-sm"
            >
                <div className="flex items-center justify-between">
                    <code className="text-xs font-mono text-muted-foreground">{setting.name}</code>
                    <Badge variant="outline" className="text-[10px]">Editing</Badge>
                </div>

                <FormField control={form.control} name="value" render={({ field }) => (
                    <FormItem>
                        <FormLabel className="text-xs">Value</FormLabel>
                        <FormControl>
                            {setting.name.includes("days") || setting.name.includes("number")
                                ? <Input type="number" className="h-8 text-sm" {...field} />
                                : setting.name.includes("description") || setting.name.includes("terms")
                                    ? <Textarea rows={2} className="text-sm" {...field} />
                                    : <Input className="h-8 text-sm" {...field} />
                            }
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />

                <div className="flex items-center gap-2 justify-end">
                    <Button
                        type="button" variant="ghost" size="sm"
                        onClick={() => { setEditing(false); form.reset() }}
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" size="sm" disabled={isPending}>
                        <IconDeviceFloppy size={14} className="mr-1.5" />
                        {isPending ? "Saving…" : "Save"}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

// ── Page ───────────────────────────────────────────────────────

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<GroupedSettings>({})
    const [loading, setLoading] = useState(true)
    // const [isPending, startTransition] = useTransition()

    const load = useCallback(async () => {
        setLoading(true)
        // Seed defaults first
        await seedDefaultVpSettings()
        const res = await getVpSettings()
        if (!res.success) { toast.error(res.error); setLoading(false); return }
        setSettings(groupByCategory(res.data))
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [])

    const handleSave = async (_id: string, values: VpSettingValues) => {
        const res = await upsertVpSetting(values)
        if (!res.success) { toast.error(res.error); return }
        toast.success("Setting saved")
        load()
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Portal Settings"
                description="Configure portal-wide defaults and behaviour."
                actions={
                    <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                        <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                    </Button>
                }
            />

            {loading ? (
                <div className="space-y-4">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-40 w-full" />
                    ))}
                </div>
            ) : Object.keys(settings).length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <div className="text-center">
                        <IconSettings size={32} className="mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">No settings found.</p>
                        <Button size="sm" className="mt-3" onClick={load}>
                            Initialize Defaults
                        </Button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {Object.entries(settings).map(([category, rows]) => (
                        <Card key={category}>
                            <CardHeader className="pb-3">
                                <CardTitle className="text-base">
                                    {CATEGORY_LABELS[category] ?? category}
                                </CardTitle>
                                <CardDescription className="text-xs">
                                    {rows.length} setting{rows.length !== 1 ? "s" : ""}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {rows.map((setting) => (
                                    <SettingRow
                                        key={setting.id}
                                        setting={setting}
                                        onSave={handleSave}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
