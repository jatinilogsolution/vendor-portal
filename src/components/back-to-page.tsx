

"use client"

import { useRouter } from "next/navigation"
import { ChevronLeftIcon } from "@heroicons/react/16/solid"
import { Button } from "@/components/ui/button"


export function BackToPage({ title }: { title: string, location?: string }) {

    const router = useRouter()

    const handleBackButton = () => {
router.back()
        // router.push(location) // go to specific path

    }

    return (
        <Button
            onClick={handleBackButton}
            variant={"link"}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
            <ChevronLeftIcon className="size-4" />
            {title ?? "Back to Proofs"}
        </Button>
    )
}
