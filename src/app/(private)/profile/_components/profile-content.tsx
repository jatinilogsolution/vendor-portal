"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserProfileForm } from "./user-profile-form"
import { VendorProfileForm } from "./vendor-profile-form"
import { AddressForm } from "./address-form"
import { ProfileHeader } from "./profile-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, X } from "lucide-react"
import { getUserProfile } from "../_action/profile"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Address, User, Vendor } from "@/generated/prisma/client"
import { useSession } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { IconEdit } from "@tabler/icons-react"

export function ProfileContent() {
  const { data, isPending } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [address, setAddress] = useState<Address | null | undefined>(null)
  const [editingSection, setEditingSection] = useState<'personal' | 'vendor' | 'address' | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const result = await getUserProfile(userId)

      if (result.error) {
        setError(result.error)
      } else {
        setUser(result.user)
        setVendor(result.vendor)
        setAddress(result.address)
      }
    } catch (err) {
      console.error("[Profile] Error loading profile:", err)
      setError("Failed to load profile")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isPending && data?.user?.id) {
      fetchProfile(data.user.id)
    }
  }, [isPending, data?.user?.id, fetchProfile])

  const handleUserUpdate = (updatedUser: User) => {
    setUser(updatedUser)
    setEditingSection(null)
  }

  const handleVendorUpdate = (updatedVendor: Vendor) => {
    setVendor(updatedVendor)
    setEditingSection(null)
  }

  const handleAddressUpdate = (updatedAddress: Address) => {
    setAddress(updatedAddress)
    setEditingSection(null)
  }

  if (isPending || isLoading) {
    return (
      <div className="container mx-auto flex min-h-screen items-center justify-center py-8 px-4">
        <Spinner />
      </div>
    )
  }

  if (error || !user) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error || "Failed to load profile"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <ProfileHeader
        user={user}

      />

      <div className="mt-8 space-y-6">

        <Card>


          <CardHeader className=" flex items-center justify-between">
            <div className=" space-y-2">

              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Manage your personal information and account settings</CardDescription>
            </div>

            <Button variant={"secondary"} size={"icon-sm"} onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')} className="gap-2">
              {editingSection === "personal" ? <X className="h-4 w-4 text-destructive" /> : <IconEdit className="h-4 w-4 text-primary" />
              }
            </Button>

          </CardHeader>
          <CardContent>
            <UserProfileForm
              user={user}
              isEditing={editingSection === 'personal'}
              onUpdate={handleUserUpdate}
              onCancel={() => setEditingSection(null)}
            />
          </CardContent>
        </Card>

        {/* Vendor Information Card */}
        {vendor && (
          <Card>
            <CardHeader className=" flex items-center justify-between">
              <div className=" space-y-2">

                <CardTitle>Vendor Information</CardTitle>
                <CardDescription>Manage your vendor profile and business details</CardDescription>
              </div>

              <Button variant={"secondary"} size={"icon-sm"} onClick={() => setEditingSection(editingSection === 'vendor' ? null : 'vendor')} className="gap-2">
                {editingSection === "vendor" ? <X className="h-4 w-4 text-destructive" /> : <IconEdit className="h-4 w-4 text-primary" />
                }
              </Button>

            </CardHeader>
            <CardContent>
              <VendorProfileForm
                vendor={vendor}
                isEditing={editingSection === 'vendor'}
                onUpdate={handleVendorUpdate}
                onCancel={() => setEditingSection(null)}
              />
            </CardContent>
          </Card>
        )}

        {/* Address Card */}
        {address && (
          <Card>
            <CardHeader className=" flex items-center justify-between">
              <div className=" space-y-2">

                <CardTitle>Business Address</CardTitle>
                <CardDescription>Manage your business address and location details</CardDescription>
              </div>

              <Button variant={"secondary"} size={"icon-sm"} onClick={() => setEditingSection(editingSection === 'address' ? null : 'address')} className="gap-2">
                {editingSection === "address" ? <X className="h-4 w-4 text-destructive" /> : <IconEdit className="h-4 w-4 text-primary" />
                }
              </Button>
            </CardHeader>
            <CardContent>
              <AddressForm
                address={address}
                isEditing={editingSection === 'address'}
                onUpdate={handleAddressUpdate}
                onCancel={() => setEditingSection(null)}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}