 

import { getCustomSession } from "@/actions/auth.action"
import { UserRoleEnum } from "@/utils/constant"
import { redirect } from "next/navigation"
import { UserList } from "./_components/user-list"
import { UserSearch } from "./_components/user-search"
import { Suspense } from "react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"
 
import UserProfileCard from "./_components/user-card"

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



  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-dvh">
          <Spinner />
        </div>
      }
    >
      <div className="  py-6 space-y-8">
        <UserProfileCard user={user as any} />

 
   
   <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 py-6">
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            All Users
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage users, search, and create new accounts
          </p>
        </div>
        <div className="w-full lg:max-w-md">
          <UserSearch />
        </div>
      </div>

      {/* User List Section */}
      <div className="mt-4">
        <UserList
          page={page}
          name={name}
          user={{
            id: user.id,
                role: user.role as UserRoleEnum,
          }}
        />
      </div>
    </div>
      </div>
    </Suspense>
  )
}
