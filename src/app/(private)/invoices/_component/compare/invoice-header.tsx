"use client"
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Calendar, FileText, Building2, Hash, RefreshCw, IndianRupee, Package, Receipt } from "lucide-react";
import { Prisma } from "@/generated/prisma";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateOfferedPricesForFiles } from '@/actions/wms/cost';

type DataType = Prisma.InvoiceGetPayload<{
  include: {
    LRRequest: true
    vendor: true
  }
}>

export const InvoiceHeader = ({ invoice }: { invoice: DataType }) => {
  const router = useRouter();
  const [isRefreshing, setIsRefreshing] = React.useState(false);

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status.toUpperCase()) {
      case "SENT":
        return "default";
      case "PAID":
        return "outline";
      case "PENDING":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const handleRefreshPrices = async () => {
    setIsRefreshing(true);
    
    try {
      const distinctFileNumbers = Array.from(
        new Set(invoice.LRRequest.map(lr => lr.fileNumber))
      );

      const fileNumbersData = distinctFileNumbers.map(fileNumber => ({ fileNumber }));

      toast.loading(`Refreshing prices for ${distinctFileNumbers.length} files...`, {
        id: 'refresh-prices'
      });

      const res = await updateOfferedPricesForFiles(fileNumbersData);

      toast.dismiss('refresh-prices');

      if (res.success) {
        toast.success(`Successfully updated prices for ${distinctFileNumbers.length} files`);
        router.refresh();
      } else {
        toast.error(res.message || "Failed to update prices");
      }
    } catch (error) {
      toast.dismiss('refresh-prices');
      toast.error("An error occurred while updating prices");
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Group and calculate per-file totals
  const groupedByFile = React.useMemo(() => {
    const grouped = new Map<string, typeof invoice.LRRequest>();
    
    invoice.LRRequest.forEach(lr => {
      if (!grouped.has(lr.fileNumber)) {
        grouped.set(lr.fileNumber, []);
      }
      grouped.get(lr.fileNumber)!.push(lr);
    });

    return Array.from(grouped.entries()).map(([fileNumber, lrs]) => {
      const firstLr = lrs[0];
      return {
        fileNumber,
        lrCount: lrs.length,
        priceOffered: firstLr.priceOffered || 0,
        priceSettled: firstLr.priceSettled || 0,
        extraCost: firstLr.extraCost || 0,
      };
    });
  }, [invoice.LRRequest]);

  const totalOffered = groupedByFile.reduce((sum, g) => sum + g.priceOffered, 0);
  const totalSettled = groupedByFile.reduce((sum, g) => sum + g.priceSettled, 0);
  const totalExtra = groupedByFile.reduce((sum, g) => sum + g.extraCost, 0);
  const totalVariance = totalOffered - totalSettled - invoice.taxAmount - totalExtra;
  const calculatedGrandTotal = totalSettled + invoice.taxAmount + totalExtra;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold tracking-tight">{invoice.invoiceNumber}</h2>
            <p className="text-sm text-muted-foreground">Invoice Overview</p>
          </div>
          <Badge variant={getStatusVariant(invoice.status)} className="text-sm px-3 py-1">
            {invoice.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice Number</p>
              <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Hash className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Reference</p>
              <p className="text-lg font-semibold">{invoice.refernceNumber || '-'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Invoice Date</p>
              <p className="text-lg font-semibold">
                {new Date(invoice.invoiceDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 bg-muted rounded-lg">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Vendor</p>
              <p className="text-lg font-semibold">{invoice.vendor.name}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Financial Summary */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wider">AWL Cost</p>
            </div>
            <p className="text-2xl font-bold">₹{totalOffered.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground">
              <IndianRupee className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Vendor Cost</p>
            </div>
            <p className="text-2xl font-bold">₹{totalSettled.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400">
              <IndianRupee className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Tax</p>
            </div>
            <p className="text-2xl font-bold text-blue-700 dark:text-blue-400">₹{invoice.taxAmount.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 rounded-lg p-4 space-y-1">
            <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <IndianRupee className="h-4 w-4" />
              <p className="text-xs font-medium uppercase tracking-wider">Extra Cost</p>
            </div>
            <p className="text-2xl font-bold text-orange-700 dark:text-orange-400">₹{totalExtra.toLocaleString('en-IN')}</p>
          </div>

          <div className="bg-primary/5 rounded-lg p-4 space-y-1 row-span-2 md:row-span-1 lg:col-span-1">
            <div className="flex items-center gap-2 text-primary">
              <Receipt className="h-5 w-5" />
              <p className="text-sm font-medium uppercase tracking-wider">Grand Total</p>
            </div>
            <p className="text-3xl font-bold text-primary">₹{invoice.grandTotal.toLocaleString('en-IN')}</p>
            {calculatedGrandTotal !== invoice.grandTotal && (
              <p className="text-xs text-muted-foreground">
                Calculated: ₹{calculatedGrandTotal.toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        {/* Variance Highlight */}
        {totalVariance !== 0 && (
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Variance: ₹{Math.abs(totalVariance).toLocaleString('en-IN')} {totalVariance > 0 ? 'over' : 'under'} offered
            </p>
          </div>
        )}

        <Separator />

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>{groupedByFile.length} file{groupedByFile.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4" />
              <span>{invoice.LRRequest.length} LR{invoice.LRRequest.length !== 1 ? 's' : ''}</span>
            </div>
          </div>

          <Button
            onClick={handleRefreshPrices}
            disabled={isRefreshing}
            size="sm"
            variant="outline"
            className="gap-2 font-medium"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            {isRefreshing ? 'Refreshing...' : 'Refresh Offered Prices'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};