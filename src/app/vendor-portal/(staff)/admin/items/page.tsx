// src/app/vendor-portal/(admin)/admin/items/page.tsx
"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"
import {
    IconPackage, IconPlus, IconSearch,
    IconPencil, IconTrash, IconRefresh,
} from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select, SelectContent, SelectItem,
    SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Skeleton } from "@/components/ui/skeleton"

import { ItemDialog } from "./_components/item-dialog"
import { getVpItems, deleteVpItem, VpItemRow } from "@/actions/vp/item.action"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"
import { useSession } from "@/lib/auth-client"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpPageHeader } from "@/components/ui/vp-page-header"

export default function ItemsPage() {
    const { data: session } = useSession()
    const canEdit = ["ADMIN", "BOSS"].includes(session?.user?.role ?? "")

    const [items, setItems] = useState<VpItemRow[]>([])
    const [total, setTotal] = useState(0)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [catFilter, setCatFilter] = useState("")
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const [editing, setEditing] = useState<VpItemRow | null>(null)
    const [deleteTarget, setDeleteTarget] = useState<VpItemRow | null>(null)
    const [isPending, startTransition] = useTransition()

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpItems({
            search: search || undefined,
            categoryId: catFilter || undefined,
            per_page: 50,
        })
        if (!result.success) { toast.error(result.error); setLoading(false); return }
        setItems(result.data.data)
        setTotal(result.data.meta.total)
        setLoading(false)
    }, [search, catFilter])

    // Load categories once
    useEffect(() => {
        getVpCategoriesFlat().then((r) => {
            if (r.success) setCategories(r.data.map((c) => ({ id: c.id, name: c.name })))
        })
    }, [])

    // Reload when filters change (debounced via key)
    useEffect(() => {
        const t = setTimeout(load, 300)
        return () => clearTimeout(t)
    }, [load])

    const handleDelete = (item: VpItemRow) => {
        startTransition(async () => {
            const result = await deleteVpItem(item.id)
            if (!result.success) { toast.error(result.error); return }
            toast.success("Item deleted")
            setDeleteTarget(null)
            load()
        })
    }

    const openCreate = () => { setEditing(null); setDialogOpen(true) }
    const openEdit = (item: VpItemRow) => { setEditing(item); setDialogOpen(true) }

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Item Master"
                description={`${total} items in the catalog`}
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {canEdit && (
                            <Button size="sm" onClick={openCreate}>
                                <IconPlus className="mr-1 h-4 w-4" /> New Item
                            </Button>
                        )}
                    </div>
                }
            />

            {/* Filters */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                    <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, code or HSN..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={catFilter} onValueChange={setCatFilter}>
                    <SelectTrigger className="w-full sm:w-52">
                        <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                        {/* >All Categories</SelectItem> */}
                        {categories.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Code</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>UOM</TableHead>
                            <TableHead className="text-right">Default Price</TableHead>
                            <TableHead>HSN</TableHead>
                            <TableHead>Used In</TableHead>
                            {canEdit && <TableHead className="w-24" />}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading
                            ? Array.from({ length: 6 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: canEdit ? 8 : 7 }).map((_, j) => (
                                        <TableCell key={j}><Skeleton className="h-4 w-full" /></TableCell>
                                    ))}
                                </TableRow>
                            ))
                            : items.length === 0
                                ? (
                                    <TableRow>
                                        <TableCell colSpan={canEdit ? 8 : 7} className="py-0">
                                            <VpEmptyState
                                                icon={IconPackage}
                                                title="No items found"
                                                description={search ? "Try a different search term." : "Add your first item to the catalog."}
                                                action={canEdit ? { label: "Add Item", onClick: openCreate } : undefined}
                                            />
                                        </TableCell>
                                    </TableRow>
                                )
                                : items.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                                                {item.code}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-xs text-muted-foreground line-clamp-1">{item.description}</p>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {item.categoryName
                                                ? <Badge variant="outline" className="text-xs">{item.categoryName}</Badge>
                                                : <span className="text-xs text-muted-foreground">—</span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="secondary" className="text-xs">{item.uom}</Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            ₹{item.defaultPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                                        </TableCell>
                                        <TableCell>
                                            <span className="font-mono text-xs">{item.hsnCode ?? "—"}</span>
                                        </TableCell>
                                        <TableCell>
                                            <span className="text-xs text-muted-foreground">
                                                {item._count.poLineItems + item._count.piLineItems} orders
                                            </span>
                                        </TableCell>
                                        {canEdit && (
                                            <TableCell>
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost" size="icon" className="h-8 w-8"
                                                        onClick={() => openEdit(item)}
                                                    >
                                                        <IconPencil size={14} />
                                                    </Button>
                                                    <Button
                                                        variant="ghost" size="icon"
                                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                                        onClick={() => setDeleteTarget(item)}
                                                    >
                                                        <IconTrash size={14} />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        )}
                                    </TableRow>
                                ))
                        }
                    </TableBody>
                </Table>
            </div>

            {/* Dialog */}
            {canEdit && (
                <ItemDialog
                    open={dialogOpen}
                    onClose={() => setDialogOpen(false)}
                    onSuccess={() => { setDialogOpen(false); load() }}
                    editing={editing}
                    categories={categories}
                />
            )}

            {/* Delete confirm */}
            <AlertDialog
                open={!!deleteTarget}
                onOpenChange={(v) => !v && setDeleteTarget(null)}
            >
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. The item must not be used in any existing PO or PI.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={() => deleteTarget && handleDelete(deleteTarget)}
                            disabled={isPending}
                        >
                            {isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
