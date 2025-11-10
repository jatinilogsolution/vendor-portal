import { getCustomSession } from "@/actions/auth.action"
import { getUsers } from "./_actions"
import UserFilters from "./_components/user-filter"
import UserTable from "./_components/user-table"
import { signOut } from "@/lib/auth-client"
import { forbidden } from "next/navigation"
import UserProfileCard from "./_components/current-user-card"
import { CreateNewUserButton } from "./_components/create-new-user"




export default async function UsersPage() {
  const { session, user } = await getCustomSession()

  if (!session) {
    await signOut()
    return forbidden()
  }
  const users = await getUsers(user.role!)

  return (
    <div className="p-6 space-y-6">
      {/* <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Users</h1>
        {(user.role! === "ADMIN" ||
          user.role! === "TADMIN" ||
          user.role! === "BOSS") && (
            <CreateNewUserButton />
          )}
      </div> */}
      <UserProfileCard user={user} />

      <UserFilters
        onSearch={async (search) => {
          "use server"
          await getUsers(user.role!, search)
        }}
      />

      <UserTable users={users as any} />
    </div>
  )
}
