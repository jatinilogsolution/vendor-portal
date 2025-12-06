import { getCustomSession } from "@/actions/auth.action"
import { ProfileContent } from "../_components/profile-content"


interface Props {
  params: Promise<{ id: string }>
}

export default async function ProfilePage({ params }: Props) {
  const session = await getCustomSession()
  const { id } = await params

  // Check if user is admin or tadmin
  if (!["ADMIN", "TADMIN", "BOSS"].includes(session.user.role!)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <h1 className="text-2xl font-bold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this profile.</p>
      </div>
    )
  }

  return (
    <ProfileContent userId={id} readOnly={true} />
  )
}
