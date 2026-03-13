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
    title: "My POs",
    href: "/vendor-portal/vendor/purchase-orders",
    desc: "View purchase orders assigned to you.",
  },
  {
    title: "My PIs",
    href: "/vendor-portal/vendor/proforma-invoices",
    desc: "Accept or decline proforma invoices.",
  },
  {
    title: "My Invoices",
    href: "/vendor-portal/vendor/invoices",
    desc: "Upload or create invoices.",
  },
  {
    title: "My Payments",
    href: "/vendor-portal/vendor/payments",
    desc: "Track payment status and history.",
  },
  {
    title: "Documents",
    href: "/vendor-portal/vendor/documents",
    desc: "IT vendors upload supporting documents.",
  },
];

export default async function VendorPortalVendorDashboard() {
  await requireVendorPortalSession([UserRoleEnum.VENDOR]);

  return (
    <VendorPortalPageShell
      title="Vendor Dashboard"
      description="Submit invoices, track POs/PIs, and monitor payments."
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
        title="Vendor workflows"
        description="Enable invoice uploads, digital invoice forms, and delivery confirmations."
        items={[
          "Upload PDF invoices or fill digital invoice forms.",
          "Link invoices to PO or PI numbers.",
          "Receive approval and payment notifications.",
        ]}
      />
    </VendorPortalPageShell>
  );
}
