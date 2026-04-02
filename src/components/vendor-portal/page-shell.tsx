// // src/components/vendor-portal/vp-shell.tsx
// "use client"

// import Link from "next/link"
// import { usePathname } from "next/navigation"
// import { signOut, useSession } from "@/lib/auth-client"
// import { useRouter } from "next/navigation"
// import { cn } from "@/lib/utils"
// import { Button } from "@/components/ui/button"
// import {
//   Select, SelectContent, SelectItem,
//   SelectTrigger, SelectValue,
// } from "@/components/ui/select"
// import {
//   IconLayoutDashboard, IconBuildingStore, IconCategory,
//   IconPackage, IconShoppingCart, IconFileInvoice,
//   IconReceipt, IconTruckDelivery, IconSettings,
//   IconCheckbox, IconCash, IconChartBar, IconBell, IconUsers,
//   IconClipboardList, IconRepeat,
// } from "@tabler/icons-react"
// import { VpNotificationBell } from "./vp-notification-bell"
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
// import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
// import { ModeToggle } from "../modules/theme-toogle"
// import { Loader2 } from "lucide-react"
// import { useEffect, useState } from "react"
// import { toast } from "sonner"
// import { VpGlobalSearch } from "./vp-global-search"
// import { IconUser } from "@tabler/icons-react"

// const ICON_MAP: Record<string, any> = {
//   dashboard: IconLayoutDashboard,
//   vendors: IconBuildingStore,
//   categories: IconCategory,
//   items: IconPackage,
//   procurement: IconClipboardList,
//   pos: IconShoppingCart,
//   pis: IconFileInvoice,
//   invoices: IconReceipt,
//   deliveries: IconTruckDelivery,
//   recurring: IconRepeat,
//   settings: IconSettings,
//   approvals: IconCheckbox,
//   payments: IconCash,
//   reports: IconChartBar,
//   bell: IconBell,
//   users: IconUsers,
//   user: IconUser
// }

// export interface VpNavItem {
//   title: string
//   href: string
//   icon: string
// }

// interface VpShellProps {
//   children: React.ReactNode
//   nav: VpNavItem[]
//   role: "ADMIN" | "BOSS" | "VENDOR"
//   sidebarTitle: string
// }

// const CONTEXTS = [
//   { value: "transport", label: "Transport Portal", href: "/dashboard" },
//   { value: "vendor", label: "Vendor Portal", href: "/vendor-portal" },
// ] as const

// export function VpShell({ children, nav, role, sidebarTitle }: VpShellProps) {
//   const { data } = useSession()
//   const pathname = usePathname()
//   const router = useRouter()
//   const [mounted, setMounted] = useState(false)
//   const isBoss = mounted && data?.user?.role === "BOSS"

//   const [isPending, setIsPending] = useState(false);

//   useEffect(() => {
//     setMounted(true)
//   }, [])

//   async function handleClick() {
//     try {
//       setIsPending(true);
//       await signOut({
//         fetchOptions: {
//           onError: (ctx) => {
//             toast.error(ctx.error.message);
//           },
//           onSuccess: () => {
//             toast.success("You’ve logged out. See you soon!");
//             router.push("/auth/login");
//             window.location.reload();
//           },
//         },
//       });
//     } catch (err: any) {
//       toast.error(err?.message || "Something went wrong while logging out.");
//     } finally {
//       setIsPending(false);
//     }
//   }

//   const currentCtx = pathname?.startsWith("/vendor-portal") ? "vendor" : "transport"

//   const notifHref =
//     role === "VENDOR"
//       ? "/vendor-portal/vendor/notifications"
//       : role === "ADMIN" ? "/vendor-portal/admin"
//         : "/vendor-portal/boss"

//   return (
//     <div className="flex h-screen flex-col overflow-hidden bg-background">
//       {/* ── Top bar ─────────────────────────────────────────── */}
//       <header className="flex h-14 shrink-0 items-center justify-between border-b pl-12 px-4">
//         {/* <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
//           {sidebarTitle}
//         </span> */}
//         <Link href={notifHref}>
//           <h2 className="text-xl text-center font-bold w-full ">
//             <span className="text-primary">Vendor</span>{" "}
//             <span className=" text-foreground">Portal</span>
//           </h2>
//         </Link>
//         {mounted && (role === "ADMIN" || role === "BOSS") && (
//           <VpGlobalSearch />
//         )}
//         <div className="flex items-center gap-3">
//           {isBoss && (
//             <Select value={currentCtx} onValueChange={(v) => {
//               const t = CONTEXTS.find((c) => c.value === v)?.href
//               if (t) router.push(t)
//             }}>
//               <SelectTrigger size="sm" className="min-w-40">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent align="end">
//                 {CONTEXTS.map((c) => (
//                   <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           )}
//           {mounted && <VpNotificationBell role={role} />}
//           {/* <span className="text-sm font-medium">{data?.user?.name ?? "—"}</span> */}


