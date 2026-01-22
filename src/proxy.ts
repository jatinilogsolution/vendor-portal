import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

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
];

export async function proxy(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

  //   const isApiRoute = pathname.startsWith("/api");
  const isAuthPage = pathname.startsWith("/auth/");
  const isProtectedPage = protectedPages.includes(pathname);

  // 🔒 Protected pages must be authenticated
  if (isProtectedPage && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  // 🔄 Redirect logged-in users away from auth pages
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
