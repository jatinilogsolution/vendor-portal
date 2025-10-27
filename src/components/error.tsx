"use client"

import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ErrorCardProps {
  title?: string
  message?: string
}

export function ErrorCard({
  title = "Something went wrong",
  message = "Please try again or go back."
}: ErrorCardProps) {
  const router = useRouter()

  return (
    <Card className=" max-w-md w-full text-center">
      <CardHeader>
        <div className="flex justify-center mb-3">
          <AlertTriangle className="h-12 w-12 text-red-500" />
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{message}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" onClick={() => router.back()}>
          Go Back
        </Button>
      </CardContent>
    </Card>

  )
}
