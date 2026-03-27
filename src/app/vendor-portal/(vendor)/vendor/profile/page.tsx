// src/app/vendor-portal/(vendor)/vendor/profile/page.tsx
"use client"

import { useEffect, useState, useTransition, useCallback } from "react"
import { useForm, Control, Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { useSession } from "@/lib/auth-client"
import {
  Form, FormControl, FormField, FormItem,
  FormLabel, FormMessage,
} from "@/components/ui/form"
import { Input }   from "@/components/ui/input"
import { Button }  from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge }   from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import { VpPageHeader }  from "@/components/ui/vp-page-header"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { bankDetailsSchema, BankDetailsValues } from "@/validations/vp/bank-details"
import {
  getVpVendorBankDetails,
  upsertVpVendorBankDetails,
} from "@/actions/vp/bank-details.action"
import {
  IconBuildingStore, IconCreditCard,
  IconCheck, IconShieldCheck, IconPencil, IconUser, IconMapPin
} from "@tabler/icons-react"
import { X } from "lucide-react"

// Import components and actions from the main profile module
import { UserProfileForm } from "@/app/(private)/profile/_components/user-profile-form"
import { VendorProfileForm } from "@/app/(private)/profile/_components/vendor-profile-form"
import { AddressForm } from "@/app/(private)/profile/_components/address-form"
import { getUserProfile } from "@/app/(private)/profile/_action/profile"
import { VP_BILLING_TYPE_LABELS, VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"

export default function VendorProfilePage() {
  const { data: session }            = useSession()
  const [profileData, setProfileData] = useState<any>(null)
  const [bankDetails, setBankDetails]= useState<any>(null)
  const [loading, setLoading]        = useState(true)
  const [isPending, startTransition] = useTransition()
  
  const [editingSection, setEditingSection] = useState<'personal' | 'vendor' | 'address' | null>(null)

  const bankForm = useForm<BankDetailsValues>({
    resolver: zodResolver(bankDetailsSchema) as Resolver<BankDetailsValues>,
    defaultValues: {
      accountHolderName: "",
      accountNumber:     "",
      ifscCode:          "",
      bankName:          "",
      branch:            "",
      accountType:       "CURRENT",
    },
  })

  const loadAllData = useCallback(async () => {
    if (!session?.user?.id) return
    
    try {
      setLoading(true)
      // 1. Fetch core profile (User, Vendor, Address, Documents)
      const res = await getUserProfile(session.user.id)
      if (res.error) {
        toast.error(res.error)
      } else {
        setProfileData(res)
      }

      // 2. Fetch VP specific profile (Portal config) via API
      const vpRes = await fetch("/api/vp/my-profile")
      if (vpRes.ok) {
        const vpData = await vpRes.json()
        setProfileData((prev: any) => ({ ...prev, vp: vpData?.Vendor?.vpVendors?.[0] }))
        
        const vpvId = vpData?.Vendor?.vpVendors?.[0]?.id
        if (vpvId) {
          const bankRes = await getVpVendorBankDetails(vpvId)
          if (bankRes.success && bankRes.data) {
            setBankDetails(bankRes.data)
            bankForm.reset({
              accountHolderName: bankRes.data.accountHolderName,
              accountNumber:     bankRes.data.accountNumber,
              ifscCode:          bankRes.data.ifscCode,
              bankName:          bankRes.data.bankName,
              branch:            bankRes.data.branch ?? "",
              accountType:       bankRes.data.accountType === "SAVINGS" ? "SAVINGS" : "CURRENT",
            })
          }
        }
      }
    } catch (err) {
      console.error("Error loading profile:", err)
      toast.error("Failed to load profile data")
    } finally {
      setLoading(false)
    }
  }, [session?.user?.id, bankForm])

  useEffect(() => {
    loadAllData()
  }, [loadAllData])

  const handleBankSave = (values: BankDetailsValues) => {
    const vpvId = profileData?.vp?.id
    if (!vpvId) { toast.error("Vendor portal record not found"); return }

    startTransition(async () => {
      const res = await upsertVpVendorBankDetails(vpvId, values)
      if (!res.success) { toast.error(res.error); return }
      toast.success("Bank details saved")
      setBankDetails(res.data)
    })
  }

  if (loading) return (
    <div className="space-y-6">
       <VpPageHeader title="My Profile" description="Loading your details..." />
       <div className="grid gap-6 lg:grid-cols-2">
         <div className="h-64 animate-pulse rounded-lg bg-muted" />
         <div className="h-64 animate-pulse rounded-lg bg-muted" />
       </div>
    </div>
  )

  const user = profileData?.user
  const vendor = profileData?.vendor
  const vpv = profileData?.vp
  const address = profileData?.address
  const documents = profileData?.documents || []

  return (
    <div className="space-y-8 pb-10">
      <VpPageHeader
        title="My Profile"
        description="Manage your business information and portal settings."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: Personal and Company */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Personal Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <IconUser size={18} className="text-primary" />
                  Personal Information
                </CardTitle>
                <CardDescription className="text-xs">Your account login and identity details</CardDescription>
              </div>
              <Button 
                variant="ghost" size="icon-sm" 
                onClick={() => setEditingSection(editingSection === 'personal' ? null : 'personal')}
              >
                {editingSection === 'personal' ? <X size={16} className="text-destructive" /> : <IconPencil size={16} />}
              </Button>
            </CardHeader>
            <CardContent>
              <UserProfileForm
                user={user}
                isEditing={editingSection === 'personal'}
                onUpdate={(u) => { setProfileData((p:any) => ({...p, user: u})); setEditingSection(null) }}
                onCancel={() => setEditingSection(null)}
              />
            </CardContent>
          </Card>

          {/* Company Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <IconBuildingStore size={18} className="text-primary" />
                  Company Information
                </CardTitle>
                <CardDescription className="text-xs">Business registration and contact details</CardDescription>
              </div>
              <Button 
                variant="ghost" size="icon-sm" 
                onClick={() => setEditingSection(editingSection === 'vendor' ? null : 'vendor')}
              >
                {editingSection === 'vendor' ? <X size={16} className="text-destructive" /> : <IconPencil size={16} />}
              </Button>
            </CardHeader>
            <CardContent>
              {vendor && (
                <VendorProfileForm
                  vendor={vendor}
                  documents={documents}
                  isEditing={editingSection === 'vendor'}
                  onUpdate={(v) => { setProfileData((p:any) => ({...p, vendor: v})); setEditingSection(null) }}
                  onCancel={() => setEditingSection(null)}
                />
              )}
            </CardContent>
          </Card>

          {/* Address Details */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div className="space-y-1">
                <CardTitle className="text-base flex items-center gap-2">
                  <IconMapPin size={18} className="text-primary" />
                  Business Address
                </CardTitle>
                <CardDescription className="text-xs">Official correspondence address</CardDescription>
              </div>
              <Button 
                variant="ghost" size="icon-sm" 
                onClick={() => setEditingSection(editingSection === 'address' ? null : 'address')}
              >
                {editingSection === 'address' ? <X size={16} className="text-destructive" /> : <IconPencil size={16} />}
              </Button>
            </CardHeader>
            <CardContent>
              {address && (
                <AddressForm
                  address={address}
                  isEditing={editingSection === 'address'}
                  onUpdate={(a) => { setProfileData((p:any) => ({...p, address: a})); setEditingSection(null) }}
                  onCancel={() => setEditingSection(null)}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Portal Config and Bank */}
        <div className="space-y-6">
          {/* Portal Configuration — Read Only */}
          <Card className="bg-muted/30">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Portal Configuration</CardTitle>
              <CardDescription className="text-xs">Managed by AWL Admin</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              {vpv ? (
                <>
                  <Row label="Portal Status"><VpStatusBadge status={vpv.portalStatus} /></Row>
                  <Row label="Vendor Type"><VpStatusBadge status={vpv.vendorType} /></Row>
                  <Row label="Billing Type">
                    <div className="flex flex-wrap gap-1 justify-end">
                      {vpv.billingType?.split(',').map((bt: string) => (
                        <Badge key={bt} variant="outline" className="text-[10px] px-1.5 py-0 capitalize font-normal">
                          {VP_BILLING_TYPE_LABELS[bt.trim() as keyof typeof VP_BILLING_TYPE_LABELS] || bt}
                        </Badge>
                      ))}
                    </div>
                  </Row>
                  {vpv.recurringCycle && (
                    <Row label="Cycle"><Badge variant="secondary" className="text-[10px] py-0">{VP_RECURRING_CYCLE_LABELS[vpv.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS] || vpv.recurringCycle}</Badge></Row>
                  )}
                  {vpv.category && (
                    <Row label="Category">{vpv.category.name}</Row>
                  )}
                </>
              ) : (
                <p className="text-muted-foreground text-xs italic">
                  Not yet enrolled in the vendor portal.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Bank Details */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <IconCreditCard size={18} className="text-primary" />
                Bank Information
                {bankDetails?.verifiedAt && (
                  <Badge className="ml-2 gap-1 bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-none px-1.5">
                    <IconShieldCheck size={12} />
                    Verified
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...bankForm}>
                <form onSubmit={bankForm.handleSubmit(handleBankSave)} className="space-y-4">
                  <div className="space-y-4">
                    <FormField control={bankForm.control} name="accountHolderName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Account Holder Name</FormLabel>
                        <FormControl><Input className="h-8 text-sm" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <div className="grid grid-cols-2 gap-3">
                      <FormField control={bankForm.control} name="ifscCode" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">IFSC Code</FormLabel>
                          <FormControl><Input className="h-8 text-sm uppercase" {...field} onChange={e => field.onChange(e.target.value.toUpperCase())} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={bankForm.control} name="accountType" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs">Type</FormLabel>
                          <Select value={field.value} onValueChange={field.onChange}>
                            <FormControl><SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="CURRENT">Current</SelectItem>
                              <SelectItem value="SAVINGS">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )} />
                    </div>

                    <FormField control={bankForm.control} name="accountNumber" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Account Number</FormLabel>
                        <FormControl><Input className="h-8 text-sm" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />

                    <FormField control={bankForm.control} name="bankName" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Bank Name</FormLabel>
                        <FormControl><Input className="h-8 text-sm" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <Button type="submit" size="sm" className="w-full mt-2" disabled={isPending}>
                    {isPending ? "Updating..." : "Save Bank Details"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-2 border-b border-dashed pb-2 last:border-0 last:pb-0">
      <span className="shrink-0 text-muted-foreground text-xs">{label}</span>
      <div className="text-right font-medium">{children}</div>
    </div>
  )
}
