// src/app/vendor-portal/(admin)/admin/categories/_components/category-tree.tsx
"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { IconChevronRight, IconChevronDown, IconPlus, IconPencil, IconTrash, IconFolder, IconFolderOpen } from "@tabler/icons-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogDescription,
    AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { CategoryDialog } from "./category-dialog"
import { deleteVpCategory, VpCategoryFlat } from "@/actions/vp/category.action"
import { cn } from "@/lib/utils"
import { VpEmptyState } from "@/components/ui/vp-empty-state"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"

interface CategoryTreeProps {
    tree: VpCategoryFlat[]
    allFlat: { id: string; name: string; parentId: string | null }[]
    canEdit: boolean
    onRefresh: () => void
    expandAll?: boolean
}

function CategoryRow({
    node, allFlat, canEdit, onRefresh, defaultOpen = false, expandAll = false,
}: {
    node: VpCategoryFlat
    allFlat: { id: string; name: string; parentId: string | null }[]
    canEdit: boolean
    onRefresh: () => void
    defaultOpen?: boolean
    expandAll?: boolean
}) {
    const [expanded, setExpanded] = useState(defaultOpen)
    const [dialogOpen, setDialog] = useState(false)
    const [deleteOpen, setDelete] = useState(false)
    const [addOpen, setAdd] = useState(false)
    const [isPending, startTransition] = useTransition()

    const hasChildren = node.children.length > 0

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteVpCategory(node.id)
            if (!result.success) { toast.error(result.error); return }
            toast.success("Category deleted")
            onRefresh()
        })
    }

    return (
        <div>
            {/* Row */}
            <div
                className={cn(
                    "group flex items-center gap-2 rounded-md px-2 py-2 hover:bg-muted/50 transition-colors",
                )}
                style={{ paddingLeft: `${node.depth * 20 + 8}px` }}
            >
                {/* Expand toggle */}
                <button
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
                    onClick={() => setExpanded((p) => !p)}
                    disabled={!hasChildren}
                >
                    {hasChildren
                        ? expanded
                            ? <IconChevronDown size={14} />
                            : <IconChevronRight size={14} />
                        : <span className="h-3 w-3" />
                    }
                </button>

                {/* Icon */}
                {expanded
                    ? <IconFolderOpen size={16} className="shrink-0 text-amber-500" />
                    : <IconFolder size={16} className="shrink-0 text-amber-500" />
                }

                {/* Name + code */}
                <span className="flex-1 text-sm font-medium">{node.name}</span>
                {node.code && (
                    <Badge variant="outline" className="text-xs font-mono">{node.code}</Badge>
                )}

                {/* Counts */}
                <span className="text-xs text-muted-foreground hidden sm:block">
                    {node._count.items} items
                </span>
                {node._count.children > 0 && (
                    <span className="text-xs text-muted-foreground hidden sm:block">
                        {node._count.children} sub
                    </span>
                )}

                {/* Status */}
                <VpStatusBadge status={node.status} />

                {/* Actions — shown on hover */}
                {canEdit && (
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => setAdd(true)}
                            title="Add sub-category"
                        >
                            <IconPlus size={14} />
                        </Button>
                        <Button
                            variant="ghost" size="icon" className="h-7 w-7"
                            onClick={() => setDialog(true)}
                            title="Edit"
                        >
                            <IconPencil size={14} />
                        </Button>
                        <Button
                            variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive"
                            onClick={() => setDelete(true)}
                            title="Delete"
                        >
                            <IconTrash size={14} />
                        </Button>
                    </div>
                )}
            </div>

            {/* Children */}
            {expanded && hasChildren && (
                <div>
                    {node.children.map((child) => (
                        <CategoryRow
                            key={child.id}
                            node={child}
                            allFlat={allFlat}
                            canEdit={canEdit}
                            onRefresh={onRefresh}
                            defaultOpen={expandAll}
                            expandAll={expandAll}
                        />
                    ))}
                </div>
            )}

            {/* Edit dialog */}
            <CategoryDialog
                open={dialogOpen}
                onClose={() => setDialog(false)}
                onSuccess={onRefresh}
                editing={node}
                allCategories={allFlat}
            />

            {/* Add sub-category dialog */}
            <CategoryDialog
                open={addOpen}
                onClose={() => setAdd(false)}
                onSuccess={() => { onRefresh(); setExpanded(true) }}
                allCategories={allFlat}
                defaultParentId={node.id}
            />

            {/* Delete confirm */}
            <AlertDialog open={deleteOpen} onOpenChange={setDelete}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete &quot;{node.name}&quot;?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This cannot be undone. The category must have no sub-categories,
                            vendors, or items assigned to it.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            onClick={handleDelete}
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

export function CategoryTree({ tree, allFlat, canEdit, onRefresh, expandAll = false }: CategoryTreeProps) {
    if (tree.length === 0) {
        return (
            <VpEmptyState
                icon={IconFolder}
                title="No categories yet"
                description="Create your first category to organise vendors and items."
            />
        )
    }

    return (
        <div className="rounded-md border">
            {/* Header */}
            <div className="flex items-center gap-2 border-b bg-muted/30 px-4 py-2">
                <span className="flex-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Name</span>
                <span className="hidden w-16 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground sm:block">Items</span>
                <span className="w-20 text-center text-xs font-semibold uppercase tracking-wide text-muted-foreground">Status</span>
                {canEdit && <span className="w-24" />}
            </div>

            {/* Tree rows */}
            <div className="p-1">
                {tree.map((node) => (
                    <CategoryRow
                        key={node.id}
                        node={node}
                        allFlat={allFlat}
                        canEdit={canEdit}
                        onRefresh={onRefresh}
                        defaultOpen={expandAll || node.children.length > 0}
                        expandAll={expandAll}
                    />
                ))}
            </div>
        </div>
    )
}