//         </div>
//       </header>

//       {/* ── Body ─────────────────────────────────────────────── */}
//       <div className="flex flex-1 overflow-hidden">
//         {/* Sidebar */}
//         <aside className="flex w-56 shrink-0 flex-col border-r">
//           <nav className="flex-1 overflow-y-auto py-3">
//             <ul className="space-y-0.5 px-2">
//               {nav.map((item) => {
//                 const Icon = ICON_MAP[item.icon] || IconBell
//                 // Exact match for root dashboard pages, prefix for rest
//                 const rootPages = ["/vendor-portal/admin", "/vendor-portal/boss", "/vendor-portal/vendor"]
//                 const isActive =
//                   pathname === item.href ||
//                   (!rootPages.includes(item.href) && pathname.startsWith(item.href))
//                 return (
//                   <li key={item.href}>
//                     <Link
//                       href={item.href}
//                       className={cn(
//                         "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
//                         isActive
//                           ? "bg-primary text-primary-foreground"
//                           : "text-muted-foreground hover:bg-muted hover:text-foreground",
//                       )}
//                     >
//                       <Icon size={16} stroke={1.5} />
//                       {item.title}
//                     </Link>
//                   </li>
//                 )
//               })}
//             </ul>
//           </nav>
//         </aside>

//         {/* Page content */}
//         <main className="flex-1 overflow-y-auto p-6">{children}</main>
//       </div>
//     </div>
//   )
// }


// In vp-shell.tsx — replace the header section:

"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { signOut, useSession } from "@/lib/auth-client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  IconLayoutDashboard, IconBuildingStore, IconCategory,
  IconPackage, IconShoppingCart, IconFileInvoice,
  IconReceipt, IconTruckDelivery, IconSettings,
  IconCheckbox, IconCash, IconChartBar, IconBell, IconUsers,
  IconClipboardList, IconRepeat, IconUser, IconBuilding, IconHistory, IconMenu2,
} from "@tabler/icons-react"
import { VpNotificationBell } from "./vp-notification-bell"
import { VpGlobalSearch } from "./vp-global-search"
import { useEffect, useState } from "react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Loader2 } from "lucide-react"
import { ModeToggle } from "../modules/theme-toogle"
import { toast } from "sonner"

export interface VpNavItem {
  title: string
  href: string
  icon: string
}

interface VpShellProps {
  children: React.ReactNode
  nav: VpNavItem[]
  role: "ADMIN" | "BOSS" | "VENDOR"
  sidebarTitle: string
}

const CONTEXTS = [
  { value: "transport", label: "Transport Portal", href: "/dashboard" },
  { value: "vendor", label: "Vendor Portal", href: "/vendor-portal" },
] as const

const ICON_MAP: Record<string, any> = {
  dashboard: IconLayoutDashboard,
  companies: IconBuilding,
  vendors: IconBuildingStore,
  categories: IconCategory,
  items: IconPackage,
  procurement: IconClipboardList,
  pos: IconShoppingCart,
  pis: IconFileInvoice,
  invoices: IconReceipt,
  deliveries: IconTruckDelivery,
  recurring: IconRepeat,
  settings: IconSettings,
  approvals: IconCheckbox,
  payments: IconCash,
  reports: IconChartBar,
  logs: IconHistory,
  bell: IconBell,
  users: IconUsers,
  user: IconUser,
}

