
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