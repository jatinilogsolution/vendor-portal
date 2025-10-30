import type { Metadata } from "next";
// import { NuqsAdapter } from 'nuqs/adapters/next/app'




export const metadata: Metadata = {
    title: "Dashboard - Vendor Portal",
    description: "Hii Welcome back",
};



import { AppSidebar } from "@/components/app-sidebar"

import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
import { PropsWithChildren } from "react";
 

const PrivateLayout = ({ children }: PropsWithChildren) => {
    return (
        <SidebarProvider
            style={
                {
                    "--sidebar-width": "calc(var(--spacing) * 72)",
                    "--header-height": "calc(var(--spacing) * 12)",
                } as React.CSSProperties
            }
        >
            <AppSidebar variant="inset" />
            <SidebarInset>
                <SiteHeader />


                <div className=" px-2 md:px-4 py-6">

             
                        {children}

                        {/* {children} */}
                 </div>

            </SidebarInset>
        </SidebarProvider>
    )
}



export default PrivateLayout