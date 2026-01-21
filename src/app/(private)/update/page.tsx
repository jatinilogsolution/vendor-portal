"use client";

import * as React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { getAWLLRDetails, syncLRFromWMS } from "./_action/lr-update";
import { Search, RefreshCw, Info, FileText, Database } from "lucide-react";
import { cn } from "@/lib/utils";

export default function UpdatePage() {
  const [lrNumber, setLrNumber] = React.useState("");
  const [fileNumber, setFileNumber] = React.useState("");
  const [lrDetails, setLrDetails] = React.useState<any>(null);
  const [isSearching, setIsSearching] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);

  const handleSearch = async () => {
    if (!lrNumber) {
      toast.error("Please enter an LR Number");
      return;
    }

    setIsSearching(true);
    setLrDetails(null);
    try {
      const result = await getAWLLRDetails(lrNumber);
      if (result.success) {
        setLrDetails(result.data);
        toast.success("LR Details found");
      } else {
        toast.error(result.error || "Failed to fetch details");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSync = async (type: "lr" | "file") => {
    const value = type === "lr" ? lrNumber : fileNumber;
    if (!value) {
      toast.error(`Please enter a ${type === "lr" ? "LR" : "File"} Number`);
      return;
    }

    setIsSyncing(true);
    try {
      const result = await syncLRFromWMS(
        type === "lr" ? value : undefined,
        type === "file" ? value : undefined,
      );
      if (result.success) {
        toast.success(result.message);
        if (type === "lr") handleSearch();
      } else {
        toast.error(result.error || "Sync failed");
      }
    } catch (err) {
      toast.error("An unexpected error occurred during sync");
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <Database className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold tracking-tight">WMS Data Sync</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">LR Search & Sync</CardTitle>
            <CardDescription>
              Fetch real-time data from WMS for a specific LR.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="lrNumber">LR Number</Label>
              <div className="flex gap-2">
                <Input
                  id="lrNumber"
                  placeholder="Enter LR Number..."
                  value={lrNumber}
                  onChange={(e) => setLrNumber(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button onClick={handleSearch} disabled={isSearching}>
                  {isSearching ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {lrDetails && (
              <div className="rounded-xl border bg-linear-to-br from-background/50 to-background   p-5 text-sm space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                  <div className="flex items-center gap-2 font-semibold text-primary">
                    <Info className="h-4 w-4" />
                    <span>WMS Metadata</span>
                  </div>
                  {lrDetails.podLink ? (
                    <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      POD Linked
                    </span>
                  ) : (
                    <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase">
                      No POD
                    </span>
                  )}
                </div>

                {/* LR Details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <p className="col-span-2">
                    <span className="text-muted-foreground font-medium">
                      Party:
                    </span>{" "}
                    <span className="font-semibold">{lrDetails.PartyName}</span>
                  </p>
                  <p>
                    <span className="text-muted-foreground font-medium">
                      Origin:
                    </span>{" "}
                    {lrDetails.WH}
                  </p>
                  <p>
                    <span className="text-muted-foreground font-medium">
                      Destination:
                    </span>{" "}
                    {lrDetails.City}
                  </p>
                  <p>
                    <span className="text-muted-foreground font-medium">
                      Vehicle:
                    </span>{" "}
                    {lrDetails.OutVehNo}
                  </p>
                  <p>
                    <span className="text-muted-foreground font-medium">
                      Type:
                    </span>{" "}
                    {lrDetails.OutVehType}
                  </p>
                  <p>
                    <span className="text-muted-foreground font-medium">
                      File No:
                    </span>{" "}
                    {lrDetails.FileNo}
                  </p>
                  <p>
                    <span className="text-muted-foreground font-medium">
                      LR Date:
                    </span>{" "}
                    {new Date(lrDetails.OutLRDate).toLocaleDateString()}
                  </p>
                </div>

                {/* Vendor Details */}
                {lrDetails.vendor && (
                  <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900 rounded-lg">
                    <p className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase mb-2">
                      Vendor Information
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-[13px]">
                      <p className="col-span-2">
                        <span className="text-muted-foreground">Name:</span>{" "}
                        <span className="font-semibold">
                          {lrDetails.vendor.Tname}
                        </span>
                      </p>
                      <p>
                        <span className="text-muted-foreground">Contact:</span>{" "}
                        {lrDetails.vendor.Tcontactperson || "N/A"}
                      </p>
                      <p>
                        <span className="text-muted-foreground">Phone:</span>{" "}
                        {lrDetails.vendor.Tcontactno || "N/A"}
                      </p>
                      <p className="col-span-2">
                        <span className="text-muted-foreground">Email:</span>{" "}
                        {lrDetails.vendor.Temail || "N/A"}
                      </p>
                    </div>
                  </div>
                )}

                {/* POD View Button */}
                {lrDetails.podLink && (
                  <Button
                    variant="outline"
                    className="w-full border-green-300 text-green-700 hover:bg-green-50"
                    onClick={() => window.open(lrDetails.podLink, "_blank")}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    View POD Document
                  </Button>
                )}

                {/* Sync Button */}
                <Button
                  className="w-full bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  onClick={() => handleSync("lr")}
                  disabled={isSyncing}
                >
                  <RefreshCw
                    className={cn("mr-2 h-4 w-4", isSyncing && "animate-spin")}
                  />
                  Sync Metadata & POD
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Bulk Sync by File</CardTitle>
            <CardDescription>
              Synchronize all LRs associated with a specific File Number.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="fileNumber">File Number</Label>
              <div className="flex gap-2">
                <Input
                  id="fileNumber"
                  placeholder="Enter File Number..."
                  value={fileNumber}
                  onChange={(e) => setFileNumber(e.target.value)}
                />
                <Button
                  variant="secondary"
                  onClick={() => handleSync("file")}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <RefreshCw className="h-4 w-4 animate-spin" />
                  ) : (
                    <FileText className="h-4 w-4 mr-2" />
                  )}
                  Bulk Sync
                </Button>
              </div>
            </div>
            <div className="p-4 bg-background border rounded-xl text-[12px] ">
              <p className="font-semibold mb-1 text-primary">Information:</p>
              This operation will identify all LR numbers matching the File
              Number in WMS and upsert them locally, including their delivery
              POD links.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
