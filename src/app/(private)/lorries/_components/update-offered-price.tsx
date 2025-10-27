"use client"

import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import { toast } from 'sonner'
import { updateOfferedPriceForFileNo } from '../_action/lorry'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'
import { IndianRupee, Loader2, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'

const UpdateOfferedPrice = ({ fileNumber, oldPrice }: { fileNumber: string, oldPrice: string }) => {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [currentValue, setCurrentValue] = useState(oldPrice || '0')
    const [hasChanged, setHasChanged] = useState(false)
    const [lastToastMessage, setLastToastMessage] = useState('') // Track last toast

    const router = useRouter()
    const showToastOnce = (type: 'error' | 'success' | 'info', message: string) => {
        if (message !== lastToastMessage) {
            toast[type](message)
            setLastToastMessage(message)
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const input = e.currentTarget.querySelector<HTMLInputElement>(`#${fileNumber}-target`)
        if (!input) return

        const newPrice = input.value.trim()

        // Validation
        if (!newPrice || newPrice === '0') {
            showToastOnce('error', "Please enter a valid price")
            return
        }

        const numericPrice = parseFloat(newPrice)
        if (numericPrice > 500000) {
            showToastOnce('error', "Price cannot exceed ₹5,00,000")
            return
        }

        if (numericPrice < 0) {
            showToastOnce('error', "Price cannot be negative")
            return
        }

        // Check if price actually changed
        if (newPrice === oldPrice) {
            showToastOnce('info', "Price hasn't changed")
            return
        }

        setIsSubmitting(true)

        try {
            const { message, sucess } = await updateOfferedPriceForFileNo(fileNumber, newPrice)

            if (sucess) {
                showToastOnce('success', message || "Price updated successfully")
                setCurrentValue(newPrice)
                setHasChanged(false)
                router.refresh()
            } else {
                showToastOnce('error', message || "Failed to update price")
            }
        } catch (error) {
            console.log("Error while updating price:", (error as Error).message)
            showToastOnce('error', "An error occurred while updating price")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value
        setCurrentValue(value)
        setHasChanged(value !== oldPrice)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !isSubmitting) {
            e.currentTarget.form?.requestSubmit()
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className="flex w-full max-w-sm items-center gap-2"
        >
            <Label className="whitespace-nowrap text-sm font-medium">
                Price Offered:
            </Label>

            <div className="flex items-center gap-2 flex-1">
                <InputGroup className="flex-1 bg-muted/50 hover:border-primary hover:bg-muted/10 focus-within:bg-muted/10 transition-colors">
                    <InputGroupInput
                        id={`${fileNumber}-target`}
                        value={currentValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        type="number"
                        min={0}
                        max={500000}
                        step="0.01"
                        disabled={isSubmitting}
                        className="disabled:opacity-50 disabled:cursor-not-allowed"
                    />
                    <InputGroupAddon>
                        <IndianRupee className="h-4 w-4 text-green-600" />
                    </InputGroupAddon>
                </InputGroup>

                {hasChanged && (
                    <Button
                        type="submit"
                        size="icon"
                        variant={"secondary"}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <Loader2 className="h-5 w-5 text-violet-500 animate-spin" />
                        ) : (
                            <Check className="h-5 w-5 text-green-500" />
                        )}
                    </Button>
                )}
            </div>
        </form>
    )
}

export default UpdateOfferedPrice
