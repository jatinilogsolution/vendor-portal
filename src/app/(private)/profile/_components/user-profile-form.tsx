// "use client"

// import type React from "react"

// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { AlertCircle, CheckCircle2 } from "lucide-react"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { Spinner } from "@/components/ui/shadcn-io/spinner"
// import { updateUserProfile } from "../_action/profile"
// import { User } from "@/generated/prisma"
 
 
// interface UserProfileFormProps {
//   user: User
//   isEditing: boolean
//   onUpdate: (user: User) => void
//   onCancel: () => void
// }

// export function UserProfileForm({ user, isEditing, onUpdate, onCancel }: UserProfileFormProps) {
//   const [formData, setFormData] = useState<User>(user)
//   const [errors, setErrors] = useState<Record<string, string>>({})
//   const [isSubmitting, setIsSubmitting] = useState(false)
//   const [submitError, setSubmitError] = useState<string | null>(null)

//   const validateForm = () => {
//     const newErrors: Record<string, string> = {}

//     if (!formData.name.trim()) {
//       newErrors.name = "Name is required"
//     }

//     if (!formData.email.trim()) {
//       newErrors.email = "Email is required"
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//       newErrors.email = "Invalid email format"
//     }

//     if (formData.phone && !/^[\d\s\-+()]+$/.test(formData.phone)) {
//       newErrors.phone = "Invalid phone format"
//     }

//     setErrors(newErrors)
//     return Object.keys(newErrors).length === 0
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     if (!validateForm()) return

//     try {
//       setIsSubmitting(true)
//       setSubmitError(null)
//       const result = await updateUserProfile(user.id, formData)
//       if (result.success && result.user) {
//         onUpdate(result.user)
//       } else {
//         setSubmitError(result.error || "Failed to update profile")
//       }
//     } catch (err) {
//       setSubmitError("An error occurred while updating your profile")
//       console.error("[v0] Error updating profile:", err)
//     } finally {
//       setIsSubmitting(false)
//     }
//   }

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }))
//     if (errors[name]) {
//       setErrors((prev) => ({
//         ...prev,
//         [name]: "",
//       }))
//     }
//   }

//   if (!isEditing) {
//     return (
//       <div className="space-y-6">
//         {user.banned && (
//           <Alert variant="destructive">
//             <AlertCircle className="h-4 w-4" />
//             <AlertDescription>
//               Your account is banned
//               {user.banReason && ` - Reason: ${user.banReason}`}
//               {user.banExpires && ` - Expires: ${new Date(user.banExpires).toLocaleDateString()}`}
//             </AlertDescription>
//           </Alert>
//         )}

//         <div className="grid gap-6 md:grid-cols-2">
//           <div>
//             <Label className="text-muted-foreground">Full Name</Label>
//             <p className="mt-2 text-lg font-medium">{user.name}</p>
//           </div>
//           <div>
//             <Label className="text-muted-foreground">Email Address</Label>
//             <div className="mt-2 flex items-center gap-2">
//               <p className="text-lg font-medium">{user.email}</p>
//               {user.emailVerified && <CheckCircle2 className="h-5 w-5 text-green-600" />}
//             </div>
//           </div>
//           <div>
//             <Label className="text-muted-foreground">Phone Number</Label>
//             <p className="mt-2 text-lg font-medium">{user.phone || "Not provided"}</p>
//           </div>
//           <div>
//             <Label className="text-muted-foreground">Role</Label>
//             <p className="mt-2 text-lg font-medium">{user.role}</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6">
//       {submitError && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertDescription>{submitError}</AlertDescription>
//         </Alert>
//       )}

//       <div className="grid gap-6 md:grid-cols-2">
//         <div className="space-y-2">
//           <Label htmlFor="name">Full Name *</Label>
//           <Input
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             placeholder="Enter your full name"
//             disabled={isSubmitting}
//             className={errors.name ? "border-destructive" : ""}
//           />
//           {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="email">Email Address *</Label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             disabled={isSubmitting}
//             className={errors.email ? "border-destructive" : ""}
//           />
//           {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="phone">Phone Number</Label>
//           <Input
//             id="phone"
//             name="phone"
//             value={formData.phone || ""}
//             onChange={handleChange}
//             placeholder="Enter your phone number"
//             disabled={isSubmitting}
//             className={errors.phone ? "border-destructive" : ""}
//           />
//           {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
//         </div>

