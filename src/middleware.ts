import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";
 
 
const protectedPages = ["/dashboard", "/profile", "/settings", "/admin"];

export async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  const sessionCookie = getSessionCookie(req);
  const isLoggedIn = !!sessionCookie;

//   const isApiRoute = pathname.startsWith("/api");
  const isAuthPage = pathname.startsWith("/auth/");
  const isProtectedPage = protectedPages.includes(pathname);

  // ✅ Allow unauthenticated access only for /api/cron-task
//   const isCronTask = pathname === "/api/cron-task";
//   const isBetterAuth = pathname === "/api/auth";


  // 🔒 API routes (except /api/cron-task) must be authenticated
//   if (isApiRoute && !isCronTask && !isBetterAuth && !isLoggedIn) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

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
    runtime: "nodejs",
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
    ],
};
