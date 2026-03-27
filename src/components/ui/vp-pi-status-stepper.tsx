// src/components/vendor-portal/ui/vp-pi-status-stepper.tsx
import { cn } from "@/lib/utils"
import { IconCheck, IconX } from "@tabler/icons-react"

const STEPS = [
    { key: "DRAFT", label: "Draft" },
    { key: "SUBMITTED", label: "Submitted" },
    { key: "APPROVED", label: "Approved" },
    { key: "SENT_TO_VENDOR", label: "Sent" },
    { key: "ACCEPTED", label: "Accepted" },
] as const

const STATUS_ORDER: Record<string, number> = {
    DRAFT: 0, SUBMITTED: 1, APPROVED: 2,
    SENT_TO_VENDOR: 3, ACCEPTED: 4,
    DECLINED: 3, REJECTED: 1,
}

export function VpPiStatusStepper({ status }: { status: string }) {
    const isRejected = status === "REJECTED"
    const isDeclined = status === "DECLINED"
    const currentIdx = STATUS_ORDER[status] ?? 0

    return (
        <div className="flex items-center gap-0">
            {STEPS.map((step, idx) => {
                const done = currentIdx > idx && !isRejected
                const active = currentIdx === idx && !isRejected && !isDeclined
                const bad = (isRejected && idx === 1) || (isDeclined && idx === 3)

                return (
                    <div key={step.key} className="flex items-center">
                        <div className="flex flex-col items-center">
                            <div className={cn(
                                "flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors",
                                done && "border-emerald-500 bg-emerald-500 text-white",
                                active && "border-primary bg-primary text-primary-foreground",
                                bad && "border-red-500 bg-red-500 text-white",
                                !done && !active && !bad && "border-muted-foreground/30 bg-muted text-muted-foreground",
                            )}>
                                {done ? <IconCheck size={14} /> : bad ? <IconX size={14} /> : <span>{idx + 1}</span>}
                            </div>
                            <span className={cn(
                                "mt-1 whitespace-nowrap text-[10px]",
                                (done || active) ? "font-semibold text-foreground" : "text-muted-foreground",
                            )}>
                                {isDeclined && idx === 3 ? "Declined" : step.label}
                            </span>
                        </div>
                        {idx < STEPS.length - 1 && (
                            <div className={cn(
                                "mb-4 h-0.5 w-8 sm:w-12",
                                done ? "bg-emerald-500" : "bg-muted-foreground/20",
                            )} />
                        )}
                    </div>
                )
            })}
        </div>
    )
}