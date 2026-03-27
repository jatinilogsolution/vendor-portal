// src/app/vendor-portal/(admin)/admin/categories/page.tsx
"use client"

import { useCallback, useEffect, useState } from "react"
import { toast } from "sonner"
import { IconCategory, IconPlus, IconRefresh } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { CategoryTree } from "./_components/category-tree"
import { CategoryDialog } from "./_components/category-dialog"
import { getVpCategories, VpCategoryFlat } from "@/actions/vp/category.action"
import { useSession } from "@/lib/auth-client"
import { Skeleton } from "@/components/ui/skeleton"
import { VpPageHeader } from "@/components/ui/vp-page-header"

function flattenTree(nodes: VpCategoryFlat[]): VpCategoryFlat[] {
    return nodes.flatMap((n) => [n, ...flattenTree(n.children)])
}

export default function CategoriesPage() {
    const { data: session } = useSession()
    const canEdit = ["ADMIN", "BOSS"].includes(session?.user?.role ?? "")

    const [tree, setTree] = useState<VpCategoryFlat[]>([])
    const [loading, setLoading] = useState(true)
    const [newOpen, setNewOpen] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        const result = await getVpCategories()
        if (!result.success) { toast.error(result.error); setLoading(false); return }
        setTree(result.data)
        setLoading(false)
    }, [])

    useEffect(() => { load() }, [load])

    // Flat list (for parent pickers in dialogs)
    const allFlat = flattenTree(tree).map((n) => ({
        id: n.id, name: n.name, parentId: n.parentId,
    }))

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
                            <Button size="sm" onClick={() => setNewOpen(true)}>
                                <IconPlus className="mr-1 h-4 w-4" />
                                New Category
                            </Button>
                        )}
                    </div>
                }
            />

            {loading ? (
                <div className="space-y-2">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            ) : (
                <CategoryTree
                    tree={tree}
                    allFlat={allFlat}
                    canEdit={canEdit}
                    onRefresh={load}
                />
            )}

            {canEdit && (
                <CategoryDialog
                    open={newOpen}
                    onClose={() => setNewOpen(false)}
                    onSuccess={load}
                    allCategories={allFlat}
                />
            )}
        </div>
    )
}