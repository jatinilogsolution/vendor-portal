import React from "react"
import { TableCell, TableRow } from "./ui/table"
import { Skeleton } from "./ui/skeleton"

interface TableLoaderProps {
  length?: number
}

const TableLoader: React.FC<TableLoaderProps> = ({ length = 5 }) => {
  return (
    <div className=" w-full">
      {Array.from({ length }).map((_, i) => (
        <div key={i}>
          <div><Skeleton className="h-4" /></div>
          <div><Skeleton className="h-4 " /></div>
          <div><Skeleton className="h-4 " /></div>
          <div className="text-center"><Skeleton className="h-4 mx-auto" /></div>
          <div className="text-center"><Skeleton className="h-4  mx-auto" /></div>
          <div className="text-right">
            <div className="flex justify-end gap-1">
              <Skeleton className="h-8  rounded-md" />
              <Skeleton className="h-8  rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TableLoader
