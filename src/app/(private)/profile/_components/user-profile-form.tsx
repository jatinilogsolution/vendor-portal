"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { updateUserProfile } from "../_action/profile"
import { User } from "@/generated/prisma"
 

// interface UserProfile {
//   id: string
//   name: string
//   email: string
//   emailVerified: boolean
//   image?: string
//   phone?: string
//   role: string
//   banned: boolean
//   banReason?: string
//   banExpires?: string
//   vendorId?: string
//   createdAt: Date
//   updatedAt: Date
// }

interface UserProfileFormProps {
  user: User
  isEditing: boolean
  onUpdate: (user: User) => void
  onCancel: () => void
}

export function UserProfileForm({ user, isEditing, onUpdate, onCancel }: UserProfileFormProps) {
  const [formData, setFormData] = useState<User>(user)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }

    if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format"
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
      const result = await updateUserProfile(user.id, formData)
      if (result.success && result.user) {
        onUpdate(result.user)
      } else {
        setSubmitError(result.error || "Failed to update profile")
      }
    } catch (err) {
      setSubmitError("An error occurred while updating your profile")
      console.error("[v0] Error updating profile:", err)
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
        {user.banned && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your account is banned
              {user.banReason && ` - Reason: ${user.banReason}`}
              {user.banExpires && ` - Expires: ${new Date(user.banExpires).toLocaleDateString()}`}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <Label className="text-muted-foreground">Full Name</Label>
            <p className="mt-2 text-lg font-medium">{user.name}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Email Address</Label>
            <div className="mt-2 flex items-center gap-2">
              <p className="text-lg font-medium">{user.email}</p>
              {user.emailVerified && <CheckCircle2 className="h-5 w-5 text-green-600" />}
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Phone Number</Label>
            <p className="mt-2 text-lg font-medium">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Role</Label>
            <p className="mt-2 text-lg font-medium">{user.role}</p>
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
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            disabled={isSubmitting}
            className={errors.name ? "border-destructive" : ""}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            disabled={isSubmitting}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone || ""}
            onChange={handleChange}
            placeholder="Enter your phone number"
            disabled={isSubmitting}
            className={errors.phone ? "border-destructive" : ""}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Input id="role" name="role" value={formData.role} disabled className="bg-muted" />
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
