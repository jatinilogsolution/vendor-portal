// src/app/vendor-portal/(admin)/admin/categories/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"
import { IconCategory, IconPlus, IconRefresh, IconSearch } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CategoryTree } from "./_components/category-tree"
import { CategoryDialog } from "./_components/category-dialog"
import { BulkCategoryDialog } from "./_components/bulk-category-dialog"
import { getVpCategories, VpCategoryFlat } from "@/actions/vp/category.action"
import { useSession } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { VpPageHeader } from "@/components/ui/vp-page-header"

function flattenTree(nodes: VpCategoryFlat[]): VpCategoryFlat[] {
    return nodes.flatMap((n) => [n, ...flattenTree(n.children)])
}

function filterTree(nodes: VpCategoryFlat[], query: string): VpCategoryFlat[] {
    return nodes.reduce<VpCategoryFlat[]>((acc, node) => {
        const children = filterTree(node.children, query)
        const matchesSelf = [node.id, node.name, node.code, node.parentName, node.status]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(query))

        if (matchesSelf || children.length > 0) {
            acc.push({ ...node, children })
        }

        return acc
    }, [])
}

export default function CategoriesPage() {
    const searchParams = useSearchParams()
    const initialQuery = searchParams.get("q") ?? ""
    const { data: session } = useSession()
    const canEdit = ["ADMIN", "BOSS"].includes(session?.user?.role ?? "")

    const [tree, setTree] = useState<VpCategoryFlat[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState(initialQuery)
    const [newOpen, setNewOpen] = useState(false)
    const [bulkOpen, setBulkOpen] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpCategories()
        if (!result.success) { toast.error(result.error); setLoading(false); return }
        setTree(result.data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])
    useEffect(() => { setSearch(initialQuery) }, [initialQuery])

    // Flat list (for parent pickers in dialogs)
    const allFlat = flattenTree(tree).map((n) => ({
        id: n.id, name: n.name, parentId: n.parentId,
    }))
    const filteredTree = search.trim()
        ? filterTree(tree, search.trim().toLowerCase())
        : tree

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Categories"
                description="Hierarchical categories that organise vendors, items and purchase orders."
                actions={
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={load} disabled={loading}>
                            <IconRefresh size={15} className={loading ? "animate-spin" : ""} />
                        </Button>
                        {canEdit && (
                            <>
                                <Button variant="secondary" size="sm" onClick={() => setBulkOpen(true)}>
                                    <IconPlus className="mr-1 h-4 w-4" /> Bulk Add (Excel)
                                </Button>
                                <Button size="sm" onClick={() => setNewOpen(true)}>
                                    <IconPlus className="mr-1 h-4 w-4" />
                                    New Category
                                </Button>
                            </>
                        )}
                    </div>
                }
            />

            <div className="relative max-w-md">
                <IconSearch size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search category name, code, status or ID..."
                    className="pl-9"
                />
            </div>

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            ) : (
                <CategoryTree
                    tree={filteredTree}
                    allFlat={allFlat}
                    canEdit={canEdit}
                    onRefresh={load}
                    expandAll={Boolean(search.trim())}
                />
            )}

            {canEdit && (
                <>
                    <CategoryDialog
                        open={newOpen}
                        onClose={() => setNewOpen(false)}
                        onSuccess={load}
                        allCategories={allFlat}
                    />
                    <BulkCategoryDialog
                        open={bulkOpen}
                        onClose={() => setBulkOpen(false)}
                        onSuccess={load}
                        parentCategories={allFlat}
                    />
                </>
            )}
        </div>
    )
}
