// src/lib/vendor-portal/index.ts
export { requireVendorPortalSession } from "./guard"
export {
  VendorPortalRoles, VendorPortalHomeByRole,
  isVendorPortalRole, getVendorPortalHome,
  isAdmin, isBoss, isVendor, isAdminOrBoss,
} from "./roles"
export type { VendorPortalRole } from "./roles"
export { logVpAudit } from "./audit"
export { createVpNotification, getInternalUserIds } from "./notify"