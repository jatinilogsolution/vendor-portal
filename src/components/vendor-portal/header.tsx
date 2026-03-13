"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VendorPortalNav } from "@/utils/vendor-portal-constants";
import { signOut, useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { ModeToggle } from "@/components/modules/theme-toogle";
import { ContextSwitcher } from "@/components/context-switcher";
import { VendorPortalNotificationBell } from "@/components/vendor-portal/notification-bell";

export function VendorPortalHeader() {
  const { data } = useSession();
  const path = usePathname();
  const router = useRouter();
  const [isPending, setIsPending] = React.useState(false);

  const getCurrentTitle = () => {
    const exactMatch = VendorPortalNav.navMain.find(
      (item) => item.url === path,
    );
    if (exactMatch) return exactMatch.headerTitle;
    for (const item of VendorPortalNav.navMain) {
      if (path.startsWith(item.url) && item.url !== "/vendor-portal") {
        return item.headerTitle;
      }
    }
    if (path.startsWith("/vendor-portal")) return "Vendor Portal";
    return "Page";
  };

  async function handleClick() {
    try {
      setIsPending(true);
      await signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success("You’ve logged out. See you soon!");
            router.push("/auth/login");
            window.location.reload();
          },
        },
      });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while logging out.");
    } finally {
      setIsPending(false);
    }
  }

  const currentNav = getCurrentTitle();

  return (
    <header className="sticky top-0 z-40 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex w-full items-center gap-4 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1 size-9 text-muted-foreground hover:text-foreground" />

        <Separator
          orientation="vertical"
          className="h-5 w-px bg-border hidden sm:block"
        />

        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h1 className="truncate text-sm font-semibold tracking-tight text-foreground sm:text-base">
            {currentNav || "Vendor Portal"}
          </h1>
          <p className="hidden truncate text-xs text-muted-foreground sm:block">
            {path.split("/").filter(Boolean).join(" / ")}
          </p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <VendorPortalNotificationBell />
          <ContextSwitcher />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative flex h-9 w-9 items-center justify-center rounded-full md:h-auto md:w-auto md:gap-2 md:px-2 md:py-1.5"
              >
                <div className="hidden flex-col items-end md:flex">
                  <span className="text-sm font-medium leading-none">
                    {data?.user?.name}
                  </span>
                  <span className="text-xs leading-none text-muted-foreground capitalize">
                    {data?.user?.role?.toLowerCase()}
                  </span>
                </div>
                <Avatar className="size-8 border border-border">
                  <AvatarImage
                    src={data?.user?.image || ""}
                    alt={data?.user?.name}
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-sm font-medium">
                    {data?.user?.name?.[0]?.toUpperCase() ?? "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-lg border-border"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex items-center gap-3">
                  <Avatar className="size-9 border border-border">
                    <AvatarImage src={data?.user?.image || ""} />
                    <AvatarFallback className="bg-muted text-muted-foreground text-sm">
                      {data?.user?.name?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {data?.user?.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {data?.user?.email}
                    </p>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />

              <DropdownMenuItem asChild>
                <Link
                  href="/vendor-portal/profile"
                  className="cursor-pointer"
                >
                  Account Settings
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <div className="px-2 py-1.5">
                <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                  Appearance
                </p>
                <ModeToggle />
              </div>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={handleClick}
                disabled={isPending}
                className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
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
  );
}
