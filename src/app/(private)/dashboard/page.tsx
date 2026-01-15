import { getCustomSession } from "@/actions/auth.action"
import { redirect } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import { getDashboardStats } from "./_actions/dashboard"
import DashboardClient from "./_components/dashboard-client"

export default async function DashboardPage() {
  const { session, user } = await getCustomSession()

  if (!session) {
    await signOut()
    redirect("/auth/login")
  }

  const dashboardData = await getDashboardStats()

  if ("error" in dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-destructive">Error Loading Dashboard</h2>
          <p className="text-muted-foreground mt-2">{dashboardData.error}</p>
        </div>
      </div>
    )
  }

  return <DashboardClient data={dashboardData.data!} userName={user.name} />
}
