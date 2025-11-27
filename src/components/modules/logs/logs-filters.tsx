// components/modules/logs/logs-filters.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search } from "lucide-react";

interface LogFiltersProps {
  onChange: (filters: Filters | ((prev: Filters) => Filters)) => void;
  onSearch: () => void;
}

export type Filters = {
  q: string;
  model: string;
  action: string;
  from: string;
  to: string;
};

export default function LogFilters({ onChange, onSearch }: LogFiltersProps) {
  const handleChange = (key: keyof Filters, value: string) => {
    onChange((prev: Filters) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-wrap gap-4 items-end bg-card p-4 rounded-lg border">
      <div className="flex-1 min-w-[200px]">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          className=" mt-1"
          placeholder="Search logs..."
          onChange={(e) => handleChange("q", e.target.value)}
        />
      </div>

      <div className="w-48">
        <Label htmlFor="model">Model</Label>
        <Input
          id="model"
          className=" mt-1"
          placeholder="e.g. User, Product"
          onChange={(e) => handleChange("model", e.target.value)}
        />
      </div>

      <div className="w-40">
        <Label htmlFor="action">Action</Label>
        <Select onValueChange={(v) => handleChange("action", v)}>
          <SelectTrigger id="action" className=" mt-1">
            <SelectValue placeholder="Select Action" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Select Action</SelectLabel>
              <SelectItem value="CREATE">CREATE</SelectItem>
              <SelectItem value="UPDATE">UPDATE</SelectItem>
              <SelectItem value="DELETE">DELETE</SelectItem>
            </SelectGroup>
          </SelectContent>

        </Select>
      </div>

      <div className="w-40">
        <Label htmlFor="from">From</Label>
        <Input
          id="from"
          type="date"
          className=" mt-1"
          onChange={(e) => handleChange("from", e.target.value)}
        />
      </div>

      <div className="w-40">
        <Label htmlFor="to">To</Label>
        <Input
          id="to"
          type="date"
          className=" mt-1"
          onChange={(e) => handleChange("to", e.target.value)}
        />
      </div>

      <Button onClick={onSearch} className="flex items-center gap-2">
        <Search className="w-4 h-4" />
        Search
      </Button>
    </div>
  );
}