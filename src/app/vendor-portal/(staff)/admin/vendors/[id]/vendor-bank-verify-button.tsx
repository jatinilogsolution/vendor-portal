"use client"

import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { toast } from "sonner"
import { verifyVpVendorBankDetails } from "@/actions/vp/bank-details.action"
import { Button } from "@/components/ui/button"

type VendorBankVerifyButtonProps = {
    vpVendorId: string
}

export function VendorBankVerifyButton({ vpVendorId }: VendorBankVerifyButtonProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    return (
        <Button
            size="sm"
            variant="outline"
            className="mt-2 w-full"
            disabled={isPending}
            onClick={() => {
                startTransition(async () => {
                    const result = await verifyVpVendorBankDetails(vpVendorId)
                    if (!result.success) {
                        toast.error(result.error)
                        return
                    }

                    toast.success("Bank details verified")
                    router.refresh()
                })
            }}
        >
            {isPending ? "Verifying..." : "Mark as Verified"}
        </Button>
    )
}