export function VpShell({ children, nav, role, sidebarTitle }: VpShellProps) {
  const { data } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [isPending, setIsPending] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleClick() {
    try {
      setIsPending(true);
      await signOut({
        fetchOptions: {
          onError: (ctx) => {
            toast.error(ctx.error.message);
          },
          onSuccess: () => {
            toast.success("You’ve logged out. See you soon!");
            router.push("/auth/login");
            window.location.reload();
          },
        },
      });
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong while logging out.");
    } finally {
      setIsPending(false);
    }
  }

  const userRole = data?.user?.role
  const isBoss = userRole === "BOSS"
  const currentCtx = pathname?.startsWith("/vendor-portal") ? "vendor" : "transport"
  const accountSettingsHref =
    role === "VENDOR" ? "/vendor-portal/vendor/profile" : "/vendor-portal/profile"
  const notificationsHref =
    role === "VENDOR"
      ? "/vendor-portal/vendor/notifications"
      : role === "ADMIN"
        ? "/vendor-portal/admin/notifications"
        : "/vendor-portal/boss/notifications"

  // Boss is viewing admin pages — show "Back to My View" button
  const bossOnAdminPage =
    isBoss && pathname?.startsWith("/vendor-portal/admin")

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* ── Top bar ─────────────────────────────────────────── */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsSidebarCollapsed((prev) => !prev)}
            aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconMenu2 size={18} />
          </Button>
          <Link href={"/"} className=" hidden md:block">
            <h2 className="text-xl text-center font-bold w-full ">
              <span className="text-primary">Vendor</span>{" "}
              <span className=" text-foreground">Portal</span>
            </h2>
          </Link>
          {/* Boss viewing admin pages — show back button */}
          {/* {bossOnAdminPage && (
            <Button
              variant="outline"
              size="sm"
              className="gap-1.5 text-xs"
              onClick={() => router.push("/vendor-portal/boss")}
            >
              ← My Dashboard
            </Button>
          )} */}
        </div>
        {(role === "ADMIN" || isBoss) && <VpGlobalSearch />}


        <div className="flex items-center gap-3">

          {/* Global search — admin + boss only */}
          <div className="border-t px-3 py-3">


            {isBoss && (
              <div className="">
                {/* <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Portal View
                </p> */}
                <Select
                  value={currentCtx}
                  onValueChange={(v) => {
                    const t = CONTEXTS.find((c) => c.value === v)?.href
                    if (t) router.push(t)
                  }}
                >
                  <SelectTrigger size="sm" className="h-8 w-44 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent align="end">
                    {CONTEXTS.map((c) => (
                      <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <VpNotificationBell role={role} />



          {mounted && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 px-2 hover:bg-muted/50 transition-all rounded-full group"
                >
                  <div className="hidden lg:flex flex-col items-end">
                    <span className="text-xs font-medium leading-none">
                      {data?.user?.name}
                    </span>
                    <span className="text-[10px] text-muted-foreground capitalize">
                      {data?.user?.role?.toLowerCase()}
                    </span>
                  </div>
                  <Avatar className="h-8 w-8 border border-primary/20 p-0.5 transition-transform group-hover:scale-105">
                    <AvatarImage
                      src={data?.user?.image || ""}
                      alt={data?.user?.name ?? "User"}
                      className="rounded-full"
                    />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">
                      {data?.user?.name?.[0]?.toUpperCase() ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                className="w-64 mt-2 shadow-2xl border-primary/10 p-2"
                align="end"
              >
                <DropdownMenuLabel className="font-normal px-2 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border border-border">
                      <AvatarImage src={data?.user?.image || ""} />
                      <AvatarFallback>{data?.user?.name?.[0] ?? "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col space-y-1 overflow-hidden">
                      <p className="text-sm font-bold leading-none truncate">
                        {data?.user?.name ?? "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground italic truncate">
                        {data?.user?.email ?? ""}
                      </p>
                    </div>
                  </div>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <div className="p-1">
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                    <Link
                      href={accountSettingsHref}
                      className="flex items-center justify-between w-full"
                    >
                      <span>Account Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer rounded-md">
                    <Link
                      href={notificationsHref}
                      className="flex items-center justify-between w-full"
                    >
                      <span>Notifications Center</span>
                    </Link>
                  </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator />

                <div className="px-2 py-2">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 px-1">
                    Appearance
                  </p>
                  <ModeToggle />
                </div>

                <DropdownMenuSeparator />

                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleClick}
                    disabled={isPending}
                    className="text-red-500 font-bold focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 cursor-pointer rounded-md"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      "Log out"
                    )}
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          )}



        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={cn(
            "flex shrink-0 flex-col border-r transition-all duration-200",
            isSidebarCollapsed ? "w-16" : "w-64",
          )}
        >
          <nav className="flex-1 overflow-y-auto py-3">
            <ul className={cn("space-y-0.5", isSidebarCollapsed ? "px-1" : "px-2")}>
              {nav.map((item) => {
                const Icon = ICON_MAP[item.icon] || IconBell
                const rootPages = [
                  "/vendor-portal/admin",
                  "/vendor-portal/boss",
                  "/vendor-portal/vendor",
                ]
                const isActive =
                  pathname === item.href ||
                  (!rootPages.includes(item.href) && pathname.startsWith(item.href))

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center rounded-md text-sm font-medium transition-colors",
                        isSidebarCollapsed ? "justify-center px-2 py-2.5" : "gap-3 px-3 py-2",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon size={16} stroke={1.5} />
                      <span className={cn(isSidebarCollapsed && "hidden")}>{item.title}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>

          {/* Bottom: user info */}

        </aside>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
