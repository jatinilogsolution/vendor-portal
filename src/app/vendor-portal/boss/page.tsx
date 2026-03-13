import Link from "next/link";
import { ChevronRight, FileCheck, FileText, Receipt, Wallet } from "lucide-react";
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
import { getBossDashboardCounts } from "./_actions/dashboard";

const quickLinks = [
  {
    title: "Approvals",
    href: "/vendor-portal/boss/approvals",
    desc: "Review and approve POs, PIs, and invoices.",
  },
  {
    title: "Payments",
    href: "/vendor-portal/boss/payments",
    desc: "Initiate and confirm vendor payments.",
  },
  {
    title: "Deliveries",
    href: "/vendor-portal/boss/deliveries",
    desc: "Track and approve deliveries.",
  },
  {
    title: "Reports",
    href: "/vendor-portal/boss/reports",
    desc: "Financial and operational reports.",
  },
];

export default async function VendorPortalBossDashboard() {
  await requireVendorPortalSession([UserRoleEnum.BOSS]);
  const counts = await getBossDashboardCounts();

  return (
    <VendorPortalPageShell
      title="Boss Dashboard"
      description="Approval and payment oversight for the vendor portal."
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PO approvals</CardTitle>
            <FileText className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.pendingPo}</p>
            <p className="text-xs text-muted-foreground">
              Pending purchase orders
              {counts.poAgingOver3Days > 0 ? ` • ${counts.poAgingOver3Days} > 3 days` : ""}
            </p>
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href="/vendor-portal/boss/approvals">Review</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">PI approvals</CardTitle>
            <FileCheck className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.pendingPi}</p>
            <p className="text-xs text-muted-foreground">Pending proforma invoices</p>
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href="/vendor-portal/boss/approvals">Review</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Invoice approvals</CardTitle>
            <Receipt className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.pendingInvoices}</p>
            <p className="text-xs text-muted-foreground">
              Pending vendor invoices
              {counts.invoiceAgingOver3Days > 0 ? ` • ${counts.invoiceAgingOver3Days} > 3 days` : ""}
            </p>
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href="/vendor-portal/boss/approvals">Review</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment queue</CardTitle>
            <Wallet className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{counts.paymentQueueCount}</p>
            <p className="text-xs text-muted-foreground">Invoices awaiting payment</p>
            <Button variant="link" className="h-auto p-0 text-primary" asChild>
              <Link href="/vendor-portal/boss/payments">Manage</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
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
        title="Boss workflows"
        description="Wire these modules to vp_ approvals, payments, and delivery status transitions."
        items={[
          "Approve or reject POs and PIs.",
          "Verify vendor invoices before payment.",
          "Log delivery confirmations and close POs.",
        ]}
      />
    </VendorPortalPageShell>
  );
}
