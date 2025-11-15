// "use client"
// import React from 'react';
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { ArrowRight, TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from "lucide-react";
// import { Prisma } from "@/generated/prisma";

export type FinsCosting = {
  charge_code: string;
  allocated_cost: number;
  revenue: number;
  revgl_code: string;
  costgl_code: string;
  LR_No: string;
};

export type LRRequest = {
  id: string;
  LRNumber: string;
  annexureId: string;
  createdAt: string; // ISO string
  updatedAt: string;
  outDate: string; // ISO string
  origin: string;
  destination: string;
  CustomerName: string;
  vehicleNo: string;
  vehicleType: string;
  priceOffered: number;
  priceSettled: number;
  extraCost: number | null;
  lrPrice: number;
  modifiedPrice: number | null;
  podlink: string;
  remark: string;
  status: string;
  tvendorId: string;
  groupId: string;
  isInvoiced: boolean;
  finsCosting?: FinsCosting[]; // optional in case empty
  fileNumber: string;
};

export type Vendor = {
  id: string;
  name: string;
  contactEmail?: string | null;
  contactPhone?: string | null;
  createdAt: string;
  updatedAt?: string;
};

export type Invoice = {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  invoiceURI: string;
  billTo: string;
  billToGstin: string;
  billToId: string;
  grandTotal: number;
  subtotal: number;
  taxAmount: number;
  taxRate: number;
  totalExtra: number;
  hasDiscrepancy: boolean;
  discrepancyNotes?: string | null;
  poId?: string | null;
  refernceNumber: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  vendorId: string;
  vendor: Vendor;
  LRRequest: LRRequest[];
};

// export const LRRequestsTable = ({ requests }: { requests: Invoice }) => {
//   const [expandedFiles, setExpandedFiles] = React.useState<Set<string>>(new Set());

//   // Group LR requests by fileNumber
//   const groupedByFile = React.useMemo(() => {
//     const grouped = new Map<string, typeof requests.LRRequest>();
    
//     requests.LRRequest.forEach(lr => {
//       if (!grouped.has(lr.fileNumber)) grouped.set(lr.fileNumber, []);
//       grouped.get(lr.fileNumber)!.push(lr);
//     });

//     return Array.from(grouped.entries()).map(([fileNumber, lrs]) => {
//       const firstLr = lrs[0];
//       return {
//         fileNumber,
//         lrs,
//         lrCount: lrs.length,
//         priceOffered: firstLr.priceOffered || 0,
//         priceSettled: firstLr.priceSettled || 0,
//         extraCost: firstLr.extraCost || 0,
//       };
//     });
//   }, [requests.LRRequest]);

//   const getVarianceIcon = (variance: number) => {
//     if (variance > 0) return <TrendingUp className="h-3 w-3" />;
//     if (variance < 0) return <TrendingDown className="h-3 w-3" />;
//     return <Minus className="h-3 w-3" />;
//   };

//   const getVarianceColor = (variance: number) => {
//     if (variance > 0) return "text-green-500";
//     if (variance < 0) return "text-destructive";
//     return "text-muted-foreground";
//   };

//   const toggleFile = (fileNumber: string) => {
//     setExpandedFiles(prev => {
//       const next = new Set(prev);
//       if (next.has(fileNumber)) next.delete(fileNumber);
//       else next.add(fileNumber);
//       return next;
//     });
//   };

//   // Totals
//   const invoiceSubtotal = requests.subtotal || 0;
//   const invoiceTaxAmount = requests.taxAmount || 0;
//   const invoiceTotalExtra = requests.totalExtra || 0;

//   const totalOffered = groupedByFile.reduce((sum, g) => sum + g.priceOffered, 0);
//   const totalSettled = groupedByFile.reduce((sum, g) => sum + g.priceSettled, 0);
//   const totalExtra = groupedByFile.reduce((sum, g) => sum + (g.extraCost || 0), 0);
//   const totalVariance = totalOffered - totalSettled - invoiceTaxAmount - totalExtra;

//   return (
//     <div className="space-y-4">
//       <div className="rounded-lg border border-border overflow-hidden bg-card">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-muted/70 hover:bg-muted/70">
//               <TableHead className="text-xs font-semibold h-10 w-12"></TableHead>
//               <TableHead className="text-xs font-semibold h-10">File No.</TableHead>
//               <TableHead className="text-xs font-semibold h-10">LR Count</TableHead>
//               <TableHead className="text-xs font-semibold h-10 text-right">AWL Cost</TableHead>
//               <TableHead className="text-xs font-semibold h-10 text-right">Vendor Cost</TableHead>
//               <TableHead className="text-xs font-semibold h-10 text-right">Extra</TableHead>
//               <TableHead className="text-xs font-semibold h-10 text-right">Variance</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {groupedByFile.map((group) => {
//               const isExpanded = expandedFiles.has(group.fileNumber);
//               const fileTaxShare = totalSettled ? (group.priceSettled / totalSettled) * invoiceTaxAmount : 0;
//               const fileVariance = group.priceOffered - group.priceSettled - fileTaxShare - (group.extraCost || 0);

//               return (
//                 <React.Fragment key={group.fileNumber}>
//                   {/* File Row */}
//                   <TableRow className="hover:bg-muted/50 cursor-pointer font-medium bg-muted/30" onClick={() => toggleFile(group.fileNumber)}>
//                     <TableCell className="py-3">{isExpanded ? <ChevronDown className="h-4 w-4"/> : <ChevronRight className="h-4 w-4"/>}</TableCell>
//                     <TableCell className="text-sm py-3 space-x-4">
//                       <Badge variant="outline" className="font-semibold">{group.fileNumber}</Badge>
//                       <Badge variant={"secondary"} className="border border-primary">{group.lrs[0].vehicleNo} - {group.lrs[0].vehicleType}</Badge>
//                     </TableCell>
//                     <TableCell className="text-sm py-3"><Badge variant="secondary">{group.lrCount} LR{group.lrCount>1?'s':''}</Badge></TableCell>
//                     <TableCell className="text-sm py-3 text-right font-semibold">₹{group.priceOffered.toLocaleString()}</TableCell>
//                     <TableCell className="text-sm py-3 text-right font-semibold">₹{group.priceSettled.toLocaleString()}</TableCell>
//                     <TableCell className="text-sm py-3 text-right">{group.extraCost ? <span className="font-semibold text-orange-600">₹{group.extraCost.toLocaleString()}</span> : '-'}</TableCell>
//                     <TableCell className={`text-sm py-3 text-right ${getVarianceColor(fileVariance)}`}>
//                       <div className="flex items-center justify-end gap-1">
//                         {getVarianceIcon(fileVariance)} ₹{Math.abs(fileVariance).toLocaleString()}
//                       </div>
//                     </TableCell>
//                   </TableRow>

//                   {/* Expanded LR Rows with Revenue Variance */}
//                   {isExpanded && group.lrs.map((lr, index) => {
//                     const finsTotalRevenue = lr.finsCosting?.reduce((sum, f) => sum + f.revenue, 0) || 0;
//                     const lrVariance = (lr.priceSettled || 0) - finsTotalRevenue;

//                     return (
//                       <TableRow key={lr.id} className="hover:bg-muted/20 bg-background">
//                         <TableCell className="py-2"></TableCell>
//                         <TableCell className="text-xs py-2 pl-8">
//                           <div className="flex items-center gap-2">
//                             <span className="text-muted-foreground">#{index + 1}</span>
//                             <div>
//                               <div className="font-medium">{lr.LRNumber}</div>
//                               <div className="text-muted-foreground text-[10px]">{new Date(lr.outDate).toLocaleDateString()}</div>
//                             </div>
//                           </div>
//                         </TableCell>
//                         <TableCell className="text-xs py-2">{lr.CustomerName}</TableCell>
//                         <TableCell className="text-xs py-2">AWL: ₹{(lr.priceSettled || 0).toLocaleString()}</TableCell>
//                         <TableCell className="text-xs py-2">Revenue: ₹{finsTotalRevenue.toLocaleString()}</TableCell>
//                         <TableCell className="text-xs py-2">
//                           {lr.extraCost ? `₹${lr.extraCost.toLocaleString()}` : '-'}
//                         </TableCell>
//                         <TableCell className={`text-xs py-2 ${getVarianceColor(lrVariance)}`}>
//                           <div className="flex items-center gap-1">
//                             {getVarianceIcon(lrVariance)}
//                             ₹{Math.abs(lrVariance).toLocaleString()}
//                           </div>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </React.Fragment>
//               );
//             })}

//             {/* Totals Row */}
//             <TableRow className="bg-muted/70 font-bold hover:bg-muted/70 border-t-2">
//               <TableCell colSpan={3} className="text-sm py-4">
//                 TOTALS ({groupedByFile.length} Files, {requests.LRRequest.length} LRs)
//               </TableCell>
//               <TableCell className="text-sm py-4 text-right">₹{totalOffered.toLocaleString()}</TableCell>
//               <TableCell className="text-sm py-4 text-right">₹{totalSettled.toLocaleString()}</TableCell>
//               <TableCell className="text-sm py-4 text-right">₹{totalExtra.toLocaleString()}</TableCell>
//               <TableCell className={`text-sm py-4 text-right ${getVarianceColor(totalVariance)}`}>
//                 <div className="flex items-center justify-end gap-1">
//                   {getVarianceIcon(totalVariance)} ₹{Math.abs(totalVariance).toLocaleString()}
//                 </div>
//               </TableCell>
//             </TableRow>
//           </TableBody>
//         </Table>
//       </div>
//     </div>
//   );
// };




// //  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
// //         <div className="bg-card border border-border rounded-lg p-4">
// //           <p className="text-xs text-muted-foreground mb-1 font-medium">Total Offered</p>
// //           <p className="text-xl font-bold">₹{totalOffered.toLocaleString()}</p>
// //           <p className="text-[10px] text-muted-foreground mt-1">{groupedByFile.length} files</p>
// //         </div>
// //         <div className="bg-card border border-border rounded-lg p-4">
// //           <p className="text-xs text-muted-foreground mb-1 font-medium">Subtotal (Settled)</p>
// //           <p className="text-xl font-bold">₹{totalSettled.toLocaleString()}</p>
// //           <p className="text-[10px] text-muted-foreground mt-1">{requests.LRRequest.length} LRs total</p>
// //         </div>
// //         <div className="bg-card border border-border rounded-lg p-4">
// //           <p className="text-xs text-muted-foreground mb-1 font-medium">Tax ({requests.taxRate}%)</p>
// //           <p className="text-xl font-bold text-blue-600">₹{invoiceTaxAmount.toLocaleString()}</p>
// //           <p className="text-[10px] text-muted-foreground mt-1">On subtotal</p>
// //         </div>
// //         <div className="bg-card border border-border rounded-lg p-4">
// //           <p className="text-xs text-muted-foreground mb-1 font-medium">Extra Costs</p>
// //           <p className="text-xl font-bold text-orange-600">₹{totalExtra.toLocaleString()}</p>
// //           <p className="text-[10px] text-muted-foreground mt-1">Additional charges</p>
// //         </div>
// //         <div className="bg-card border border-border rounded-lg p-4">
// //           <p className="text-xs text-muted-foreground mb-1 font-medium">Total Variance</p>
// //           <p className={`text-xl font-bold flex items-center gap-1 ${getVarianceColor(totalVariance)}`}>
// //             {getVarianceIcon(totalVariance)}
// //             ₹{Math.abs(totalVariance).toLocaleString()}
// //           </p>
// //           <p className="text-[10px] text-muted-foreground mt-1">
// //             {totalVariance > 0 ? 'Saved' : 'Overspent'}
// //           </p>
// //         </div>
// //       </div>

// //       {/* Grand Total Card */}
// //       <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-2 border-primary/30 rounded-lg p-6">
// //         <div className="flex items-center justify-between">
// //           <div>
// //             <p className="text-sm text-primary/80 font-medium mb-1">Invoice Grand Total</p>
// //             <p className="text-3xl font-bold text-primary">₹{invoiceGrandTotal.toLocaleString()}</p>
// //           </div>
// //           <div className="text-right">
// //             <p className="text-xs text-muted-foreground mb-2">Calculation</p>
// //             <p className="text-sm font-mono">
// //               ₹{totalSettled} + ₹{invoiceTaxAmount} + ₹{totalExtra}
// //             </p>
// //           </div>
// //         </div>
// //       </div>

// "use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LRPriceComparison } from "./lr-price-comparison";
import { RevenueComparison } from "./revenue-comparison";
 

 

export  function LRRequestsTable({invoices}:{invoices:Invoice }) {
  return (
    <main className="min-h-screen bg-background p-8">
      {/* <div className="max-w-7xl mx-auto space-y-8"> */}
        {/* <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">LR Price & Revenue Analysis</h1>
          <p className="text-muted-foreground">Comprehensive comparison of pricing and revenue data</p>
        </div> */}

        <Tabs defaultValue="price" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="price">LR Price Comparison</TabsTrigger>
            <TabsTrigger value="revenue">Revenue Comparison</TabsTrigger>
          </TabsList>

          <TabsContent value="price" className="space-y-4">
            <div className="bg-muted/40 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                Compare offered prices vs settled prices vs LR prices for each shipment.
              </p>
            </div>
            <LRPriceComparison invoice={invoices} />
          </TabsContent>

          <TabsContent value="revenue" className="space-y-4">
            <div className="bg-muted/40 border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                View revenue breakdown by charge code with detailed variance analysis.
              </p>
            </div>
            <RevenueComparison invoice={invoices} />
          </TabsContent>
        </Tabs>
      {/* </div> */}
    </main>
  );
}
