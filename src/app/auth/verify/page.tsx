import { SendVerificationEmailForm } from "@/components/forms/auth/send-verification-email-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function Page({ searchParams }: PageProps) {
  const error = (await searchParams).error;

  if (!error) {
    return (
      <div className="flex flex-col gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <h1 className="text-2xl font-bold">Email Verified</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Your email address has been verified successfully. You can now sign in and continue to the portal.
          </p>
        </div>
        <Button asChild>
          <Link href="/auth/login">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <SendVerificationEmailForm error={error} />
  );
}
