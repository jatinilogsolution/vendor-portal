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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <Link href="/dashboard">
                <h2 className="text-xl text-center font-bold w-full ">
                  <span className="text-primary">Vendor</span>{" "}
                  <span className=" text-foreground">Portal</span>
                </h2>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />
      <SidebarContent>
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
