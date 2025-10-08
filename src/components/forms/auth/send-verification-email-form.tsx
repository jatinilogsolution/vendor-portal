"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { sendVerificationEmail } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export const SendVerificationEmailForm = ({ className,
    ...props
}: React.ComponentProps<"form">) => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);
        const email = String(formData.get("email"));

        if (!email) return toast.error("Please enter your email.");

        await sendVerificationEmail({
            email,
            callbackURL: "/auth/verify",
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Verification email sent successfully.");
                    router.push("/auth/login");
                },
            },
        });
    }

    return (

        <form

            onSubmit={handleSubmit}

            className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Send Verification Email</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email and we’ll send you a link to verify your account.
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" placeholder="Enter your email" required />

                </div>

                <Button variant={"default"} type="submit" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>




            </div>

        </form>



    );
};


