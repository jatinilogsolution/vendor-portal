import fs from "fs";
import path from "path";

import { UserRoleEnum } from "@/utils/constant";

export const MAINTENANCE_FLAG_PATH = path.join(
  process.cwd(),
  "maintenance.flag",
);

export const MAINTENANCE_ALLOWED_PATHS = [
  "/maintenance",
  "/auth",
  "/api/auth",
  "/api/system/maintenance",
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml",
  "/_next",
] as const;

export function isMaintenanceEnabled(): boolean {
  return fs.existsSync(MAINTENANCE_FLAG_PATH);
}

export function enableMaintenance(): void {
  fs.writeFileSync(MAINTENANCE_FLAG_PATH, "enabled\n", "utf-8");
}

export function disableMaintenance(): void {
  if (fs.existsSync(MAINTENANCE_FLAG_PATH)) {
    fs.unlinkSync(MAINTENANCE_FLAG_PATH);
  }
}

export function isMaintenanceAllowedPath(pathname: string): boolean {
  return MAINTENANCE_ALLOWED_PATHS.some((allowedPath) =>
    pathname === allowedPath || pathname.startsWith(`${allowedPath}/`),
  );
}

export function canManageMaintenance(role?: string | null): boolean {
  return (
    role === UserRoleEnum.BOSS ||
    role === UserRoleEnum.ADMIN ||
    role === UserRoleEnum.TADMIN
  );
}
