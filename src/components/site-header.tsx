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
import { usePathname } from "next/navigation"
import { SideBarData } from "@/utils/constant"
import { useRouter } from "next/navigation"
import { signOut } from "@/lib/auth-client"
import React from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { IconLogout } from "@tabler/icons-react"
export function SiteHeader(porps: any) {

  const path = usePathname()
  const router = useRouter();

  const currentNav = SideBarData.navMain.find(item => item.url === path);

  // const pathname = usePathname()


  const [isPending, setIsPending] = React.useState(false);
  async function handleClick() {
    await signOut({
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("You’ve logged out. See you soon!");
          router.push("/auth/login");
        },
      },
    });
  }
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">{currentNav?.headerTitle || "Page"}</h1>
        <div className="ml-auto flex items-center gap-2">

          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button size={"icon"} variant={"ghost"}>

              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={porps.user?.image || ""} alt={porps.user?.name} />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
            </Button></DropdownMenuTrigger>
            <DropdownMenuContent className=" mr-8 w-[180px]">
              <DropdownMenuLabel className=" bg-foreground/10">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild ><Link href={"/profile"}>Profile</Link></DropdownMenuItem>

             
              <DropdownMenuItem onClick={handleClick} className=" text-red-500">  {isPending && <Loader2 className="animate-spin text-red-500" /> }
                            Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
