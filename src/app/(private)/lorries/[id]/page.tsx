import { Badge } from "@/components/ui/badge";
import { ErrorCard } from "@/components/error";

import { getLRInfo } from "../_action/lorry";
import ExtraCostManager from "@/components/modules/extra-cost-manager";
import { Separator } from "@/components/ui/separator";
import { LRForFileNumber } from "../_components/lr-per-file";
import { getCustomSession } from "@/actions/auth.action";
import UpdateOfferdPrice from "../_components/update-offered-price";
import { Label } from "@/components/ui/label";
import { IndianRupee, FileCheck } from "lucide-react";
import { BackToPage } from "@/components/back-to-page";
import { UserRoleEnum } from "@/utils/constant";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default async function VendorDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { user } = await getCustomSession();
  const { data, error } = await getLRInfo(id, user.id);
  if (error || !data) {
    return (
      <div className="flex justify-center h-72 items-center">
        <ErrorCard
          title="Page Not Found"
          message={error ?? "Something went wrong fetching LR info."}
        />
      </div>
    );
  }

  // Check if any LR in this file is invoiced
  const isAnyInvoiced = data.some((lr) => lr.isInvoiced);
  const invoiceInfo = data.find((lr) => lr.Invoice)?.Invoice;

  return (
    <div className="space-y-6">
      {/* Back link */}
      <div className=" flex items-center gap-x-10">
        <BackToPage title="Back to Lorries" location="/lorries" />
        <Badge variant="default">
          {!data[0]?.status || data[0].status === "PENDING"
            ? "Pending"
            : data[0].status}
        </Badge>
        {isAnyInvoiced && (
          <Badge
            variant="secondary"
            className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          >
            <FileCheck className="h-3 w-3 mr-1" />
            Invoiced
          </Badge>
        )}
      </div>

      {/* Invoice Status Banner */}
      {isAnyInvoiced && invoiceInfo && (
        <Alert className="border-green-500 bg-green-50 dark:bg-green-900/20">
          <FileCheck className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-700 dark:text-green-400">
            Invoice Generated
          </AlertTitle>
          <AlertDescription className="text-green-600 dark:text-green-300">
            <div className="flex items-center gap-4 mt-1">
              <span>
                <strong>Ref:</strong> {invoiceInfo.refernceNumber}
              </span>
              {invoiceInfo.invoiceNumber && (
                <span>
                  <strong>Invoice #:</strong> {invoiceInfo.invoiceNumber}
                </span>
              )}
              <span>
                <strong>Status:</strong> {invoiceInfo.status}
              </span>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* File Header */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-col items-start space-y-3">
            {/* File Number */}
            <h2 className=" font-semibold tracking-tight">
              <span className="font-medium ">File: </span>

              <span className="text-blue-500 text-lg">
                {" "}
                #{data[0]?.fileNumber}
              </span>
            </h2>

            {/* Action Buttons */}
            {(user.role === UserRoleEnum.TADMIN ||
              user.role === UserRoleEnum.BOSS) && (
              <div className="self-end">
                <UpdateOfferdPrice
                  fileNumber={data[0].fileNumber}
                  oldPrice={data[0].priceOffered?.toString() || "0"}
                />
              </div>
            )}
            {user.role === "TVENDOR" && !isAnyInvoiced && (
              <div className="">
                <ExtraCostManager
                  fileNumber={data[0].fileNumber}
                  totalExtra={
                    data[0].extraCost
                      ? `₹${data[0].extraCost.toLocaleString()}`
                      : ""
                  }
                  refreshOnSuccess={true}
                  readOnly={isAnyInvoiced}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col items-start justify-center gap-2 mr-10 text-sm  ">
            {/* Out Date */}
            <div className="flex items-center gap-2">
              {/* <CalendarIcon className="w-4 h-4 text-blue-500" /> */}
              <Label className="font-semibold ">Date of Entry:</Label>

              <span className="font-medium">
                {data[0].outDate
                  ? new Date(data[0].outDate).toISOString().split("T")[0]
                  : "—"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Label className="font-semibold ">Cost:</Label>
              <div className="flex items-center gap-1 text-green-600 font-medium">
                <IndianRupee className="w-3.5 h-3.5" />
                {data[0].priceSettled ?? "—"}
              </div>
            </div>

            <div className="flex items-center gap-2 font-semibold">
              <Label className="font-semibold ">Extra Addon:</Label>

              <IndianRupee className="w-3.5 h-3.5  text-green-600" />
              <span className="text-green-600">
                {data[0].extraCost ?? "—"}{" "}
              </span>
              {user.role === "TADMIN" && (
                <div className="self-end">
                  <ExtraCostManager
                    fileNumber={data[0].fileNumber}
                    totalExtra={
                      data[0].extraCost
                        ? `₹${data[0].extraCost.toLocaleString()}`
                        : ""
                    }
                    refreshOnSuccess={true}
                    readOnly={true}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Separator />

      <LRForFileNumber data={data} isInvoiced={isAnyInvoiced} />
    </div>
  );
}
