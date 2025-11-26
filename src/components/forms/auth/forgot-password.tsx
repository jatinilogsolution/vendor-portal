"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Input } from "@/components/ui/input"
import {  requestPasswordReset } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"







import { cn } from "@/lib/utils"



export function ForgotPassword({
    className,
    ...props
}: React.ComponentProps<"form">) {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
        evt.preventDefault()
        const formData = new FormData(evt.currentTarget)
        const email = String(formData.get("email"))

        if (!email) return toast.error("Please enter your email.")

        await requestPasswordReset({
            email,
            
            redirectTo: "/auth/reset-password",
            fetchOptions: {
                onRequest: () => setIsPending(true),
                onResponse: () => setIsPending(false),
                // onError: (ctx)=>{ 
                //     console.log(JSON.stringify(ctx.error, null, 2))
                // },
                onError: (ctx :any) => { toast.error(ctx.error.statusText) },
                onSuccess: () => {
                    toast.success("Reset link sent to your email.")
                    router.push("/auth/login")
                },
            },
        })
    }



    return (



        <form

            onSubmit={handleSubmit}

            className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Reset your password</h1>
                <p className="text-muted-foreground text-sm text-balance">
                    Enter your email and we’ll send you a link to reset your password.
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




    )
}



