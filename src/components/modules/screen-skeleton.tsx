"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

interface ScreenSkeletonProps {
  className?: string;
}

const ScreenSkeleton: React.FC<ScreenSkeletonProps> = ({ className }) => {
  return (
    <div
      className={`w-full min-h-screen p-4 flex flex-col space-y-4 animate-pulse ${className || ""}`}
    >
      {/* Header */}
      <Skeleton className="h-16 w-full rounded-md" />

      {/* Content */}
      <div className="flex-1 space-y-4 mt-4">
        {/* Example lines */}
        <Skeleton className="h-6 w-3/4 rounded-md" />
        <Skeleton className="h-6 w-full rounded-md" />
        <Skeleton className="h-6 w-5/6 rounded-md" />
        <Skeleton className="h-6 w-2/3 rounded-md" />
      </div>
    </div>
  );
};

export default ScreenSkeleton;
