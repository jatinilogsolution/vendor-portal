"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { VpStatusBadge } from "@/components/ui/vp-status-badge"
import { VP_BILLING_TYPE_LABELS, VP_RECURRING_CYCLE_LABELS } from "@/types/vendor-portal"

type DateValue = string | Date | null

export type VpUserDetails = {
    id: string
    name: string
    email: string
    role: string
    image: string | null
    phone: string | null
    companyId: string | null
    vendorId: string | null
    vendorName: string | null
    emailVerified: boolean
    createdAt: DateValue
    updatedAt: DateValue
    banned: boolean | null
    banReason: string | null
    banExpires: DateValue
    providers: string[]
    sessionCount: number
    lastSessionAt: DateValue
    vendorProfile: {
        id: string
        name: string
        contactEmail: string | null
        contactPhone: string | null
        gstNumber: string | null
        panNumber: string | null
        taxId: string | null
        paymentTerms: string | null
        profileCompleted: boolean
        isActive: boolean
        address: {
            line1: string
            line2: string | null
            city: string
            state: string | null
            postal: string | null
            country: string
        } | null
        vpVendor: {
            id: string
            portalStatus: string
            vendorType: string
            billingType: string | null
            recurringCycle: string | null
            restrictInvoiceToDefaultCompany: boolean
            category: { id: string; name: string } | null
            defaultInvoiceCompany: { id: string; name: string; code: string | null } | null
            assignedCompanies: { id: string; name: string; code: string | null }[]
            bankDetails: {
                accountHolderName: string
                accountNumber: string
                ifscCode: string
                bankName: string
                branch: string | null
                accountType: string
                verifiedAt: DateValue
            } | null
        } | null
        documents: {
            id: string
            label: string
            url: string
            linkedCode: string | null
            description: string | null
        }[]
    } | null
}

interface VpUserDetailsSheetProps {
    open: boolean
    user: VpUserDetails | null
    currentUserId?: string
    canManageBan: boolean
    canDeleteUser?: boolean
    actionPending: boolean
    onOpenChange: (open: boolean) => void
    onBan: (user: VpUserDetails) => void
    onUnban: (user: VpUserDetails) => void
    onDelete?: (user: VpUserDetails) => void
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
})

function formatDateTime(value: DateValue) {
    if (!value) return "—"

    const parsed = value instanceof Date ? value : new Date(value)
    if (Number.isNaN(parsed.getTime())) return "—"
    return dateFormatter.format(parsed)
}

function formatProviderName(provider: string) {
    return provider
        .split(/[-_]/g)
        .filter(Boolean)
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(" ")
}

function maskAccountNumber(accountNumber: string) {
    if (accountNumber.length <= 4) return accountNumber
    return `${"*".repeat(Math.max(0, accountNumber.length - 4))}${accountNumber.slice(-4)}`
}

function DetailItem({
    label,
    value,
    mono = false,
}: {
    label: string
    value: string
    mono?: boolean
}) {
    return (
        <div className="space-y-1">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {label}
            </p>
            <p className={mono ? "break-all font-mono text-xs text-foreground" : "text-sm text-foreground"}>
                {value}
            </p>
        </div>
    )
}

