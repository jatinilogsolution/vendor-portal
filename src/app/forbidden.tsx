"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"



export default function Component() {
    const router = useRouter()
    return (
        <div className="flex  flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-md text-center">
                <div className="mx-auto h-12 w-12 text-primary" />
                <h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Restricted Access</h1>
                <p className="mt-4 text-mu ted-foreground">
                    {/* This page is forbidden for you. */}
                </p>
                <div className="mt-6">
                    <Button variant={"secondary"} onClick={() => router.back()}>
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    )
}