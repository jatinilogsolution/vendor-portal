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

export default function UserFilters({
  defaultValue = "",
  vendors,
  selectedVendor = "",
  showVendorFilter = false,
}: Props) {
  const [value, setValue] = useState(defaultValue);
  const debouncedValue = useDebounce(value, 300);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const currentParams = searchParams.toString();
    const params = new URLSearchParams(currentParams);
    if (debouncedValue) {
      params.set("search", debouncedValue);
    } else {
      params.delete("search");
    }
    const nextParams = params.toString();
    if (nextParams !== currentParams) {
      router.replace(`/admin?${nextParams}`);
    }
  }, [debouncedValue, router, searchParams]);

  const handleVendorChange = (vendorId: string) => {
    const currentParams = searchParams.toString();
    const params = new URLSearchParams(currentParams);
    if (vendorId && vendorId !== "ALL") {
      params.set("vendorId", vendorId);
    } else {
      params.delete("vendorId");
    }
    const nextParams = params.toString();
    if (nextParams !== currentParams) {
      router.replace(`/admin?${nextParams}`);
    }
  };

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
