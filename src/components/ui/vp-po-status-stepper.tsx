// src/components/vendor-portal/ui/vp-po-status-stepper.tsx
import { cn } from "@/lib/utils"
import { IconCheck, IconX } from "@tabler/icons-react"

const STEPS = [
    { key: "DRAFT", label: "Draft" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "APPROVED", label: "Approved" },
    { key: "SENT_TO_VENDOR", label: "Sent" },
    { key: "ACKNOWLEDGED", label: "Acknowledged" },
    { key: "CLOSED", label: "Closed" },
] as const

const STATUS_ORDER: Record<string, number> = {
    DRAFT: 0, SUBMITTED: 1, APPROVED: 2,
    SENT_TO_VENDOR: 3, ACKNOWLEDGED: 4, CLOSED: 5, REJECTED: -1,
}

export function VpPoStatusStepper({ status }: { status: string }) {
    const isRejected = status === "REJECTED"
    const currentIdx = STATUS_ORDER[status] ?? 0

    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
                const done = currentIdx > idx
                const active = currentIdx === idx && !isRejected
                const rejected = isRejected && idx === 1 // highlight at SUBMITTED step

                return (
                    <div key={step.key} className="flex items-center">
                        {/* Circle */}
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                                done && "border-emerald-500 bg-emerald-500 text-white",
                                active && "border-primary bg-primary text-primary-foreground",
                                rejected && "border-red-500 bg-red-500 text-white",
                                !done && !active && !rejected && "border-muted-foreground/30 bg-muted text-muted-foreground",
                            )}>
                                {done
                                    ? <IconCheck size={14} />
                                    : isRejected && idx === 1
                                        ? <IconX size={14} />
                                        : <span>{idx + 1}</span>
                                }
                            </div>
                            <span className={cn(
                                "mt-1 whitespace-nowrap text-[10px]",
                                (done || active) ? "font-semibold text-foreground" : "text-muted-foreground",
                            )}>
                                {step.label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {idx < STEPS.length - 1 && (
                            <div className={cn(
                                "mb-4 h-0.5 w-8 sm:w-12",
                                currentIdx > idx && !isRejected ? "bg-emerald-500" : "bg-muted-foreground/20",
                            )} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}