import type { Metadata } from "next";
import { CSSProperties, PropsWithChildren } from "react";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { VendorPortalSidebar } from "@/components/vendor-portal/sidebar";
import { VendorPortalHeader } from "@/components/vendor-portal/header";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";

export const metadata: Metadata = {
  title: "Vendor Portal",
  description: "Vendor Portal workspace",
};

export default async function VendorPortalLayout({
  children,
}: PropsWithChildren) {
  await requireVendorPortalSession();

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 64)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <VendorPortalSidebar variant="inset" />
      <SidebarInset>
        <VendorPortalHeader />
        <div className="px-2 md:px-4 py-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
