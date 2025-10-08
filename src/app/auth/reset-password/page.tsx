import { ResetPasswordForm } from "@/components/forms/auth/reset-password-form";
// import { Link } from "@/components/link";

import { redirect } from "next/navigation";

interface PageProps {
    searchParams: Promise<{ token: string }>;
}






// import { Strong } from "@/components/text";
// import { ArrowLongLeftIcon } from "@heroicons/react/20/solid";

export default async function Page({ searchParams }: PageProps) {
    const token = (await searchParams).token;

    if (!token) redirect("/auth/login");
    return (
         
            <ResetPasswordForm token={token} />
        
    );
}
