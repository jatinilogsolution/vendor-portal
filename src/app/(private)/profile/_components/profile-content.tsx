"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserProfileForm } from "./user-profile-form"
import { VendorProfileForm } from "./vendor-profile-form"
import { AddressForm } from "./address-form"
import { ProfileHeader } from "./profile-header"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { getUserProfile } from "../_action/profile"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Address, User, Vendor } from "@/generated/prisma"
import { useSession } from "@/lib/auth-client"

export function ProfileContent() {
  const { data, isPending } = useSession()

  const [user, setUser] = useState<User | null>(null)
  const [vendor, setVendor] = useState<Vendor | null>(null)
  const [address, setAddress] = useState<Address | null | undefined>(null)
  const [isEditing, setIsEditing] = useState(false)
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
    setIsEditing(false)
  }

  const handleVendorUpdate = (updatedVendor: Vendor) => {
    setVendor(updatedVendor)
    setIsEditing(false)
  }

  const handleAddressUpdate = (updatedAddress: Address) => {
    setAddress(updatedAddress)
    setIsEditing(false)
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
    <div className="container mx-auto py-8 px-4">
      <ProfileHeader user={user} isEditing={isEditing} onEditToggle={() => setIsEditing(!isEditing)} />

      <Tabs defaultValue="personal" className="mt-8">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          {vendor && <TabsTrigger value="vendor">Vendor Information</TabsTrigger>}
          {address && <TabsTrigger value="address">Address</TabsTrigger>}
        </TabsList>

        <TabsContent value="personal" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Details</CardTitle>
              <CardDescription>Manage your personal information and account settings</CardDescription>
            </CardHeader>
            <CardContent>
              <UserProfileForm
                user={user}
                isEditing={isEditing}
                onUpdate={handleUserUpdate}
                onCancel={() => setIsEditing(false)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {vendor && (
          <TabsContent value="vendor" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
                <CardDescription>Manage your vendor profile and business details</CardDescription>
              </CardHeader>
              <CardContent>
                <VendorProfileForm
                  vendor={vendor}
                  isEditing={isEditing}
                  onUpdate={handleVendorUpdate}
                  onCancel={() => setIsEditing(false)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {address && (
          <TabsContent value="address" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Business Address</CardTitle>
                <CardDescription>Manage your business address and location details</CardDescription>
              </CardHeader>
              <CardContent>
                <AddressForm
                  address={address}
                  isEditing={isEditing}
                  onUpdate={handleAddressUpdate}
                  onCancel={() => setIsEditing(false)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
