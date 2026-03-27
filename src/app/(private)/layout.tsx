import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { getCustomSession } from "@/actions/auth.action";
import { UserRoleEnum } from "@/utils/constant";
import { isVendorPortalRole, getVendorPortalHome } from "@/lib/vendor-portal";

export const metadata: Metadata = {
    title: "Dashboard - Vendor Portal",
    description: "Hii Welcome back",
};

import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar";
import type { CSSProperties, PropsWithChildren } from "react";
import { NotificationProvider } from "@/context/notification-context";

const allowedPrivateRoles = [
    UserRoleEnum.BOSS,
    UserRoleEnum.TADMIN,
    UserRoleEnum.TVENDOR,
];

const PrivateLayout = async ({ children }: PropsWithChildren) => {
    const { user } = await getCustomSession();
    if (!allowedPrivateRoles.includes(user.role as UserRoleEnum)) {
        if (isVendorPortalRole(user.role)) {
            redirect(getVendorPortalHome(user.role));
        }
        redirect("/forbidden");
    }
    return (
        <NotificationProvider>
            <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 64)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />
                <div className=" px-2 md:px-4 py-6">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
</NotificationProvider>
    )
}



export default PrivateLayout
