"use client"

import React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { signOut } from "@/lib/auth-client"

import {
  IconDotsVertical,
  IconLogout,
} from "@tabler/icons-react"

import { Loader2 } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

type User = {
  id: string
  name: string
  email: string
  image: string | null | undefined
  createdAt: Date
  role: string | null | undefined
  vendorId: string | null | undefined
}

export function NavUser({ user }: { user: User }) {
  const { isMobile } = useSidebar()
  const router = useRouter()
  const [isPending, setIsPending] = React.useState(false)

  async function handleClick() {
    setIsPending(true)
    
    try {
      await signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message ?? "Failed to log out")
            setIsPending(false)
          },
          onSuccess: () => {
            toast.success("You've logged out. See you soon!")
            router.push("/auth/login")
            // Keep isPending true during redirect to prevent double-clicks
          },
        },
      })
    } catch (error) {
      toast.error("An unexpected error occurred")
      setIsPending(false)
    }
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                <AvatarImage src={user?.image ?? ""} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  {user?.name?.[0] ?? "U"}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <Link
                href="/profile"
                className="flex items-center gap-2 px-1 py-1.5 hover:bg-muted rounded-md transition-colors"
              >
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user?.image || ""} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.[0] ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user?.name}</span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user?.email}
                  </span>
                </div>
              </Link>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleClick}
              disabled={isPending}
              className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-950 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                {isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <IconLogout className="h-4 w-4" />
                )}
                <span>{isPending ? "Logging out..." : "Log out"}</span>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}