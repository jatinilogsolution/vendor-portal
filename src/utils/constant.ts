import { IconChartBar, IconDashboard, IconFolder, IconHelp, IconListDetails, IconSettings, IconUsers } from "@tabler/icons-react";

export const UserRole = ["BOSS", "ADMIN", "VENDOR", "TVENDOR", "TADMIN"] as const;
export type Role = (typeof UserRole)[number];
export enum UserRoleEnum {
  BOSS = "BOSS",
  ADMIN = "ADMIN",
  VENDOR = "VENDOR",
  TVENDOR = "TVENDOR",
  TADMIN = "TADMIN"
}




export function getGreeting() {
  const now = new Date();
  const hour = now.getHours(); // 0 - 23

  if (hour >= 5 && hour < 12) {
    return "Good morning";
  } else if (hour >= 12 && hour < 17) {
    return "Good afternoon";
  } else if (hour >= 17 && hour < 21) {
    return "Good evening";
  } else {
    return "Living on Coffie!";
  }
}


export const SideBarData = {
  navMain: [
    { title: "Dashboard", url: "/dashboard", icon: IconDashboard, headerTitle: "Dashboard" },
    { title: "POD", url: "/pod", icon: IconListDetails, only: [UserRoleEnum.ADMIN, UserRoleEnum.BOSS, UserRoleEnum.TADMIN], headerTitle: "Proof of Deliveries" },
    { title: "LRs Details", url: "/lorries", icon: IconChartBar, headerTitle: "Lorries Reciepts asigned with Vehicle (Without POD)" },
    { title: "Invoice", url: "/invoices", icon: IconFolder, headerTitle: "Booking Cover Note with Invoices" },
    { title: "Admin", url: "/admin", icon: IconUsers, only: [UserRoleEnum.ADMIN, UserRoleEnum.BOSS, UserRoleEnum.TADMIN], headerTitle: "Admin Control" },
    { title: "Profile", url: "/profile", icon: IconUsers, headerTitle: "Admin Control", hidden: true },
    { title: "Annexure", url: "/lorries/annexure", icon: IconUsers, headerTitle: "BCN / Annexure", hidden: true },


  ],
  navSecondary: [
    { title: "Settings", url: "#", icon: IconSettings },
    { title: "Get Help", url: "#", icon: IconHelp },
  ],
}
