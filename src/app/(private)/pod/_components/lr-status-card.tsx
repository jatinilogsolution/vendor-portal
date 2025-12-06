"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { updateIndividualLRStatus } from "../_actions/add"
import { ExternalLink, Loader2, RefreshCw } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface LRStatusCardProps {
    lrNumber: string
    currentStatus: string | null
    remark: string | null
    podLink: string | null
    customerName: string | null
    origin: string | null
    destination: string | null
    updatedAt: Date
}

export function LRStatusCard({
    lrNumber,
    currentStatus,
    remark,
    podLink,
    customerName,
    origin,
    destination,
    updatedAt
}: LRStatusCardProps) {
    const router = useRouter()
    const [status, setStatus] = useState<string>(currentStatus || "PENDING")
    const [newRemark, setNewRemark] = useState<string>(remark || "")
    const [loading, setLoading] = useState(false)

    const handleStatusUpdate = async () => {
        if (!status) {
            toast.error("Please select a status")
            return
        }

        setLoading(true)
        const result = await updateIndividualLRStatus(
            lrNumber,
            status as "PENDING" | "VERIFIED" | "WRONG",
            newRemark
        )
        setLoading(false)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success("Status updated successfully!")
            router.refresh()
        }
    }

    const getStatusBadgeVariant = (status: string | null) => {
        switch (status) {
            case "VERIFIED":
                return "default"
            case "WRONG":
                return "destructive"
            default:
                return "secondary"
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "VERIFIED":
                return "text-green-600"
            case "WRONG":
                return "text-red-600"
            default:
                return "text-yellow-600"
        }
    }

    return (
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <CardTitle className="text-base font-mono">{lrNumber}</CardTitle>
                        <div className="flex items-center gap-2">
                            <Badge variant={getStatusBadgeVariant(currentStatus)}>
                                {currentStatus || "PENDING"}
                            </Badge>
                            {updatedAt && (
                                <span className="text-xs text-muted-foreground">
                                    Updated: {new Date(updatedAt).toLocaleDateString()}
                                </span>
                            )}
                        </div>
                    </div>
                    {podLink && (
                        <Link
                            href={podLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0"
                        >
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                <ExternalLink className="h-4 w-4 text-primary" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* LR Details */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                        <Label className="text-xs text-muted-foreground">Customer</Label>
                        <p className="font-medium">{customerName || "-"}</p>
                    </div>
                    <div>
                        <Label className="text-xs text-muted-foreground">Route</Label>
                        <p className="font-medium text-xs">
                            {origin} → {destination}
                        </p>
                    </div>
                </div>

                {/* Current Remark */}
                {remark && (
                    <div className="bg-muted/50 rounded-md p-3">
                        <Label className="text-xs text-muted-foreground">Current Remark</Label>
                        <p className="text-sm mt-1">{remark}</p>
                    </div>
                )}

                {/* Status Update Section */}
                <div className="space-y-3 pt-3 border-t">
                    <div className="space-y-2">
                        <Label htmlFor={`status-${lrNumber}`}>Update Status</Label>
                        <Select value={status} onValueChange={setStatus}>
                            <SelectTrigger id={`status-${lrNumber}`}>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="PENDING">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-yellow-500" />
                                        Pending
                                    </div>
                                </SelectItem>
                                <SelectItem value="VERIFIED">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-green-500" />
                                        Verified
                                    </div>
                                </SelectItem>
                                <SelectItem value="WRONG">
                                    <div className="flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-red-500" />
                                        Wrong/Rejected
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor={`remark-${lrNumber}`}>Remark (Optional)</Label>
                        <Textarea
                            id={`remark-${lrNumber}`}
                            placeholder="Add any notes or reasons for status change..."
                            value={newRemark}
                            onChange={(e) => setNewRemark(e.target.value)}
                            className="resize-none h-20"
                        />
                    </div>

                    <Button
                        onClick={handleStatusUpdate}
                        disabled={loading || status === currentStatus}
                        className="w-full"
                        size="sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Updating...
                            </>
                        ) : (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4" />
                                Update Status
                            </>
                        )}
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}
