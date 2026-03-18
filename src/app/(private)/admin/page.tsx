import { getCustomSession } from "@/actions/auth.action";
import { getUsers, getVendors } from "./_actions";
import UserFilters from "./_components/user-filter";
import UserTable from "./_components/user-table";
import { signOut } from "@/lib/auth-client";
import { forbidden } from "next/navigation";
import UserProfileCard from "./_components/current-user-card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

export default async function UsersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const { session, user } = await getCustomSession();

  if (!session) {
    await signOut();
    return forbidden();
  }

  const status = (searchParams.status as string) || "active";
  const search = (searchParams.search as string) || "";
  const vendorId = (searchParams.vendorId as string) || "";
  const isBannedView = status === "banned";

  const [users, vendors] = await Promise.all([
    getUsers(user.role!, search, isBannedView, vendorId),
    getVendors(),
  ]);

  const getStatusUrl = (newStatus: string) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else if (value) {
        params.set(key, value);
      }
    });
    params.set("status", newStatus);
    return `/admin?${params.toString()}`;
  };

  return (
    <div className="p-6 space-y-6">
      <UserProfileCard user={user} />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Tabs defaultValue={status} className="w-auto">
            <TabsList>
              <Link href={getStatusUrl("active")}>
                <TabsTrigger value="active">Active Users</TabsTrigger>
              </Link>
              <Link href={getStatusUrl("banned")}>
                <TabsTrigger value="banned">Banned Users</TabsTrigger>
              </Link>
            </TabsList>
          </Tabs>
        </div>

        <UserFilters
          defaultValue={search}
          vendors={vendors}
          selectedVendor={vendorId}
          showVendorFilter={user.role === "BOSS" || user.role === "TADMIN"}
        />
      </div>

      <UserTable users={users as any} showBannedView={isBannedView} />
    </div>
  );
}
