 
import { prisma } from "@/lib/prisma"
import ProfileCard from "../_components/profile-card"
 
interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {

  const {id} = await params
  const user = await prisma.user.findUnique({
    where: { id: id },
    include: {
      Vendor: {
        include: {
          Address: true,
          PurchaseOrder: true,
          invoices: true,
        },
      },
    },
  })

  if (!user) {
    return <div className="p-6 text-center text-muted-foreground">User not found.</div>
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">User Profile</h1>
      <ProfileCard user={user} />
    </div>
  )
}
