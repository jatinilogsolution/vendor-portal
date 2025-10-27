import { getCustomSession } from "@/actions/auth.action"
import { getGreeting, UserRoleEnum } from "@/utils/constant"
import { CreateNewUserButton } from "./_components/create-new-user"
import { redirect } from "next/navigation"
import { UserList } from "./_components/user-list"
import { UserSearch } from "./_components/user-search"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Shield, Calendar } from "lucide-react"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { user } = await getCustomSession()

  if (![UserRoleEnum.BOSS, UserRoleEnum.ADMIN, UserRoleEnum.TADMIN].includes(user.role as UserRoleEnum)) {
    redirect("/dashboard")
  }

  const searchParam = await searchParams
  const page = searchParam?.page ? Number(searchParam.page) : 1
  const name = typeof searchParam?.name === "string" ? searchParam.name : ""

  const getRoleBadgeVariant = (role: string | null | undefined) => {
    switch (role) {
      case UserRoleEnum.BOSS:
        return "destructive"
      case UserRoleEnum.ADMIN:
        return "default"
      case UserRoleEnum.TADMIN:
        return "secondary"
      default:
        return "outline"
    }
  }

  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }



 

  return (
      <Suspense fallback={<div className=" flex items-center justify-center h-dvh"><Spinner /></div>}>

    <div className="space-y-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <Avatar className="size-14 md:size-16">
              <AvatarImage src={user.image || undefined} alt={user.name} />
              <AvatarFallback className="text-lg font-semibold">{getUserInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="scroll-m-20 text-2xl md:text-3xl font-bold tracking-tight">
                  {getGreeting()}, {user.name}
                </h2>
                <Badge variant={getRoleBadgeVariant(user.role)} className="h-6">
                  <Shield className="size-3" />
                  {user.role}
                </Badge>
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>{user.email}</p>
                <div className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  <span>Joined {formatDate(user.createdAt)}</span>
                </div>
                {user.vendorId && <p className="text-xs">Vendor ID: {user.vendorId}</p>}
              </div>
            </div>
          </div>

          <CreateNewUserButton />
        </div>

      </div>


      <Card>
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-semibold">All Users</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Manage users, search, and create new accounts</p>
          </div>
          <UserSearch />
        </CardHeader>

        <CardContent>
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            }
          >
            <UserList
              page={page}
              name={name}
              user={{
                id: user.id,
                role: user.role as UserRoleEnum,
              }}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
    </Suspense>

  )
}
