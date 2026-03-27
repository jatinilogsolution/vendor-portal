// src/lib/vendor-portal/roles.ts
import { UserRoleEnum } from "@/utils/constant"

export const VendorPortalRoles = [
  UserRoleEnum.BOSS,
  UserRoleEnum.ADMIN,
  UserRoleEnum.VENDOR,
] as const

export type VendorPortalRole = (typeof VendorPortalRoles)[number]

export const VendorPortalHomeByRole: Record<VendorPortalRole, string> = {
  [UserRoleEnum.BOSS]: "/vendor-portal/boss",
  [UserRoleEnum.ADMIN]: "/vendor-portal/admin",
  [UserRoleEnum.VENDOR]: "/vendor-portal/vendor",
}

export function isVendorPortalRole(role?: string | null): role is VendorPortalRole {
  return VendorPortalRoles.includes(role as VendorPortalRole)
}
export function getVendorPortalHome(role: VendorPortalRole): string {
  return VendorPortalHomeByRole[role]
}
export const isAdmin = (r?: string | null) => r === UserRoleEnum.ADMIN
export const isBoss = (r?: string | null) => r === UserRoleEnum.BOSS
export const isVendor = (r?: string | null) => r === UserRoleEnum.VENDOR
export const isAdminOrBoss = (r?: string | null) => isAdmin(r) || isBoss(r)