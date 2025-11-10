import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import UserRoleBadge from "../../admin/_components/user-badge"
 
export default function ProfileCard({ user }: any) {
  return (
    <div className="space-y-4">
      <Card className="border shadow-sm">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-xl font-semibold">{user.name}</CardTitle>
            <p className="text-muted-foreground">{user.email}</p>
            <UserRoleBadge role={user.role} />
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          <p><span className="font-semibold">Phone:</span> {user.phone || "—"}</p>
          <p><span className="font-semibold">Status:</span> {user.banned ? "Banned" : "Active"}</p>
          {user.banReason && <p><span className="font-semibold">Ban Reason:</span> {user.banReason}</p>}
        </CardContent>
      </Card>

      {user.Vendor && (
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Vendor Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Vendor Name:</span> {user.Vendor.name}</p>
            <p><span className="font-semibold">GST Number:</span> {user.Vendor.gstNumber || "—"}</p>
            <p><span className="font-semibold">PAN:</span> {user.Vendor.panNumber || "—"}</p>
            <p><span className="font-semibold">Contact Email:</span> {user.Vendor.contactEmail || "—"}</p>
            <p><span className="font-semibold">Phone:</span> {user.Vendor.contactPhone || "—"}</p>
            <p><span className="font-semibold">Profile Completed:</span> {user.Vendor.profileCompleted ? "✅ Yes" : "❌ No"}</p>
            <p><span className="font-semibold">Payment Terms:</span> {user.Vendor.paymentTerms || "—"}</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
