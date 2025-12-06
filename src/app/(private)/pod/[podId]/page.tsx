
import { Badge } from "@/components/ui/badge"
import { ErrorCard } from "@/components/error"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCustomSession } from "@/actions/auth.action"
import { signOut } from "@/lib/auth-client"
import { redirect } from "next/navigation"
import { BackToPage } from "../../../../components/back-to-page"
import { getDetailedLRsByFileNumber } from "../_actions/get"
import { LRStatusCard } from "../_components/lr-status-card"
import { FileCheck2, FileX2, Clock, Receipt, FolderOpen, Package } from "lucide-react"

export default async function PodDetailPage({
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

    const result = await getDetailedLRsByFileNumber(filenumber)

    if (result.error || !result.data) {
        return (
            <div className="flex justify-center h-72 items-center">
                <ErrorCard
                    title="Page Not Found"
                    message={result.error ?? "Something went wrong fetching LR info."}
                />
            </div>
        )
    }

    const { data: lrs, statusCounts } = result
    const firstLR = lrs[0]

    return (
        <div className="space-y-6">
            {/* Back Button */}
            <BackToPage title="Back to POD List" location="/pod" />

            {/* File Header */}
            <Card className="border-2">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">
                                File Number: <span className="text-primary font-mono">#{filenumber}</span>
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Transporter: <span className="font-medium">{firstLR.tvendor?.name || "N/A"}</span>
                            </p>
                        </div>

                        {/* Invoice & Annexure Info */}
                        <div className="flex flex-col items-end gap-2">
                            {firstLR.Invoice ? (
                                <Badge variant="outline" className="border-purple-500 text-purple-700">
                                    <Receipt className="mr-1 h-3 w-3" />
                                    Invoice: {firstLR.Invoice.refernceNumber}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                    <Receipt className="mr-1 h-3 w-3" />
                                    Not Invoiced
                                </Badge>
                            )}

                            {firstLR.Annexure ? (
                                <Badge variant="outline" className="border-cyan-500 text-cyan-700">
                                    <FolderOpen className="mr-1 h-3 w-3" />
                                    Annexure: {firstLR.Annexure.name}
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                    <FolderOpen className="mr-1 h-3 w-3" />
                                    Not Annexed
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {/* Status Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-200">
                            <Package className="h-8 w-8 text-blue-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Total LRs</p>
                                <p className="text-2xl font-bold">{statusCounts?.total || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-200">
                            <FileCheck2 className="h-8 w-8 text-green-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Verified</p>
                                <p className="text-2xl font-bold">{statusCounts?.verified || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-200">
                            <Clock className="h-8 w-8 text-yellow-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Pending</p>
                                <p className="text-2xl font-bold">{statusCounts?.pending || 0}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-red-500/10 border border-red-200">
                            <FileX2 className="h-8 w-8 text-red-600" />
                            <div>
                                <p className="text-xs text-muted-foreground">Wrong</p>
                                <p className="text-2xl font-bold">{statusCounts?.wrong || 0}</p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Separator />

            {/* Individual LR Status Cards */}
            <div>
                <h2 className="text-xl font-semibold mb-4">LR Verification Status</h2>
                <p className="text-sm text-muted-foreground mb-4">
                    Review and update the verification status for each LR request. Click on individual cards to view POD documents and change status.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lrs.map((lr) => (
                        <LRStatusCard
                            key={lr.id}
                            lrNumber={lr.LRNumber}
                            currentStatus={lr.status}
                            remark={lr.remark}
                            podLink={lr.podlink}
                            customerName={lr.CustomerName}
                            origin={lr.warehouseName}
                            destination={lr.destination}
                            updatedAt={lr.updatedAt}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
