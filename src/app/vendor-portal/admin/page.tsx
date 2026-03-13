import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { UserRoleEnum } from "@/utils/constant";
import { requireVendorPortalSession } from "@/lib/vendor-portal/guard";
import {
  VendorPortalPageShell,
  VendorPortalPlaceholder,
} from "@/components/vendor-portal/page-shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const quickLinks = [
  {
    title: "Vendors",
    href: "/vendor-portal/admin/vendors",
    desc: "Create and manage vendor portal profiles.",
  },
  {
    title: "Categories",
    href: "/vendor-portal/admin/categories",
    desc: "Maintain category and sub-category tree.",
  },
  {
    title: "Item Master",
    href: "/vendor-portal/admin/items",
    desc: "Manage standard items and services.",
  },
  {
    title: "Purchase Orders",
    href: "/vendor-portal/admin/purchase-orders",
    desc: "Create and submit purchase orders.",
  },
  {
    title: "Proforma Invoices",
    href: "/vendor-portal/admin/proforma-invoices",
    desc: "Create and submit proforma invoices.",
  },
  {
    title: "Vendor Invoices",
    href: "/vendor-portal/admin/invoices",
    desc: "View and create invoices for vendors.",
  },
];

export default async function VendorPortalAdminDashboard() {
  await requireVendorPortalSession([UserRoleEnum.ADMIN]);

  return (
    <VendorPortalPageShell
      title="Admin Dashboard"
      description="Manage vendors, categories, items, and procurement documents."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => (
          <Card
            key={link.title}
            className="transition-colors hover:bg-accent/50 hover:border-border"
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">
                {link.title}
              </CardTitle>
              <CardDescription className="text-sm">{link.desc}</CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <Button variant="ghost" size="sm" className="h-auto p-0 font-medium" asChild>
                <Link
                  href={link.href}
                  className="inline-flex items-center gap-1 text-primary hover:underline"
                >
                  Open {link.title}
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <VendorPortalPlaceholder
        title="Phase 1 scaffolding in place"
        description="Connect these screens to vp_ tables and workflow actions as you implement each phase."
        items={[
          "Create vp_vendors profiles without touching existing vendors.",
          "Build PO/PI creation with boss approval flow.",
          "Enable invoice creation on behalf of vendors.",
        ]}
      />
    </VendorPortalPageShell>
  );
}
