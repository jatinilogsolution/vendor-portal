"use client"

import { useState, useTransition, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
    PaginationLink,
} from "@/components/ui/pagination"
import { getInvoices } from "../_action/invoice-list"
import { InvoiceTable } from "./invoice-table"
import { NoInvoice } from "./no-invoice"
import { Skeleton } from "@/components/ui/skeleton"
import { Separator } from "@/components/ui/separator"
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
} from "@/components/ui/input-group"
import { Search } from "lucide-react"
import { Spinner } from "@/components/ui/shadcn-io/spinner"

export default function Index() {
    const router = useRouter()
    const searchParams = useSearchParams()

    const [search, setSearch] = useState("")
    const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
    const [data, setData] = useState<any[]>([])
    const [page, setPage] = useState(1)
    const [total, setTotal] = useState(0)
    const [limit] = useState(10)
    const [isPending, startTransition] = useTransition()

    // 🧭 Load from URL on mount
    useEffect(() => {
        const searchParam = searchParams.get("search") || ""
        const fromParam = searchParams.get("from")
        const toParam = searchParams.get("to")
        const pageParam = parseInt(searchParams.get("page") || "1", 10)

        const initDateRange: { from?: Date; to?: Date } = {}
        if (fromParam) initDateRange.from = new Date(fromParam)
        if (toParam) initDateRange.to = new Date(toParam)

        setSearch(searchParam)
        setDateRange(initDateRange)
        setPage(pageParam)

        fetchInvoices(searchParam, initDateRange, pageParam)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 📦 Core fetch function with URL sync
    const fetchInvoices = (
        searchValue = search,
        date = dateRange,
        p = page
    ) => {
        // ✨ Update URL
        const params = new URLSearchParams()
        if (searchValue) params.set("search", searchValue)
        if (date.from) params.set("from", date.from.toISOString())
        if (date.to) params.set("to", date.to.toISOString())
        params.set("page", String(p))
        router.replace(`?${params.toString()}`)

        // 🚀 Fetch data
        startTransition(async () => {
            const res = await getInvoices({
                search: searchValue,
                fromDate: date.from,
                toDate: date.to,
                page: p,
                limit,
            })

            if (res.success && res.data) {
                setData(res.data)
                setTotal(res.total || 0)
                setPage(p)
            } else {
                setData([])
                setTotal(0)
            }
        })
    }

    const totalPages = Math.ceil(total / limit)

    return (
        <div className="space-y-6 w-full">
            {/* 🔍 Filters */}
            <div className="flex md:flex-row flex-col justify-center  items-center gap-3">
                <InputGroup className="w-full">
                    <InputGroupInput
                        placeholder="Search by Invoice No, Reference No, Vendor Name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && fetchInvoices(search, dateRange, 1)}
                        className="w-full shadow-none"
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                    <InputGroupAddon align="inline-end">
                        {data.length} invoices
                    </InputGroupAddon>
                </InputGroup>

                <DateRangePicker
                    value={dateRange}
                    onChange={setDateRange}
                    placeholder="Select date range"
                    className="shadow-none w-full md:w-[250px]"

                />

                <Button className=" w-full md:w-fit" onClick={() => fetchInvoices(search, dateRange, 1)} disabled={isPending}>
                    {isPending ? <Spinner /> : "Search"}
                </Button>
            </div>

            <Separator className="bg-primary" />

            {/* 💾 Content */}
            {isPending ? (
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-10 w-full" />
                    ))}
                </div>
            ) : data.length > 0 ? (
                <>
                    <InvoiceTable data={data} />

                    {totalPages > 1 && (
                        <Pagination className="justify-end mt-4">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        onClick={() => page > 1 && fetchInvoices(search, dateRange, page - 1)}
                                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                                    />
                                </PaginationItem>

                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            onClick={() => fetchInvoices(search, dateRange, i + 1)}
                                            isActive={page === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        onClick={() =>
                                            page < totalPages && fetchInvoices(search, dateRange, page + 1)
                                        }
                                        className={
                                            page === totalPages ? "pointer-events-none opacity-50" : ""
                                        }
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </>
            ) : (
                <NoInvoice />
            )}
        </div>
    )
}
