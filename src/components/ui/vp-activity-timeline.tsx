// src/components/vendor-portal/ui/vp-activity-timeline.tsx
import { VpStatusBadge } from "./vp-status-badge"

export interface VpTimelineEvent {
  id:        string
  date:      Date
  actor:     string
  fromStatus?: string | null
  toStatus:  string | null
  notes?:    string | null
}

interface VpActivityTimelineProps {
  events: VpTimelineEvent[]
  title?: string
}

export function VpActivityTimeline({
  events,
  title = "Activity Timeline",
}: VpActivityTimelineProps) {
  if (!events.length) return null

  return (
    <div>
      <p className="mb-3 text-sm font-semibold">{title}</p>
      <ol className="relative border-l border-muted-foreground/20">
        {events.map((event, idx) => (
          <li key={event.id} className="mb-6 ml-4 last:mb-0">
            {/* Dot */}
            <div className="absolute -left-1.5 mt-1 h-3 w-3 rounded-full border border-background bg-primary" />

            <div className="flex flex-col gap-1">
              {/* Status transition */}
              <div className="flex flex-wrap items-center gap-2">
                {event.fromStatus && (
                  <>
                    <VpStatusBadge status={event.fromStatus} />
                    <span className="text-xs text-muted-foreground">→</span>
                  </>
                )}
                {event.toStatus && <VpStatusBadge status={event.toStatus} />}
              </div>

              {/* Actor + date */}
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">{event.actor}</span>
                {" · "}
                {new Date(event.date).toLocaleDateString("en-IN", {
                  day: "numeric", month: "short", year: "numeric",
                  hour: "2-digit", minute: "2-digit",
                })}
              </p>

              {/* Notes */}
              {event.notes && (
                <p className="mt-0.5 text-xs text-muted-foreground italic">
                  &ldquo;{event.notes}&rdquo;
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}