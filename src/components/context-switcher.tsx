"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { UserRoleEnum } from "@/utils/constant";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CONTEXTS = [
  { value: "transport", label: "Transport Portal", href: "/dashboard" },
  { value: "vendor", label: "Vendor Portal", href: "/vendor-portal" },
];

export function ContextSwitcher() {
  const { data } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const isBoss = data?.user?.role === UserRoleEnum.BOSS;
  const current = useMemo(() => {
    if (pathname?.startsWith("/vendor-portal")) return "vendor";
    return "transport";
  }, [pathname]);

  if (!isBoss) return null;

  return (
    <Select
      value={current}
      onValueChange={(value) => {
        const target = CONTEXTS.find((ctx) => ctx.value === value)?.href;
        if (target) router.push(target);
      }}
    >
      <SelectTrigger size="sm" className="min-w-40">
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {CONTEXTS.map((ctx) => (
          <SelectItem key={ctx.value} value={ctx.value}>
            {ctx.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
