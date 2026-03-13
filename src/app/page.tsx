
import Hero from "@/components/modules/hero";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

const page = async () => {
  let session: Awaited<ReturnType<typeof auth.api.getSession>> | null = null;
  try {
    session = await auth.api.getSession({ headers: await headers() });
  } catch {
    session = null;
  }

  if (session) {
    redirect("/post-login");
  }

  return (
    <>
      <Hero />
    </>
  );
};

export default page;
