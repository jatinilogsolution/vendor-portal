"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { VpPageHeader } from "@/components/ui/vp-page-header"
import { ItemPriceIntelligence } from "../_components/item-price-intelligence"
import { getVpCategoriesFlat } from "@/actions/vp/category.action"

export default function ItemPriceIntelligencePage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const initialItemId = searchParams.get("itemId") ?? ""
    const [categories, setCategories] = useState<{ id: string; name: string; code: string | null }[]>([])
    const [selectedItemId, setSelectedItemId] = useState(initialItemId)

    useEffect(() => {
        getVpCategoriesFlat().then((r) => {
            if (r.success) setCategories(r.data.map((c) => ({ id: c.id, name: c.name, code: c.code })))
        })
    }, [])

    useEffect(() => {
        setSelectedItemId(initialItemId)
    }, [initialItemId])

    return (
        <div className="space-y-6">
            <VpPageHeader
                title="Item Price Intelligence"
                description="Track vendor price trends, compare history, and manage unmatched items."
                actions={(
                    <Button asChild variant="outline" size="sm">
                        <Link href="/vendor-portal/admin/items">Back to Items</Link>
                    </Button>
                )}
            />

            <ItemPriceIntelligence
                categories={categories}
                selectedItemId={selectedItemId || undefined}
                onSelectItem={(itemId) => {
                    setSelectedItemId(itemId)
                    if (itemId) {
                        router.replace(`/vendor-portal/admin/items/intelligence?itemId=${itemId}`)
                    } else {
                        router.replace("/vendor-portal/admin/items/intelligence")
                    }
                }}
            />
        </div>
    )
}
