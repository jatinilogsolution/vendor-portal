"use client"

import { Inter } from 'next/font/google'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Mail, Phone, ArrowLeft } from "lucide-react"
import Link from "next/link"

import "../app/globals.css"
const inter = Inter({ subsets: ['latin'] })

export default function GlobalNotFound() {
    const router = useRouter()

    return (
        <html lang="en" className={inter.className}>
            <body className="min-h-screen bg-background">
                <div className={`min-h-screen bg-background flex items-center justify-center ${inter.className}`}>
                    <div className="max-w-2xl w-full space-y-8 text-center px-4 py-16">
                        {/* 404 Large Number */}
                        <div className="space-y-2">
                            <h1 className="text-[150px] md:text-[200px] font-bold leading-none text-muted-foreground/10 select-none">
                                404
                            </h1>
                            <div className="-mt-20 md:-mt-28 space-y-4">
                                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
                                    Page Not Found
                                </h2>
                                <p className="text-lg text-muted-foreground max-w-md mx-auto">
                                    The page you&apos;re looking for doesn&apos;t exist or has been moved.
                                </p>
                            </div>
                        </div>

                        {/* Back to Home Button */}
                        <div className="pt-4">
                            <Button onClick={() => router.back()} size="lg" className="gap-2">
                                {/* <Link href="/">
                                
                                </Link> */}
                                <ArrowLeft className="w-4 h-4" />
                                Back to Home
                            </Button>
                        </div>

                        {/* Separator */}
                        <div className="relative py-8">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-background px-2 text-muted-foreground">
                                    Need Help?
                                </span>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid gap-4 max-w-lg mx-auto">
                            {/* Email Card */}
                            <Link
                                href="mailto:vendorportal@awlindia.com"
                                className="group"
                            >
                                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Mail className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Email
                                        </p>
                                        <p className="text-base font-semibold group-hover:text-primary transition-colors">
                                            vendorportal@awlindia.com
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            {/* Phone Card */}
                            <Link
                                href="tel:+911234567890"
                                className="group"
                            >
                                <div className="flex items-center gap-4 p-4 rounded-lg border bg-card text-card-foreground shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                                        <Phone className="h-5 w-5" />
                                    </div>
                                    <div className="flex-1 text-left">
                                        <p className="text-sm font-medium text-muted-foreground">
                                            Phone
                                        </p>
                                        <p className="text-base font-semibold group-hover:text-primary transition-colors">
                                            +91 1234567890
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </body>
        </html>
    )
}
