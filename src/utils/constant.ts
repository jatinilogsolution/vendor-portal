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

// Invoice Status Enum
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  PENDING_TADMIN_REVIEW = "PENDING_TADMIN_REVIEW",
  REJECTED_BY_TADMIN = "REJECTED_BY_TADMIN",
  PENDING_BOSS_REVIEW = "PENDING_BOSS_REVIEW",
  REJECTED_BY_BOSS = "REJECTED_BY_BOSS",
  APPROVED = "APPROVED",
  PAYMENT_APPROVED = "PAYMENT_APPROVED"
}

// Annexure Status Enum
export enum AnnexureStatus {
  DRAFT = "DRAFT",
  PENDING_TADMIN_REVIEW = "PENDING_TADMIN_REVIEW",
  PARTIALLY_APPROVED = "PARTIALLY_APPROVED",
  HAS_REJECTIONS = "HAS_REJECTIONS",
  PENDING_BOSS_REVIEW = "PENDING_BOSS_REVIEW",
  REJECTED_BY_BOSS = "REJECTED_BY_BOSS",
  APPROVED = "APPROVED"
}

// File Group Status Enum
export enum FileGroupStatus {
  PENDING = "PENDING",
  UNDER_REVIEW = "UNDER_REVIEW",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED"
}

// Status Labels for UI
export const InvoiceStatusLabels: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: "Draft",
  [InvoiceStatus.PENDING_TADMIN_REVIEW]: "Pending Admin Review",
  [InvoiceStatus.REJECTED_BY_TADMIN]: "Rejected by Admin",
  [InvoiceStatus.PENDING_BOSS_REVIEW]: "Pending Boss Review",
  [InvoiceStatus.REJECTED_BY_BOSS]: "Rejected by Boss",
  [InvoiceStatus.APPROVED]: "Approved",
  [InvoiceStatus.PAYMENT_APPROVED]: "Approved for Payment"
};

export const AnnexureStatusLabels: Record<AnnexureStatus, string> = {
  [AnnexureStatus.DRAFT]: "Draft",
  [AnnexureStatus.PENDING_TADMIN_REVIEW]: "Under Review",
  [AnnexureStatus.PARTIALLY_APPROVED]: "Partially Approved",
  [AnnexureStatus.HAS_REJECTIONS]: "Has Rejections",
  [AnnexureStatus.PENDING_BOSS_REVIEW]: "Pending Boss Review",
  [AnnexureStatus.REJECTED_BY_BOSS]: "Rejected by Boss",
  [AnnexureStatus.APPROVED]: "Approved"
};

export const FileGroupStatusLabels: Record<FileGroupStatus, string> = {
  [FileGroupStatus.PENDING]: "Pending",
  [FileGroupStatus.UNDER_REVIEW]: "Under Review",
  [FileGroupStatus.APPROVED]: "Approved",
  [FileGroupStatus.REJECTED]: "Rejected"
};

// Status Colors
export const InvoiceStatusColors: Record<InvoiceStatus, string> = {
  [InvoiceStatus.DRAFT]: "bg-slate-50 text-slate-600 border-slate-200",
  [InvoiceStatus.PENDING_TADMIN_REVIEW]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [InvoiceStatus.REJECTED_BY_TADMIN]: "bg-rose-50 text-rose-700 border-rose-200",
  [InvoiceStatus.PENDING_BOSS_REVIEW]: "bg-orange-50 text-orange-700 border-orange-200",
  [InvoiceStatus.REJECTED_BY_BOSS]: "bg-red-50 text-red-700 border-red-200",
  [InvoiceStatus.APPROVED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [InvoiceStatus.PAYMENT_APPROVED]: "bg-violet-50 text-violet-700 border-violet-200"
};

export const FileGroupStatusColors: Record<FileGroupStatus, string> = {
  [FileGroupStatus.PENDING]: "bg-slate-50 text-slate-600 border-slate-200",
  [FileGroupStatus.UNDER_REVIEW]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [FileGroupStatus.APPROVED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [FileGroupStatus.REJECTED]: "bg-rose-50 text-rose-700 border-rose-200"
};

// Valid Transitions (State Machine)
export const InvoiceStatusTransitions: Record<InvoiceStatus, InvoiceStatus[]> = {
  [InvoiceStatus.DRAFT]: [InvoiceStatus.PENDING_TADMIN_REVIEW],
  [InvoiceStatus.PENDING_TADMIN_REVIEW]: [InvoiceStatus.REJECTED_BY_TADMIN, InvoiceStatus.PENDING_BOSS_REVIEW],
  [InvoiceStatus.REJECTED_BY_TADMIN]: [InvoiceStatus.DRAFT, InvoiceStatus.PENDING_TADMIN_REVIEW],
  [InvoiceStatus.PENDING_BOSS_REVIEW]: [InvoiceStatus.REJECTED_BY_BOSS, InvoiceStatus.APPROVED],
  [InvoiceStatus.REJECTED_BY_BOSS]: [InvoiceStatus.DRAFT, InvoiceStatus.PENDING_TADMIN_REVIEW],
  [InvoiceStatus.APPROVED]: [InvoiceStatus.PAYMENT_APPROVED],
  [InvoiceStatus.PAYMENT_APPROVED]: []
};

export const AnnexureStatusTransitions: Record<AnnexureStatus, AnnexureStatus[]> = {
  [AnnexureStatus.DRAFT]: [AnnexureStatus.PENDING_TADMIN_REVIEW],
  [AnnexureStatus.PENDING_TADMIN_REVIEW]: [AnnexureStatus.PARTIALLY_APPROVED, AnnexureStatus.HAS_REJECTIONS],
  [AnnexureStatus.PARTIALLY_APPROVED]: [AnnexureStatus.HAS_REJECTIONS, AnnexureStatus.PENDING_BOSS_REVIEW],
  [AnnexureStatus.HAS_REJECTIONS]: [AnnexureStatus.DRAFT, AnnexureStatus.PENDING_TADMIN_REVIEW],
  [AnnexureStatus.PENDING_BOSS_REVIEW]: [AnnexureStatus.REJECTED_BY_BOSS, AnnexureStatus.APPROVED],
  [AnnexureStatus.REJECTED_BY_BOSS]: [AnnexureStatus.DRAFT, AnnexureStatus.PENDING_TADMIN_REVIEW],
  [AnnexureStatus.APPROVED]: []
};




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
