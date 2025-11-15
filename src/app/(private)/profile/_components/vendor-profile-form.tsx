"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle2, AlertCircle } from "lucide-react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Vendor } from "@/generated/prisma"
import { updateVendorProfile } from "../_action/profile"

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

  // -------------------- VALIDATION --------------------
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Company name is required"

    if (formData.contactEmail) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(formData.contactEmail.trim()))
        newErrors.contactEmail = "Please enter a valid email address (e.g., name@example.com)"
    }

    if (formData.gstNumber) {
      const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/
      if (!gstRegex.test(formData.gstNumber.trim().toUpperCase()))
        newErrors.gstNumber = "Invalid GST number (15 characters, e.g., 22AAAAA0000A1Z5)"
    }

    if (formData.panNumber) {
      const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/
      if (!panRegex.test(formData.panNumber.trim().toUpperCase()))
        newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // -------------------- HANDLERS --------------------
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const result = await updateVendorProfile(vendor.id, formData)
      if (result.success && result.vendor) onUpdate(result.vendor)
      else setSubmitError(result.error || "Failed to update vendor profile")
    } catch (err) {
      setSubmitError("An error occurred while updating vendor profile")
      console.error("[VendorProfileForm] Update error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  // -------------------- READ-ONLY VIEW --------------------
  if (!isEditing) {
    return (
      <div className="space-y-8 p-4 md:p-6 rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-xl font-semibold">{vendor.name}</h3>
            <p className="text-sm text-muted-foreground">Vendor ID: {vendor.id}</p>
          </div>
          <div className="flex gap-2">
            {vendor.isActive && (
              <Badge variant="outline" className="gap-1  text-green-700 bg-green-200">
                <CheckCircle2 className="h-3 w-3" />
                Active
              </Badge>
            )}
            {vendor.profileCompleted && (
              <Badge variant="secondary" className="bg-blue-950/50 text-blue-700">
                Profile Complete
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {[
            { label: "Contact Email", value: vendor.contactEmail },
            { label: "Contact Phone", value: vendor.contactPhone },
            { label: "GST Number", value: vendor.gstNumber },
            { label: "PAN Number", value: vendor.panNumber },
            { label: "Tax ID", value: vendor.taxId },
            { label: "Payment Terms", value: vendor.paymentTerms },
          ].map((item) => (
            <div key={item.label}>
              <Label className="text-muted-foreground">{item.label}</Label>
              <p className="mt-1 text-base font-medium text-foreground">
                {item.value || <span className="text-muted-foreground">Not provided</span>}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // -------------------- EDIT FORM --------------------
  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 p-4 md:p-6 bg-card border rounded-xl shadow-sm animate-in fade-in duration-150"
    >
      {submitError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        <FormField
          id="name"
          label="Company Name *"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          disabled={isSubmitting}
          placeholder="Enter company name"
        />
        <FormField
          id="contactEmail"
          label="Contact Email"
          value={formData.contactEmail || ""}
          onChange={handleChange}
          error={errors.contactEmail}
          disabled={isSubmitting}
          placeholder="Enter email"
        />
        <FormField
          id="contactPhone"
          label="Contact Phone"
          value={formData.contactPhone || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter phone number"
        />
        <FormField
          id="gstNumber"
          label="GST Number"
          value={formData.gstNumber || ""}
          onChange={handleChange}
          error={errors.gstNumber}
          disabled={isSubmitting}
          placeholder="15-character GSTIN"
        />
        <FormField
          id="panNumber"
          label="PAN Number"
          value={formData.panNumber || ""}
          onChange={handleChange}
          error={errors.panNumber}
          disabled={isSubmitting}
          placeholder="ABCDE1234F"
        />
        <FormField
          id="taxId"
          label="Tax ID"
          value={formData.taxId || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="Enter Tax ID"
        />
        <FormField
          id="paymentTerms"
          label="Payment Terms"
          value={formData.paymentTerms || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          placeholder="e.g., Net 30"
        />
      </div>

      <div className="flex flex-wrap justify-end gap-3 pt-4">
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

// -------------------- SMALL HELPER COMPONENT --------------------
function FormField({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  error,
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  placeholder?: string
  error?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        className={`transition-colors duration-150 ${
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }`}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
