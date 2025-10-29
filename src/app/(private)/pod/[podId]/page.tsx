
import { Badge } from "@/components/ui/badge"
import { ErrorCard } from "@/components/error"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { IndianRupee } from "lucide-react"
import { getLRInfo } from "../../lorries/_action/lorry"
import UpdateOfferedPrice from "../../lorries/_components/update-offered-price"
import { SettlePrice } from "../../lorries/_components/settle-price"
import { LRForFileNumber } from "../../lorries/_components/lr-per-file"
import { ApprovalCard } from "../_components/approval-card"
import { getCustomSession } from "@/actions/auth.action"
import { signOut } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { BackToPage } from "../../../../components/back-to-page"

export default async function VendorDetailPage({
    params,
}: {
    params: Promise<{ podId: string }>
}) {
    const { podId: filenumber } = await params

    const { user, session } = await getCustomSession()

    if (!session) {
        await signOut()
        redirect("/")
    }

 if (user.role !== "TADMIN" && user.role !== "BOSS") {
  redirect("/dashboard")
}
    const { data, error } = await getLRInfo(filenumber)
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

    const lr = data[0]

    return (
        <div className="space-y-6">
            {/* 🔙 Back link + Status */}
            <div className="flex items-center gap-x-10">
                {/* <BackToProofsLink /> */}
                <BackToPage title="Back to Proofs" />
                <Badge variant="default">
                    {!lr?.status || lr.status === "PENDING" ? "Pending" : lr.status}
                </Badge>
            </div>

            {/* 🧾 File Header */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                    {/* File Details */}
                    <div className="flex flex-col items-start space-y-3">
                        <h2 className="font-semibold tracking-tight">
                            <span className="font-medium text-gray-700">File:</span>
                            <span className="text-blue-500 text-lg"> #{lr?.fileNumber}</span>
                        </h2>

                        {/* Update Price Button */}
                        {user.role === "TADMIN" && (
                            <div className="self-end">
                                <UpdateOfferedPrice
                                    fileNumber={lr.fileNumber}
                                    oldPrice={lr.priceOffered?.toString() || "0"}
                                />
                            </div>
                        )}
                    </div>

                    {/* Price & Date Info */}
                    <div className="flex flex-col items-start justify-center gap-2 mr-10 text-sm text-gray-700">
                        <div className="flex items-center gap-2">
                            <Label className="font-semibold text-gray-800">Date of Entry:</Label>
                            <span className="font-medium">
                                {lr.outDate
                                    ? new Date(lr.outDate).toISOString().split("T")[0]
                                    : "—"}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Label className="font-semibold text-gray-800">Cost:</Label>
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                                <IndianRupee className="w-3.5 h-3.5" />
                                {lr.priceSettled ?? "—"}
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-green-600 font-semibold">
                            <Label className="font-semibold text-gray-800">Extra Addon:</Label>
                            <IndianRupee className="w-3.5 h-3.5" />
                            ₹ {lr.extraCost ?? "—"}
                            <div className="self-end">
                                <SettlePrice
                                    mode="view"
                                    fileNumber={filenumber}
                                    settlePrice={lr?.priceSettled?.toString() ?? ""}
                                    vehicle={lr?.vehicleNo || ""}
                                    extraCost={lr?.extraCost || 0}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Separator />

            {/* 📄 LR Table */}
            <LRForFileNumber data={data} />

            <Separator />

            {/* ✅ Approval Section */}
            <ApprovalCard fileNumber={filenumber} />
        </div>
    )
}