export function VpUserDetailsSheet({
    open,
    user,
    currentUserId,
    canManageBan,
    canDeleteUser = false,
    actionPending,
    onOpenChange,
    onBan,
    onUnban,
    onDelete,
}: VpUserDetailsSheetProps) {
    if (!user) return null

    const isCurrentUser = currentUserId === user.id

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
                <SheetHeader className="border-b pb-4">
                    <div className="flex items-start gap-3 pr-8">
                        <Avatar className="size-12">
                            <AvatarImage src={user.image ?? undefined} alt={user.name} />
                            <AvatarFallback>{user.name.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <SheetTitle>{user.name}</SheetTitle>
                                <Badge variant="outline">{user.role}</Badge>
                                <VpStatusBadge status={user.banned ? "INACTIVE" : "ACTIVE"} />
                                {isCurrentUser && <Badge variant="secondary">Current user</Badge>}
                            </div>
                            <SheetDescription>{user.email}</SheetDescription>
                        </div>
                    </div>
                </SheetHeader>

                <div className="space-y-6 p-4">
                    {user.banned && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                            <p className="font-medium">This user is currently banned.</p>
                            <p className="mt-1 text-red-800">
                                Reason: {user.banReason?.trim() || "No reason provided"}
                            </p>
                            <p className="mt-1 text-red-800">
                                Expires: {formatDateTime(user.banExpires)}
                            </p>
                        </div>
                    )}

                    <section className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold">Account</h3>
                            <p className="text-sm text-muted-foreground">
                                Core identity and verification details.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <DetailItem label="User ID" value={user.id} mono />
                            <DetailItem label="Email Verified" value={user.emailVerified ? "Yes" : "No"} />
                            <DetailItem label="Phone" value={user.phone || "—"} />
                            <DetailItem label="Company ID" value={user.companyId || "—"} mono={Boolean(user.companyId)} />
                            <DetailItem label="Created At" value={formatDateTime(user.createdAt)} />
                            <DetailItem label="Updated At" value={formatDateTime(user.updatedAt)} />
                        </div>
                    </section>

                    {user.vendorProfile && (
                        <>
                            <Separator />

                            <section className="space-y-4">
                                <div>
                                    <h3 className="text-sm font-semibold">Vendor Details</h3>
                                    <p className="text-sm text-muted-foreground">
                                        Full vendor profile linked to this user.
                                    </p>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <DetailItem label="Vendor Name" value={user.vendorProfile.name} />
                                    <DetailItem label="Vendor ID" value={user.vendorProfile.id} mono />
                                    <DetailItem label="Contact Email" value={user.vendorProfile.contactEmail || "—"} />
                                    <DetailItem label="Contact Phone" value={user.vendorProfile.contactPhone || "—"} />
                                    <DetailItem label="GST Number" value={user.vendorProfile.gstNumber || "—"} />
                                    <DetailItem label="PAN Number" value={user.vendorProfile.panNumber || "—"} />
                                    <DetailItem label="Tax ID" value={user.vendorProfile.taxId || "—"} />
                                    <DetailItem label="Payment Terms" value={user.vendorProfile.paymentTerms || "—"} />
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Badge variant="outline">
                                        {user.vendorProfile.isActive ? "Vendor Active" : "Vendor Inactive"}
                                    </Badge>
                                    {user.vendorProfile.profileCompleted && (
                                        <Badge variant="outline">Profile Complete</Badge>
                                    )}
                                </div>
                            </section>

                            {user.vendorProfile.address && (
                                <>
                                    <Separator />
                                    <section className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-semibold">Business Address</h3>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <DetailItem label="Address Line 1" value={user.vendorProfile.address.line1} />
                                            <DetailItem label="Address Line 2" value={user.vendorProfile.address.line2 || "—"} />
                                            <DetailItem label="City" value={user.vendorProfile.address.city} />
                                            <DetailItem label="State" value={user.vendorProfile.address.state || "—"} />
                                            <DetailItem label="Postal Code" value={user.vendorProfile.address.postal || "—"} />
                                            <DetailItem label="Country" value={user.vendorProfile.address.country} />
                                        </div>
                                    </section>
                                </>
                            )}

                            {user.vendorProfile.vpVendor && (
                                <>
                                    <Separator />
                                    <section className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-semibold">Portal Enrollment</h3>
                                            <p className="text-sm text-muted-foreground">
                                                Vendor portal settings and linked finance setup.
                                            </p>
                                        </div>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <DetailItem label="Portal Vendor ID" value={user.vendorProfile.vpVendor.id} mono />
                                            <DetailItem
                                                label="Restrict To Default Company"
                                                value={user.vendorProfile.vpVendor.restrictInvoiceToDefaultCompany ? "Yes" : "No"}
                                            />
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Portal Status
                                                </p>
                                                <VpStatusBadge status={user.vendorProfile.vpVendor.portalStatus} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                    Vendor Type
                                                </p>
                                                <VpStatusBadge status={user.vendorProfile.vpVendor.vendorType} />
                                            </div>
                                            <DetailItem
                                                label="Category"
                                                value={user.vendorProfile.vpVendor.category?.name || "—"}
                                            />
                                            <DetailItem
                                                label="Default Invoice Company"
                                                value={user.vendorProfile.vpVendor.defaultInvoiceCompany?.name || "—"}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Billing Type
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.vendorProfile.vpVendor.billingType ? (
                                                    user.vendorProfile.vpVendor.billingType.split(",").map((billingType) => {
                                                        const key = billingType.trim() as keyof typeof VP_BILLING_TYPE_LABELS
                                                        return (
                                                            <Badge key={billingType} variant="outline">
                                                                {VP_BILLING_TYPE_LABELS[key] || billingType.trim()}
                                                            </Badge>
                                                        )
                                                    })
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </div>
                                        </div>
                                        <DetailItem
                                            label="Recurring Cycle"
                                            value={
                                                user.vendorProfile.vpVendor.recurringCycle
                                                    ? VP_RECURRING_CYCLE_LABELS[user.vendorProfile.vpVendor.recurringCycle as keyof typeof VP_RECURRING_CYCLE_LABELS]
                                                        || user.vendorProfile.vpVendor.recurringCycle
                                                    : "—"
                                            }
                                        />
                                        <div className="space-y-2">
                                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                                Assigned Companies
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {user.vendorProfile.vpVendor.assignedCompanies.length > 0 ? (
                                                    user.vendorProfile.vpVendor.assignedCompanies.map((company) => (
                                                        <Badge key={company.id} variant="outline">
                                                            {company.name}
                                                        </Badge>
                                                    ))
                                                ) : (
                                                    <span className="text-sm text-muted-foreground">—</span>
                                                )}
                                            </div>
                                        </div>
                                    </section>

                                    {user.vendorProfile.vpVendor.bankDetails && (
                                        <>
                                            <Separator />
                                            <section className="space-y-4">
                                                <div>
                                                    <h3 className="text-sm font-semibold">Bank Details</h3>
                                                </div>
                                                <div className="grid gap-4 sm:grid-cols-2">
                                                    <DetailItem
                                                        label="Account Holder"
                                                        value={user.vendorProfile.vpVendor.bankDetails.accountHolderName}
                                                    />
                                                    <DetailItem
                                                        label="Account Number"
                                                        value={maskAccountNumber(user.vendorProfile.vpVendor.bankDetails.accountNumber)}
                                                        mono
                                                    />
                                                    <DetailItem label="Bank Name" value={user.vendorProfile.vpVendor.bankDetails.bankName} />
                                                    <DetailItem label="IFSC Code" value={user.vendorProfile.vpVendor.bankDetails.ifscCode} mono />
                                                    <DetailItem label="Branch" value={user.vendorProfile.vpVendor.bankDetails.branch || "—"} />
                                                    <DetailItem label="Account Type" value={user.vendorProfile.vpVendor.bankDetails.accountType} />
                                                    <DetailItem
                                                        label="Verified At"
                                                        value={formatDateTime(user.vendorProfile.vpVendor.bankDetails.verifiedAt)}
                                                    />
                                                </div>
                                            </section>
                                        </>
                                    )}
                                </>
                            )}

                            {user.vendorProfile.documents.length > 0 && (
                                <>
                                    <Separator />
                                    <section className="space-y-4">
                                        <div>
                                            <h3 className="text-sm font-semibold">Documents</h3>
                                        </div>
                                        <div className="space-y-3">
                                            {user.vendorProfile.documents.map((document) => (
                                                <a
                                                    key={document.id}
                                                    href={document.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="block rounded-lg border p-3 transition-colors hover:bg-muted/40"
                                                >
                                                    <p className="text-sm font-medium">{document.label}</p>
                                                    <p className="mt-1 text-xs text-muted-foreground">
                                                        {document.linkedCode || document.description || "Open document"}
                                                    </p>
                                                </a>
                                            ))}
                                        </div>
                                    </section>
                                </>
                            )}
                        </>
                    )}

                    <Separator />

                    <section className="space-y-4">
                        <div>
                            <h3 className="text-sm font-semibold">Access</h3>
                            <p className="text-sm text-muted-foreground">
                                Provider and active session information.
                            </p>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <DetailItem label="Linked Vendor" value={user.vendorName || "—"} />
                            <DetailItem label="Vendor ID" value={user.vendorId || "—"} mono={Boolean(user.vendorId)} />
                            <DetailItem label="Session Count" value={String(user.sessionCount)} />
                            <DetailItem label="Last Session" value={formatDateTime(user.lastSessionAt)} />
                        </div>
                        <div className="space-y-2">
                            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                                Auth Providers
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {user.providers.length > 0 ? (
                                    user.providers.map((provider) => (
                                        <Badge key={provider} variant="outline">
                                            {formatProviderName(provider)}
                                        </Badge>
                                    ))
                                ) : (
                                    <span className="text-sm text-muted-foreground">—</span>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                <SheetFooter className="border-t">
                    <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>
                            Close
                        </Button>
                        {canManageBan && !isCurrentUser && (
                            <Button
                                variant={user.banned ? "outline" : "destructive"}
                                onClick={() => (user.banned ? onUnban(user) : onBan(user))}
                                disabled={actionPending}
                            >
                                {actionPending ? "Please wait..." : user.banned ? "Unban User" : "Ban User"}
                            </Button>
                        )}
                        {canDeleteUser && !isCurrentUser && onDelete && (
                            <Button
                                variant="destructive"
                                onClick={() => onDelete(user)}
                                disabled={actionPending}
                            >
                                {actionPending ? "Please wait..." : "Delete User"}
                            </Button>
                        )}
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
