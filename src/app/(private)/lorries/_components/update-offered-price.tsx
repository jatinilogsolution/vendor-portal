"use client"

import React, { useState } from "react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { IconReload } from "@tabler/icons-react"
import { useRouter } from "next/navigation"
import { updateOfferedPriceForFileNo } from "../_action/lorry"
import { getCostByFileNumber } from "@/actions/wms/cost"

const UpdateOfferedPrice = ({
  fileNumber,
  oldPrice,
}: {
  fileNumber: string
  oldPrice: string
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentValue, setCurrentValue] = useState(oldPrice || "0")
  const [lastToastMessage, setLastToastMessage] = useState("")
  const router = useRouter()

  const showToastOnce = (
    type: "error" | "success" | "info",
    message: string
  ) => {
    if (message !== lastToastMessage) {
      toast[type](message)
      setLastToastMessage(message)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { message, success, price } = await getCostByFileNumber(fileNumber)

      if (success) {
        showToastOnce("success", message || "Price updated successfully")
        setCurrentValue(price)
        await updateOfferedPriceForFileNo(fileNumber, price)
        router.refresh()
      } else {
        showToastOnce("error", message || "Failed to update price")
      }
    } catch (error) {
      console.log("Error while updating price:", (error as Error).message)
      showToastOnce("error", "An error occurred while updating price")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-3">
      <Label className="whitespace-nowrap text-sm font-medium">
        Price Offered:
      </Label>

      <span className="flex-1 text-sm font-semibold text-green-700 bg-muted/50 px-2 py-1 rounded-md max-w-xs border">
        ₹ {currentValue}
      </span>

      <Button
        type="submit"
        size="icon"
        variant="secondary"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />
        ) : (
          <IconReload className="h-5 w-5 text-green-500" />
        )}
      </Button>
    </form>
  )
}

export default UpdateOfferedPrice
