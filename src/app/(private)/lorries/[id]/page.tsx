

import { Badge } from "@/components/ui/badge"
import { ErrorCard } from "@/components/error"

import { getLRInfo } from "../_action/lorry"
import { SettlePrice } from "../_components/settle-price"
import { Separator } from "@/components/ui/separator"
import { LRForFileNumber } from "../_components/lr-per-file"
import { getCustomSession } from "@/actions/auth.action"
import UpdateOfferdPrice from "../_components/update-offered-price"
import { Label } from "@/components/ui/label"
import { IndianRupee } from "lucide-react"
import { BackToPage } from "@/components/back-to-page"
import { UserRoleEnum } from "@/utils/constant"


export default async function VendorDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params

    const { user } = await getCustomSession()
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
            <div className=" flex items-center gap-x-10">

                <BackToPage title="Back to Lorries" location="/lorries" />
                <Badge variant="default">
                    {(!data[0]?.status || data[0].status === "PENDING")
                        ? "Pending"
                        : data[0].status}
                </Badge>
            </div>

            {/* File Header */}
            <div className="flex flex-col gap-3 [">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-col items-start space-y-3">
                        {/* File Number */}
                        <h2 className=" font-semibold tracking-tight">
                            <span className="font-medium ">File: </span>

                            <span className="text-blue-500 text-lg"> #{data[0]?.fileNumber}</span>
                        </h2>

                        {/* Action Buttons */}
                        {(user.role === UserRoleEnum.TADMIN || user.role === UserRoleEnum.BOSS) && (
                            <div className="self-end">
                                <UpdateOfferdPrice
                                    fileNumber={data[0].fileNumber}
                                    oldPrice={data[0].priceOffered?.toString() || "0"}
                                />
                            </div>
                        )}
                        {user.role === "TVENDOR" && (
                            <div className="">
                                <SettlePrice
                                    mode={"edit"}
                                    costView={false}

                                    fileNumber={id}
                                    label="+ Cost"
                                    settlePrice={data[0]?.priceSettled?.toString() ?? ""}
                                    vehicle={data[0]?.vehicleNo || ""}
                                    extraCost={data[0]?.extraCost || null}
                                    size="default"
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
                                {data[0].extraCost ?? "—"} </span>
                            {user.role === "TADMIN" && (
                                <div className="self-end">
                                    <SettlePrice
                                        mode={"view"}
                                        fileNumber={id}
                                        settlePrice={data[0]?.priceSettled?.toString() ?? ""}
                                        vehicle={data[0]?.vehicleNo || ""}
                                        extraCost={data[0]?.extraCost || 0}
                                    />
                                </div>
                            )}

                        </div>


                    </div>


                </div>

            </div>




            <Separator />


            <LRForFileNumber data={data} />
        </div>
    )
}
