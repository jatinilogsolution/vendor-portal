"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyMedia } from "@/components/ui/empty";
import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForbiddenPage() {
  const router = useRouter();
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="space-y-3 text-center">
          <EmptyMedia
            variant="icon"
            className="mx-auto size-12 rounded-full bg-destructive/10 text-destructive"
          >
            <ShieldAlert className="size-6" />
          </EmptyMedia>
          <CardTitle className="text-xl sm:text-2xl">
            Restricted Access
          </CardTitle>
          <CardDescription>
            You don’t have permission to view this page. If you believe this is
            an error, contact your administrator or try another area.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap justify-center gap-2 sm:gap-3">
          <Button variant="outline" size="sm" onClick={() => router.back()}>
            Go back
          </Button>
          <Button asChild size="sm">
            <Link href="/vendor-portal">Vendor Portal</Link>
          </Button>
          <Button variant="secondary" asChild size="sm">
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}