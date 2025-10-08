 
 
import Link from "next/link"
import { ChevronLeftIcon, BanknotesIcon, CalendarIcon } from "@heroicons/react/16/solid"
import { Badge } from "@/components/ui/badge"
 import { ErrorCard } from "@/components/error"
 
import { getLRInfo } from "../_action/lorry"
  import { SettlePrice } from "../_components/settle-price"
import { Separator } from "@/components/ui/separator"
import { LRForFileNumber } from "../_components/lr-per-file"
 
 
export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
  
    const { data, error } = await getLRInfo(id)
    if (error || !data) {
        return (
            <div className="flex justify-center h-72 items-center">
                <ErrorCard
                    title="Page Not Found"
                    message={error ?? "Something went wrong fetching LR info."}
                />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Back link */}
            <div className="max-lg:hidden">
                <Link
                    href="/lorries"
                    className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                >
                    <ChevronLeftIcon className="size-4" />
                    Back to Lorries
                </Link>
            </div>

            {/* File Header */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-lg font-semibold tracking-tight">
                            File: <span className="text-blue-500">#{data[0]?.fileNumber}</span>
                        </h2>
                        <Badge variant="outline">
                            {data[0].status === "" || data[0].status === "PENDING"
                                ? "Pending"
                                : data[0].status}
                        </Badge>
                    </div>

       
                        <div className="flex items-center gap-2 text-green-600 font-medium">
                            <BanknotesIcon className="size-4 fill-green-400" />
                            ₹ {data[0].priceSettled ?? "—"} 
                        </div>
 
                </div>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="size-4 fill-blue-400" />
                        <span>
                            {data[0].outDate
                                ? new Date(data[0].outDate).toISOString().split("T")[0]
                                : "—"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Settle Price Section */}
            <div className="flex justify-end">
                <SettlePrice
                    fileNumber={data[0]?.fileNumber}
                    settlePrice={data[0]?.priceSettled?.toString() ?? ""}
                    vehicle={data[0]?.vehicleNo || ""}
                    vendor={data[0].tvendor.name}                />
            </div>

            <Separator />

            {/* LR Table */}
            <LRForFileNumber data={data} />
        </div>
    )
}
