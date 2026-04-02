"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { resetPassword } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
    token: string;
}

export const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault();
        const formData = new FormData(evt.currentTarget);

        const password = String(formData.get("password"));
        if (!password) return toast.error("Please enter your new password.");

        const confirmPassword = String(formData.get("confirmPassword"));

        if (password !== confirmPassword) {
            return toast.error("Passwords do not match.");
        }

        await resetPassword({
            newPassword: password,
            token,
            fetchOptions: {
                onRequest: () => {
                    setIsPending(true);
                },
                onResponse: () => {
                    setIsPending(false);
                },
                onError: (ctx) => {
                    console.log(ctx.error.message)
                    toast.error(ctx.error.message);
                },
                onSuccess: () => {
                    toast.success("Password reset successfully.");
                    router.push("/auth/login");
                },
            },
        });
    }

    return (
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>

            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create New Password</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your new password below to finish resetting your account.
                </p>
            </div>

            <div className="grid gap-6">
            <div className="flex flex-col gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input type="password" id="password" name="password" required />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" required />
            </div>


                <Button variant={"default"} type="submit" disabled={isPending}>
                    {isPending ? "Resetting..." : "Reset Password"}
                </Button>

            </div>
        </form>
    );
};
 
