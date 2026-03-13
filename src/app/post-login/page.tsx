import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { UserRoleEnum } from "@/utils/constant";
import { headers } from "next/headers";

export default async function PostLoginPage() {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }

  if (!session) {
    redirect("/auth/login");
  }

  const role = session.user?.role as UserRoleEnum | undefined;
  if (
    [UserRoleEnum.ADMIN, UserRoleEnum.VENDOR, UserRoleEnum.BOSS].includes(
      role as UserRoleEnum
    )
  ) {
    redirect("/vendor-portal");
  }

  redirect("/dashboard");
}
