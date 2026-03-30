"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import {
    IconBuilding, IconPlus, IconRefresh, IconSearch,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    Dialog, DialogContent, DialogDescription,
    DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import {
    Form, FormControl, FormField,
    FormItem, FormLabel, FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useSession } from "@/lib/auth-client"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import {
    getVpCompanies,
    toggleVpCompanyStatus,
    upsertVpCompany,
    VpCompanyRow,
} from "@/actions/vp/company.action"
import {
    vpCompanySchema,
    VpCompanyFormValues,
} from "@/validations/vp/company"

function CompanyDialog({
    open,
    onClose,
    onSaved,
    editing,
}: {
    open: boolean
    onClose: () => void
    onSaved: () => void
    editing: VpCompanyRow | null
}) {
    const [isPending, startTransition] = useTransition()
    const form = useForm<VpCompanyFormValues>({
        resolver: zodResolver(vpCompanySchema) as any,
        defaultValues: {
            name: "",
            code: "",
            legalName: "",
            gstin: "",
            pan: "",
            email: "",
            phone: "",
            address: "",
            isActive: true,
        },
    })

    useEffect(() => {
        form.reset({
            name: editing?.name ?? "",
            code: editing?.code ?? "",
            legalName: editing?.legalName ?? "",
            gstin: editing?.gstin ?? "",
            pan: editing?.pan ?? "",
            email: editing?.email ?? "",
            phone: editing?.phone ?? "",
            address: editing?.address ?? "",
            isActive: editing?.isActive ?? true,
        })
    }, [editing, form, open])

    const onSubmit = (values: VpCompanyFormValues) => {
        startTransition(async () => {
            const result = await upsertVpCompany(values, editing?.id)
            if (!result.success) {
                toast.error(result.error)
                return
            }
            toast.success(editing ? "Company updated" : "Company created")
            onSaved()
            onClose()
        })
    }

    return (
        <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
            <DialogContent className="sm:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>{editing ? "Edit Company" : "Add Company"}</DialogTitle>
                    <DialogDescription>
                        Manage the legal entity details used in POs, PIs, procurement, and vendor billing.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Display Name</FormLabel>
                                    <FormControl><Input placeholder="AWL India Pvt. Ltd." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="code" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Code</FormLabel>
                                    <FormControl><Input placeholder="AWL" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="legalName" render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Legal Name</FormLabel>
                                    <FormControl><Input placeholder="Full registered company name" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="gstin" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>GSTIN</FormLabel>
                                    <FormControl><Input placeholder="GSTIN" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="pan" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>PAN</FormLabel>
                                    <FormControl><Input placeholder="PAN" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="email" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Accounts Email</FormLabel>
                                    <FormControl><Input placeholder="finance@company.com" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="phone" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl><Input placeholder="Contact number" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem className="sm:col-span-2">
                                    <FormLabel>Registered Address</FormLabel>
                                    <FormControl><Textarea rows={3} placeholder="Full billing / registered address" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <FormField control={form.control} name="isActive" render={({ field }) => (
                                <FormItem className="sm:col-span-2 flex items-center justify-between rounded-md border px-3 py-2">
                                    <div>
                                        <FormLabel>Active</FormLabel>
                                        <p className="text-xs text-muted-foreground">
                                            Active companies can be assigned to vendors and selected in new documents.
                                        </p>
                                    </div>
                                    <FormControl>
                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                    </FormControl>
                                </FormItem>
                            )} />
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="ghost" onClick={onClose} disabled={isPending}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isPending}>
                                {isPending ? "Saving..." : editing ? "Update Company" : "Create Company"}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default function AdminCompaniesPage() {
    const { data: session } = useSession()
    const canEdit = ["ADMIN", "BOSS"].includes(session?.user?.role ?? "")

    const [rows, setRows] = useState<VpCompanyRow[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<VpCompanyRow | null>(null)
    const [togglingId, setTogglingId] = useState<string | null>(null)

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpCompanies({
            search: search || undefined,
            status: status || undefined,
            per_page: 100,
        })
        if (!result.success) {
            toast.error(result.error)
            setLoading(false)
            return
        }
        setRows(result.data.data)
        setTotal(result.data.meta.total)
        setLoading(false)
    }, [search, status])

    useEffect(() => {
        const timeout = setTimeout(load, 250)
        return () => clearTimeout(timeout)
    }, [load])

    const handleToggle = (id: string) => {
        setTogglingId(id)
        void (async () => {
            const result = await toggleVpCompanyStatus(id)
            if (!result.success) {
                toast.error(result.error)
                setTogglingId(null)
                return
            }
            toast.success(result.data.isActive ? "Company activated" : "Company deactivated")
            setTogglingId(null)
            load()
        })()
    }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Companies"
                description={`${total} companies available for vendor billing and procurement`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {canEdit && (
                            <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true) }}>
                                <IconPlus className="mr-1 h-4 w-4" />
                                Add Company
                            </Button>
                        )}
                    </div>
                }
            />

            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        className="pl-9"
                        placeholder="Search by company name, code, or GSTIN..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                </div>
                <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger className="w-full sm:w-40">
                        <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="ACTIVE">Active</SelectItem>
                        <SelectItem value="INACTIVE">Inactive</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <Skeleton key={index} className="h-12 w-full" />
                    ))}
                </div>
            ) : rows.length === 0 ? (
                <VpEmptyState
                    icon={IconBuilding}
                    title="No companies configured"
                    description="Create companies first, then assign them to vendors and documents."
                    action={canEdit ? { label: "Add Company", onClick: () => setDialogOpen(true) } : undefined}
                />
            ) : (
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Company</TableHead>
                                <TableHead>GSTIN</TableHead>
                                <TableHead>Assigned Vendors</TableHead>
                                <TableHead>Docs</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="w-40 text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {rows.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="text-sm font-medium">{row.name}</p>
                                                {row.code && <Badge variant="outline" className="text-[10px]">{row.code}</Badge>}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {row.legalName || row.address || "No extra details"}
                                            </p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <code className="text-xs">{row.gstin || "—"}</code>
                                    </TableCell>
                                    <TableCell className="text-sm">{row._count.vendorAssignments}</TableCell>
                                    <TableCell className="text-sm">
                                        {row._count.purchaseOrders + row._count.proformaInvoices + row._count.invoices + row._count.procurements}
                                    </TableCell>
                                    <TableCell>
                                        <VpStatusBadge status={row.isActive ? "ACTIVE" : "INACTIVE"} />
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex justify-end gap-2">
                                            {canEdit && (
                                                <>
                                                    <Button variant="outline" size="sm" onClick={() => {
                                                        setEditing(row)
                                                        setDialogOpen(true)
                                                    }}>
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleToggle(row.id)}
                                                        disabled={togglingId === row.id}
                                                    >
                                                        {row.isActive ? "Deactivate" : "Activate"}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <CompanyDialog
                open={dialogOpen}
                editing={editing}
                onClose={() => setDialogOpen(false)}
                onSaved={load}
            />
        </div>
    )
}
