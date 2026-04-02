"use client";

import * as React from "react";

import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { SideBarData } from "@/utils/constant";
import Link from "next/link";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session, isPending, refetch } = useSession();

  React.useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const loading = isPending || !session;

  return (
    <Sidebar collapsible="icon" {...props} className=" bg-muted">
      <SidebarHeader className="  bg-muted">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              tooltip="Transport Portal"
              className="h-auto min-h-10  data-[slot=sidebar-menu-button]:p-1.5! border-b"
            >
              <Link
                href="/dashboard"
                className="flex items-center gap-2 w-full"
              >
                <SidebarTrigger
                  size="icon-sm"
                  className="shrink-0 -pl-2! text-muted-foreground hover:text-foreground transition-colors"
                />

                <div className="flex items-center p-0! m-0! leading-tight group-data-[collapsible=icon]:hidden">
                  <h2 className="text-base font-bold whitespace-nowrap">
                    <span className="text-primary">Transport</span>{" "}
                    <span className="text-foreground">Portal</span>
                  </h2>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* <SidebarSeparator /> */}
      <SidebarContent className=" bg-muted" >
        {loading ? (
          // Skeleton while session loads
          <div className="space-y-2 p-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded" />
            ))}
            <div className="mt-auto space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <NavMain items={SideBarData.navMain} />
            <NavSecondary
              items={SideBarData.navSecondary}
              className="mt-auto"
            />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          <Skeleton className="h-10 w-full rounded" />
        ) : (
          <NavUser user={session?.user as any} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
