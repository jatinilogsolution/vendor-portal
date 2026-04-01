import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

import {
  isMaintenanceAllowedPath,
  isMaintenanceEnabled,
} from "@/lib/maintenance";

const protectedPages = [
  "/dashboard",
  "/profile",
  "/settings",
  "/admin",
  "/invoices",
  "/lorries",
  "/pod",
  "/profile",
  "/settings",
  "/api",
  "/vendor-portal",
];

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isApiRoute = pathname.startsWith("/api/");

  if (isMaintenanceEnabled() && !isMaintenanceAllowedPath(pathname)) {
    if (isApiRoute) {
      return NextResponse.json(
        { error: "Service temporarily unavailable" },
        { status: 503 },
      );
    }

    return NextResponse.redirect(new URL("/maintenance", req.url));
  }

  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

  const isAuthPage = pathname.startsWith("/auth/");
  const isProtectedPage = protectedPages.some(page => pathname === page || pathname.startsWith(page + "/"));

  // 🔒 Protected pages must be authenticated
  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 🔄 Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/post-login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
