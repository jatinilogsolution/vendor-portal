import { Badge } from "@/components/ui/badge"

export default function UserRoleBadge({ role }: { role: string }) {
  const colorMap: Record<string, string> = {
    BOSS: "bg-red-500 text-white",
    ADMIN: "bg-blue-500 text-white",
    TADMIN: "bg-indigo-500 text-white",
    VENDOR: "bg-green-500 text-white",
    TVENDOR: "bg-emerald-500 text-white",
  }

  return <Badge className={`${colorMap[role] || "bg-gray-200"}`}>{role}</Badge>
}
