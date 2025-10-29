"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateAddress } from "../_action/profile"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Address } from "@/generated/prisma"
 
// interface AddressProfile {
//   id: string
//   line1: string
//   line2?: string
//   city: string
//   state?: string
//   postal?: string
//   country: string
//   vendorId: string
//   createdAt: Date
//   updatedAt: Date
// }

interface AddressFormProps {
  address: Address
  isEditing: boolean
  onUpdate: (address: Address) => void
  onCancel: () => void
}

export function AddressForm({ address, isEditing, onUpdate, onCancel }: AddressFormProps) {
  const [formData, setFormData] = useState<Address>(address)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.line1.trim()) {
      newErrors.line1 = "Address line 1 is required"
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required"
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const result = await updateAddress(address.vendorId, formData)
      if (result.success && result.address) {
        onUpdate(result.address)
      } else {
        setSubmitError(result.error || "Failed to update address")
      }
    } catch (err) {
      setSubmitError("An error occurred while updating address")
      console.error("[v0] Error updating address:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  if (!isEditing) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Address Line 1</Label>
            <p className="mt-2 text-lg font-medium">{address.line1}</p>
          </div>
          {address.line2 && (
            <div>
              <Label className="text-muted-foreground">Address Line 2</Label>
              <p className="mt-2 text-lg font-medium">{address.line2}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">City</Label>
            <p className="mt-2 text-lg font-medium">{address.city}</p>
          </div>
          {address.state && (
            <div>
              <Label className="text-muted-foreground">State</Label>
              <p className="mt-2 text-lg font-medium">{address.state}</p>
            </div>
          )}
          {address.postal && (
            <div>
              <Label className="text-muted-foreground">Postal Code</Label>
              <p className="mt-2 text-lg font-medium">{address.postal}</p>
            </div>
          )}
          <div>
            <Label className="text-muted-foreground">Country</Label>
            <p className="mt-2 text-lg font-medium">{address.country}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="line1">Address Line 1 *</Label>
          <Input
            id="line1"
            name="line1"
            value={formData.line1}
            onChange={handleChange}
            placeholder="Enter street address"
            disabled={isSubmitting}
            className={errors.line1 ? "border-destructive" : ""}
          />
          {errors.line1 && <p className="text-sm text-destructive">{errors.line1}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="line2">Address Line 2</Label>
          <Input
            id="line2"
            name="line2"
            value={formData.line2 || ""}
            onChange={handleChange}
            placeholder="Apartment, suite, etc."
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            placeholder="Enter city"
            disabled={isSubmitting}
            className={errors.city ? "border-destructive" : ""}
          />
          {errors.city && <p className="text-sm text-destructive">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State/Province</Label>
          <Input
            id="state"
            name="state"
            value={formData.state || ""}
            onChange={handleChange}
            placeholder="Enter state or province"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="postal">Postal Code</Label>
          <Input
            id="postal"
            name="postal"
            value={formData.postal || ""}
            onChange={handleChange}
            placeholder="Enter postal code"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="country">Country *</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            placeholder="Enter country"
            disabled={isSubmitting}
            className={errors.country ? "border-destructive" : ""}
          />
          {errors.country && <p className="text-sm text-destructive">{errors.country}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Spinner className="h-4 w-4" />}
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
