import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LRRequest } from "@/generated/prisma/client";
import { AlertCircle, FileCheck, Package, TrendingUp } from "lucide-react";

export const StatsGrid = ({ data, loading }: { data: LRRequest[], loading: boolean }) => {
    // Calculate required stats
    const totalRecords = data.length;
    const invoicedCount = data.filter((item) => item.isInvoiced).length;

    const calculateTotalsByFileNumber = (data: LRRequest[]) => {
        const groupedByFileNumber = data.reduce((acc, item) => {
            const fileNumber = item.fileNumber;

            if (!acc[fileNumber]) {
                acc[fileNumber] = {
                    priceSettled: 0,
                    extraCost: 0,
                    items: [],
                };
            }

            if (!acc[fileNumber].items.length) {
                acc[fileNumber].priceSettled += item.priceSettled || 0;
                acc[fileNumber].extraCost += item.extraCost || 0;
            }

            acc[fileNumber].items.push(item);
            return acc; // Return the updated accumulator
        }, {} as Record<string, { priceSettled: number, extraCost: number, items: LRRequest[] }>);

        let totalSettled = 0;
        let totalExtraCost = 0;

        Object.values(groupedByFileNumber).forEach(group => {
            totalSettled += group.priceSettled; // Only sum settled price
            totalExtraCost += group.extraCost; // Only sum extra cost
        });

        return { totalSettled, totalExtraCost }; // Return both totals
    };

    const { totalSettled, totalExtraCost } = calculateTotalsByFileNumber(data);


    const pendingCount = totalRecords - invoicedCount;

    // Function to get dynamic color class based on status type
    const getColorClass = (type: "success" | "warning" | "default") => {
        switch (type) {
            case 'success':
                return 'text-green-600 dark:text-green-400';
            case 'warning':
                return 'text-yellow-600 dark:text-yellow-400';
            default:
                return 'text-muted-foreground';
        }
    };

    const cardData = [
        {
            title: "Total Records",
            value: totalRecords,
            icon: Package,
            iconColor: getColorClass("default"),
            valueColor: 'text-foreground',
        },
        {
            title: "Total Amount",
            value: `₹${totalSettled.toLocaleString("en-IN")}`,
            extra: `${totalExtraCost.toLocaleString("en-IN")}`,
            icon: TrendingUp,
            iconColor: getColorClass('default'),
            valueColor: 'text-foreground',
        },
        {
            title: "Invoiced",
            value: invoicedCount,
            icon: FileCheck,
            iconColor: getColorClass('success'),
            valueColor: getColorClass('success'),
        },
        {
            title: "Pending",
            value: pendingCount,
            icon: AlertCircle,
            iconColor: getColorClass('warning'),
            valueColor: getColorClass('warning'),
        },
    ];

    return (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-10">
            {loading ? (
                <>
                    {[1, 2, 3, 4].map((i) => (
                        <Card key={`skeleton-${i}`} className="shadow-md">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <Skeleton className="h-4 w-24" />
                                <Skeleton className="h-4 w-4 rounded-full" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-8 w-1/2" />
                            </CardContent>
                        </Card>
                    ))}
                </>
            ) : (
                <>
                    {cardData.map((card) => {
                        const Icon = card.icon;
                        return (
                            <Card key={card.title} className="transition-all shadow-none">
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {card.title}
                                    </CardTitle>
                                    <Icon className={`h-6 w-6 ${card.iconColor}`} />
                                </CardHeader>
                                <CardContent className=" flex items-end gap-x-1">
                                    <div className={`text-3xl font-bold text-green-600 ${card.valueColor}`}>
                                        {card.value}
                                    </div>
                                    {card.extra && <div className={`text-md font-semibold text-blue-600 `}>
                                        +    {card.extra}
                                    </div>}
                                </CardContent>
                            </Card>
                        );
                    })}
                </>
            )}
        </div>
    );
};
