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
        if (!password) return toast.error("Please enter your email.");

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
         
            </div>

 <div className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="email">Email</Label>
                    <Input type="email" name="email" placeholder="Enter your email" required />

                </div>
            <div className="flex flex-col gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input type="password" id="password" name="password" />
            </div>

            <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input type="password" id="confirmPassword" name="confirmPassword" />
            </div>


  <Button variant={"default"} type="submit" disabled={isPending}>
                    {isPending ? "Sending..." : "Send Reset Link"}
                </Button>

             </div>
        </form>
    );
};
 