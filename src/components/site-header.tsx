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
import { NotificationBell } from "./notification-bell"

export function SiteHeader() {
  const { data } = useSession()
  const path = usePathname()
  const router = useRouter()
  const { title } = usePageTitle()

  // Enhanced dynamic title resolution
  const getCurrentTitle = () => {
    if (title && title !== "Page") return title
    const exactMatch = SideBarData.navMain.find((item) => item.url === path)
    if (exactMatch) return exactMatch.headerTitle
    for (const item of SideBarData.navMain) {
      if (path.startsWith(item.url) && item.url !== "/") {
        if (path.match(/\/invoices\/[^/]+$/)) return "Invoice Details"
        if (path.match(/\/invoices\/[^/]+\/compare$/)) return "Compare Invoice"
        if (path.match(/\/lorries\/annexure\/[^/]+$/)) return "Annexure Details"
        if (path.match(/\/lorries\/annexure\/[^/]+\/edit$/)) return "Edit Annexure"
        if (path.match(/\/pod\/[^/]+$/)) return "POD Details"
        if (path.match(/\/profile\/[^/]+$/)) return "User Profile"
        return item.headerTitle
      }
    }
    return "Page"
  }

  const currentNav = getCurrentTitle()
  const [isPending, setIsPending] = React.useState(false)

  async function handleClick() {
    try {
      setIsPending(true)
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
      setIsPending(false)
    }
  }

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/80 backdrop-blur-md transition-all ease-in-out shadow-sm">
      <div className="flex w-full items-center gap-4 px-4 lg:px-8">
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground transition-colors" />
        
        <Separator
          orientation="vertical"
          className="h-6 w-px bg-border hidden sm:block"
        />

        <div className="flex flex-col">
          <h1 className="text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {currentNav || "Page"}
          </h1>
          <p className="text-[10px] text-muted-foreground hidden sm:block">
            {path === "/" ? "Overview & Analytics" : path.split("/").filter(Boolean).join(" / ")}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <div className="pr-2 border-r border-border/50">
             <NotificationBell />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="flex items-center gap-2 px-2 hover:bg-muted/50 transition-all rounded-full group"
              >
                <div className="hidden lg:flex flex-col items-end">
                    <span className="text-xs font-medium leading-none">{data?.user?.name}</span>
                    <span className="text-[10px] text-muted-foreground capitalize">{data?.user?.role?.toLowerCase()}</span>
                </div>
                <Avatar className="h-8 w-8 border border-primary/20 p-[2px] transition-transform group-hover:scale-105">
                  <AvatarImage 
                    src={data?.user?.image || ""} 
                    alt={data?.user?.name} 
                    className="rounded-full"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary font-bold">
                    {data?.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-64 mt-2 shadow-2xl border-primary/10 p-2" align="end">
              <DropdownMenuLabel className="font-normal px-2 py-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarImage src={data?.user?.image || ""} />
                    <AvatarFallback>{data?.user?.name?.[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 overflow-hidden">
                    <p className="text-sm font-bold leading-none truncate">{data?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground italic truncate">
                      {data?.user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>
              
              <DropdownMenuSeparator />
              
              <div className="p-1">
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <Link href="/profile" className="flex items-center justify-between w-full">
                    <span>Account Settings</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                  <Link href="/notifications" className="flex items-center justify-between w-full">
                    <span>Notifications Center</span>
                  </Link>
                </DropdownMenuItem>
              </div>

              <DropdownMenuSeparator />

              <div className="px-2 py-2">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">Appearance</p>
                <ModeToggle />
              </div>

              <DropdownMenuSeparator />

              <div className="p-1">
                <DropdownMenuItem
                  onClick={handleClick}
                  disabled={isPending}
                  className="text-red-500 font-bold focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer rounded-md"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging out...
                    </>
                  ) : (
                    "Log out"
                  )}
                </DropdownMenuItem>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
