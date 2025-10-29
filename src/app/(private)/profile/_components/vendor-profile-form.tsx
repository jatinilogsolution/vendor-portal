"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updateVendorProfile } from "../_action/profile"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Vendor } from "@/generated/prisma"
 

// interface VendorProfile {
//   id: string
//   name: string
//   contactEmail?: string
//   contactPhone?: string
//   gstNumber?: string
//   panNumber?: string
//   profileCompleted: boolean
//   taxId?: string
//   paymentTerms?: string
//   isActive: boolean
//   createdAt: Date
// }

interface VendorProfileFormProps {
  vendor: Vendor
  isEditing: boolean
  onUpdate: (vendor: Vendor) => void
  onCancel: () => void
}

export function VendorProfileForm({ vendor, isEditing, onUpdate, onCancel }: VendorProfileFormProps) {
  const [formData, setFormData] = useState<Vendor>(vendor)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Company name is required"
    }

    if (formData.contactEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contactEmail)) {
      newErrors.contactEmail = "Invalid email format"
    }

    if (formData.gstNumber && !/^[A-Z0-9]{15}$/.test(formData.gstNumber)) {
      newErrors.gstNumber = "Invalid GST number format (15 characters)"
    }

    if (formData.panNumber && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber)) {
      newErrors.panNumber = "Invalid PAN number format"
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
      const result = await updateVendorProfile(vendor.id, formData)
      if (result.success && result.vendor) {
        onUpdate(result.vendor)
      } else {
        setSubmitError(result.error || "Failed to update vendor profile")
      }
    } catch (err) {
      setSubmitError("An error occurred while updating vendor profile")
      console.error("[v0] Error updating vendor profile:", err)
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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{vendor.name}</h3>
            <p className="text-sm text-muted-foreground">Vendor ID: {vendor.id}</p>
          </div>
          <div className="flex gap-2">
            {vendor.isActive && (
              <Badge variant="outline" className="gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </Badge>
            )}
            {vendor.profileCompleted && <Badge variant="secondary">Profile Complete</Badge>}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Contact Email</Label>
            <p className="mt-2 text-lg font-medium">{vendor.contactEmail || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Contact Phone</Label>
            <p className="mt-2 text-lg font-medium">{vendor.contactPhone || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">GST Number</Label>
            <p className="mt-2 text-lg font-medium">{vendor.gstNumber || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">PAN Number</Label>
            <p className="mt-2 text-lg font-medium">{vendor.panNumber || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Tax ID</Label>
            <p className="mt-2 text-lg font-medium">{vendor.taxId || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Payment Terms</Label>
            <p className="mt-2 text-lg font-medium">{vendor.paymentTerms || "Not provided"}</p>
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
          <Label htmlFor="name">Company Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter company name"
            disabled={isSubmitting}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input
            id="contactEmail"
            name="contactEmail"
            type="email"
            value={formData.contactEmail || ""}
            onChange={handleChange}
            placeholder="Enter contact email"
            disabled={isSubmitting}
            className={errors.contactEmail ? "border-destructive" : ""}
          />
          {errors.contactEmail && <p className="text-sm text-destructive">{errors.contactEmail}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactPhone">Contact Phone</Label>
          <Input
            id="contactPhone"
            name="contactPhone"
            value={formData.contactPhone || ""}
            onChange={handleChange}
            placeholder="Enter contact phone"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstNumber">GST Number</Label>
          <Input
            id="gstNumber"
            name="gstNumber"
            value={formData.gstNumber || ""}
            onChange={handleChange}
            placeholder="Enter GST number (15 characters)"
            disabled={isSubmitting}
            className={errors.gstNumber ? "border-destructive" : ""}
          />
          {errors.gstNumber && <p className="text-sm text-destructive">{errors.gstNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="panNumber">PAN Number</Label>
          <Input
            id="panNumber"
            name="panNumber"
            value={formData.panNumber || ""}
            onChange={handleChange}
            placeholder="Enter PAN number"
            disabled={isSubmitting}
            className={errors.panNumber ? "border-destructive" : ""}
          />
          {errors.panNumber && <p className="text-sm text-destructive">{errors.panNumber}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="taxId">Tax ID</Label>
          <Input
            id="taxId"
            name="taxId"
            value={formData.taxId || ""}
            onChange={handleChange}
            placeholder="Enter tax ID"
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="paymentTerms">Payment Terms</Label>
          <Input
            id="paymentTerms"
            name="paymentTerms"
            value={formData.paymentTerms || ""}
            onChange={handleChange}
            placeholder="e.g., Net 30"
            disabled={isSubmitting}
          />
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