//         <div className="space-y-2">
//           <Label htmlFor="role">Role</Label>
//           <Input id="role" name="role" value={formData.role} disabled className="bg-muted" />
//         </div>
//       </div>

//       <div className="flex gap-3 pt-4">
//         <Button type="submit" disabled={isSubmitting} className="gap-2">
//           {isSubmitting && <Spinner className="h-4 w-4" />}
//           {isSubmitting ? "Saving..." : "Save Changes"}
//         </Button>
//         <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
//           Cancel
//         </Button>
//       </div>
//     </form>
//   )
// }


"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { updateUserProfile } from "../_action/profile"
import { User } from "@/generated/prisma/client"

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

  // -------------------- VALIDATION --------------------
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(formData.email)) newErrors.email = "Please enter a valid email address"
    }

    if (formData.phone && !/^[0-9+\-\s()]{6,15}$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // -------------------- HANDLERS --------------------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    try {
      setIsSubmitting(true)
      setSubmitError(null)
      const result = await updateUserProfile(user.id, formData)
      if (result.success && result.user) onUpdate(result.user)
      else setSubmitError(result.error || "Failed to update profile")
    } catch (err) {
      console.error("[UserProfileForm] Update error:", err)
      setSubmitError("An error occurred while updating your profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }))
  }

  // -------------------- READ-ONLY VIEW --------------------
  if (!isEditing) {
    return (
      <div className="space-y-8 p-4 md:p-6 rounded-xl border bg-card shadow-sm">
        {user.banned && (
          <Alert variant="destructive" className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 mt-1" />
            <AlertDescription>
              <p className="font-medium">Your account is banned.</p>
              {user.banReason && <p>Reason: {user.banReason}</p>}
              {user.banExpires && (
                <p>Expires: {new Date(user.banExpires).toLocaleDateString()}</p>
              )}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 sm:grid-cols-2">
          <InfoField label="Full Name" value={user.name} />
          <div>
            <Label className="text-muted-foreground">Email Address</Label>
            <div className="mt-1.5 flex items-center gap-2">
              <p className="text-base font-medium text-foreground">{user.email}</p>
              {user.emailVerified && (
                <CheckCircle2 className="h-4 w-4 text-green-600"   />
              )}
            </div>
          </div>
          <InfoField label="Phone Number" value={user.phone || "Not provided"} />
          <InfoField label="Role" value={user.role || "N/A"} />
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

      <div className="grid gap-6 sm:grid-cols-2">
        <FormField
          id="name"
          label="Full Name *"
          value={formData.name}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.name}
          placeholder="Enter your full name"
        />
        <FormField
          id="email"
          label="Email Address *"
          value={formData.email}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.email}
          placeholder="Enter your email"
          type="email"
        />
        <FormField
          id="phone"
          label="Phone Number"
          value={formData.phone || ""}
          onChange={handleChange}
          disabled={isSubmitting}
          error={errors.phone}
          placeholder="Enter your phone number"
        />
        <FormField
          id="role"
          label="Role"
          value={formData.role}
          onChange={handleChange}
          disabled
          placeholder="User role"
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

// -------------------- SMALL HELPER COMPONENTS --------------------
function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <Label className="text-muted-foreground">{label}</Label>
      <p className="mt-1.5 text-base font-medium text-foreground">
        {value || <span className="text-muted-foreground">Not provided</span>}
      </p>
    </div>
  )
}

function FormField({
  id,
  label,
  value,
  onChange,
  disabled,
  placeholder,
  error,
  type = "text",
}: {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled?: boolean
  placeholder?: string
  error?: string
  type?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        className={`transition-colors duration-150 ${
          error ? "border-destructive focus-visible:ring-destructive" : ""
        }`}
      />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}
