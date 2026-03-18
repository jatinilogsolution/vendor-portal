"use client";

import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/hooks/use-debounce";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Props {
  defaultValue?: string;
  vendors: any[];
  selectedVendor?: string;
  showVendorFilter?: boolean;
}

export default function UserFilters({ onSearch }: Props) {
  const [value, setValue] = useState("")

  return (
    <div className="flex flex-wrap items-center gap-4">
      <Input
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="max-w-xs"
      />

      {showVendorFilter && (
        <Select
          defaultValue={selectedVendor || "ALL"}
          onValueChange={handleVendorChange}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Filter by Vendor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Vendors</SelectItem>
            {vendors.map((vendor) => (
              <SelectItem key={vendor.id} value={vendor.id}>
                {vendor.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
