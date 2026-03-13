"use client";

import * as React from "react";
import Link from "next/link";
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
import { VendorPortalNav } from "@/utils/vendor-portal-constants";

export function VendorPortalSidebar(
  props: React.ComponentProps<typeof Sidebar>,
) {
  const { data: session, isPending, refetch } = useSession();

  React.useEffect(() => {
    refetch();
  }, [refetch]);

  const loading = isPending || !session;

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link
                href="/vendor-portal"
                className="flex items-center gap-2 px-2 py-2"
              >
                <span className="flex flex-1 justify-center  items-center text-center font-semibold leading-tight">
                  <span className="text-primary">Vendor</span>
                  <span className="text-foreground">Portal</span>
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />
      <SidebarContent>
        {loading ? (
          <div className="space-y-2 px-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded-md" />
            ))}
            <div className="mt-auto space-y-2">
              {Array.from({ length: 2 }).map((_, i) => (
                <Skeleton key={i} className="h-8 w-full rounded-md" />
              ))}
            </div>
          </div>
        ) : (
          <>
            <NavMain items={VendorPortalNav.navMain} />
            <NavSecondary
              items={VendorPortalNav.navSecondary}
              className="mt-auto"
            />
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        {loading ? (
          <Skeleton className="h-10 w-full rounded-md" />
        ) : (
          <NavUser user={session?.user as any} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
