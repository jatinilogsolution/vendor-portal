"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { SideBarData } from "@/utils/constant"
import { signOut, useSession } from "@/lib/auth-client"
import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { ModeToggle } from "./modules/theme-toogle"
import { usePageTitle } from "@/stores/usePageTitle"

export function SiteHeader() {
  const { data, } = useSession()
  const path = usePathname()
  const router = useRouter()
  const { title } = usePageTitle()

  // Enhanced dynamic title resolution
  const getCurrentTitle = () => {
    // 1. If custom title is set via store, use it
    if (title && title !== "Page") return title

    // 2. Try exact match first
    const exactMatch = SideBarData.navMain.find((item) => item.url === path)
    if (exactMatch) return exactMatch.headerTitle

    // 3. Handle dynamic routes (with IDs in path)
    // Check if path starts with any nav URL
    for (const item of SideBarData.navMain) {
      if (path.startsWith(item.url) && item.url !== "/") {
        // For specific routes, add context
        if (path.match(/\/invoices\/[^/]+$/)) {
          return "Invoice Details"
        }
        if (path.match(/\/invoices\/[^/]+\/compare$/)) {
          return "Compare Invoice"
        }
        if (path.match(/\/lorries\/annexure\/[^/]+$/)) {
          return "Annexure Details"
        }
        if (path.match(/\/lorries\/annexure\/[^/]+\/edit$/)) {
          return "Edit Annexure"
        }
        if (path.match(/\/pod\/[^/]+$/)) {
          return "POD Details"
        }
        if (path.match(/\/profile\/[^/]+$/)) {
          return "User Profile"
        }
        // Default to parent headerTitle
        return item.headerTitle
      }
    }

    // 4. Fallback to "Page" for unmatched routes
    return "Page"
  }

  const currentNav = getCurrentTitle()

  const [isPending, setIsPending] = React.useState(false)

  async function handleClick() {
    try {
      setIsPending(true)

      // signOut may or may not trigger fetchOptions callbacks, so wrap in try/finally
      await signOut({
        fetchOptions: {
          onError: (ctx) => { toast.error(ctx.error.message) },
          onSuccess: () => {
            toast.success("You’ve logged out. See you soon!")
            router.push("/auth/login")
          },
        },
      })
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while logging out.")
    } finally {
      // ✅ This always runs, no matter what.
      setIsPending(false)
    }
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />

        <h1 className="text-base font-medium">
          {currentNav || "Page"}
        </h1>

        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={data?.user?.image || ""} alt={data?.user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {data?.user?.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>


            <DropdownMenuContent className="mr-8 w-[180px]">
              <DropdownMenuLabel className="bg-foreground/10">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuLabel >
                <ModeToggle />
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={handleClick}
                disabled={isPending}
                className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-red-500" />
                    Logging out...
                  </>
                ) : (
                  "Log out"
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
