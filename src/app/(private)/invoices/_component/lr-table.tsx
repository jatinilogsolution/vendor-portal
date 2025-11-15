"use client"
import React, { useState, useMemo } from "react"
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { ExternalLink, Search } from "lucide-react"
import { SettlePrice } from "../../lorries/_components/settle-price"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useSession } from "@/lib/auth-client"
import { UserRoleEnum } from "@/utils/constant"

interface LR {
    id: string
    LRNumber: string
    origin?: string
    originName?: string
    destination: string
    vehicleNo: string
    vehicleType: string
    priceSettled?: number
    extraCost?: number
    podlink?: string
    fileNumber: string
    outDate: string
}

interface LRTableProps {
    lrs: LR[]
    status: "DRAFT" | "SENT"
    pageSize?: number
}

export const LRTable = ({ lrs, status, pageSize = 50 }: LRTableProps) => {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const session = useSession()
    const filteredLRs = useMemo(() => {
        if (!search.trim()) return lrs
        const q = search.toLowerCase()
        return lrs.filter(
            (lr) =>
                lr.LRNumber.toLowerCase().includes(q) ||
                lr.fileNumber.toLowerCase().includes(q) ||
                lr.vehicleNo.toLowerCase().includes(q)
        )
    }, [lrs, search])

    const totalPages = Math.ceil(filteredLRs.length / pageSize)

    const paginatedLRs = useMemo(() => {
        const start = (page - 1) * pageSize
        return filteredLRs.slice(start, start + pageSize)
    }, [filteredLRs, page, pageSize])

    const groupedByVehicle = useMemo(() => {
        return paginatedLRs.reduce((acc, lr) => {
            if (!acc[lr.fileNumber]) acc[lr.fileNumber] = []
            acc[lr.fileNumber].push(lr)
            return acc
        }, {} as Record<string, LR[]>)
    }, [paginatedLRs])

    return (
        <div className="invoice-table border rounded-lg  p-4">
            <h3 className="text-lg font-semibold mb-4 border-b pb-2">
                LRs Included in this Invoice
            </h3>

            {/* Search */}

            <InputGroup className=" mb-2 shadow-none">
                <InputGroupInput
                    placeholder="Search by LR Number, File Number, or Vehicle No"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value)
                        setPage(1)
                    }}
                    className=" w-full " />
                <InputGroupAddon>
                    <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end"><Badge variant={"secondary"} className=" w-14">{lrs.length} LRs</Badge></InputGroupAddon>
            </InputGroup>


            <div className="overflow-x-auto">
                <Table className="min-w-[600px]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-left font-semibold py-2">LR Number</TableHead>
                            <TableHead className="text-left font-semibold py-2">Origin</TableHead>
                            <TableHead className="text-left font-semibold py-2">Destination</TableHead>
                            <TableHead className="text-center font-semibold py-2">Price Settled</TableHead>
                            <TableHead className="text-center font-semibold py-2">Extra Cost</TableHead>
                            <TableHead className="text-center font-semibold py-2">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {Object.entries(groupedByVehicle).map(([fileNumber, vehicleLRs]) => (
                            <React.Fragment key={fileNumber}>
                                <TableRow className="  rounded-md">
                                    <TableCell colSpan={3} className="py-2 bg-foreground/10 font-semibold">
                                        <div className="flex items-center gap-2">
                                            <Badge className=" ">{vehicleLRs[0].vehicleNo}</Badge>
                                            <Badge variant="secondary">{vehicleLRs[0].vehicleType}</Badge>
                                            <Badge variant="secondary">
                                                {new Date(vehicleLRs[0].outDate).toLocaleDateString()}
                                            </Badge>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        ₹ {vehicleLRs[0].priceSettled || "-"}
                                    </TableCell>
                                    <TableCell className="text-center font-medium">
                                        ₹ {vehicleLRs[0].extraCost || "-"}
                                    </TableCell>
                                    {status !== "SENT" && (
                                        <TableCell className="text-center">
                                            <SettlePrice
                                                size="sm"
                                                label="+ Cost"
                                                fileNumber={vehicleLRs[0].fileNumber}
                                                vehicle={vehicleLRs[0].vehicleNo}
                                                extraCost={vehicleLRs[0].extraCost || ""}
                                                settlePrice={vehicleLRs[0].priceSettled || ""}
                                            />
                                        </TableCell>
                                    )}
                                    {(status === "SENT" || session.data?.user.role === UserRoleEnum.TADMIN) && (
                                        <TableCell className="text-center">
                                            <SettlePrice
                                                size="sm"
                                                label="Cost"
                                                fileNumber={vehicleLRs[0].fileNumber}
                                                vehicle={vehicleLRs[0].vehicleNo}
                                                extraCost={vehicleLRs[0].extraCost || ""}
                                                settlePrice={vehicleLRs[0].priceSettled || ""}
                                            />
                                        </TableCell>
                                    )}
                                </TableRow>

                                {vehicleLRs.map((lr) => (
                                    <TableRow
                                        key={lr.id}
                                        className=" transition-colors border-b last:border-b-0"
                                    >
                                        <TableCell className="text-left py-2 font-medium">{lr.LRNumber}</TableCell>
                                        <TableCell className="text-left py-2">{lr.originName || lr.origin}</TableCell>
                                        <TableCell className="text-left py-2">{lr.destination}</TableCell>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell className="text-center py-2">
                                            {lr.podlink ? (
                                                <Button variant="link" size="sm" asChild>
                                                    <Link href={lr.podlink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                                                        View <ExternalLink className="h-3 w-3 text-primary" />
                                                    </Link>
                                                </Button>
                                            ) : (
                                                <span className="text-gray-400">–</span>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 border border-primary/40 rounded-md p-3">

                    {/* Previous */}
                    <Button
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        variant="link"
                    >
                        Previous
                    </Button>

                    {/* Status */}
                    <span className="text-sm">
                        Page {page} of {totalPages}
                    </span>

                    {/* Next */}
                    <Button
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        variant="link"
                    >
                        Next
                    </Button>

                </div>
            )}

        </div>
    )
}
