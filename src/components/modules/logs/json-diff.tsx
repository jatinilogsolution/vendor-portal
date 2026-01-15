// components/modules/logs/json-diff.tsx
"use client";

import { useEffect, useRef } from "react";
import { create } from "jsondiffpatch";
import { format } from "jsondiffpatch/formatters/html";
// import "jsondiffpatch/dist/formatters-styles/html.css";
// import "jsondiffpatch/dist/formatters-styles/annotated.css";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, MinusCircle, PlusCircle } from "lucide-react";

interface JsonDiffProps {
  oldData?: Record<string, any>;
  newData?: Record<string, any>;
}

export default function JsonDiff({ oldData, newData }: JsonDiffProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const diffInstance = create({
      arrays: { detectMove: true },
      objectHash: (obj: any) => obj?.id || JSON.stringify(obj),
    });

    const delta = diffInstance.diff(oldData ?? {}, newData ?? {});

    if (!delta) {
      containerRef.current.innerHTML = `
        <div class="flex flex-col items-center justify-center py-14 text-muted-foreground">
          <svg class="w-12 h-12 mb-3 text-green-500" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
            <path d="M9 12l2 2 4-4" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p class="text-lg font-medium">No changes detected</p>
          <p class="text-sm opacity-80">Both versions contain identical values.</p>
        </div>
      `;
      return;
    }

    const html = format(delta, oldData);

    containerRef.current.innerHTML = `
      <style>
        /* Overall layout */
        .jsondiffpatch-delta {
          font-size: 14px;
          line-height: 1.5;
          font-family: ui-monospace, monospace;
          background: #0e0f11;
          color: #e5e7eb;
          padding: 18px;
          border-radius: 10px;
          border: 1px solid #1f2937;
        }

        /* Removed */
        .jsondiffpatch-deleted {
          background: rgba(255, 76, 76, 0.15);
          color: #fca5a5;
          border-left: 4px solid #ef4444;
          padding-left: 6px;
        }

        /* Added */
        .jsondiffpatch-added {
          background: rgba(16, 185, 129, 0.15);
          color: #86efac;
          border-left: 4px solid #22c55e;
          padding-left: 6px;
        }

        /* Modified */
        .jsondiffpatch-modified {
          background: rgba(234, 179, 8, 0.15);
          color: #facc15;
          border-left: 4px solid #eab308;
          padding-left: 6px;
        }

        /* Code block group */
        .jsondiffpatch-property-name {
          color: #60a5fa;
          font-weight: 600;
        }

        .jsondiffpatch-value {
          margin-left: 10px;
        }

        /* Hide unchanged blocks */
        .jsondiffpatch-unchanged {
          opacity: 0.35;
        }
      </style>

      <div class="jsondiffpatch-delta">${html}</div>
    `;
  }, [oldData, newData]);

  return (
    <Card className="border shadow-sm">
      <div className="border-b bg-muted/40 px-6 py-4 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-muted-foreground" />
          Data Changes
        </h3>

        <div className="flex gap-4 text-sm">
          <Badge variant="destructive" className="gap-1">
            <MinusCircle className="w-3.5 h-3.5" />
            Removed
          </Badge>
          <Badge className="bg-green-600 gap-1">
            <PlusCircle className="w-3.5 h-3.5" />
            Added
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <div className="w-3.5 h-3.5 rounded-full bg-yellow-500" />
            Modified
          </Badge>
        </div>
      </div>

      <div className="p-6 bg-background min-h-[260px]">
        <div
          ref={containerRef}
          className="text-sm overflow-x-auto leading-relaxed"
        />
      </div>
    </Card>
  );
}
