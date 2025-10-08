import { getSessionCookie } from "better-auth/cookies";
import { NextRequest, NextResponse } from "next/server";

const protectedPages = ["/dashboard", "/profile", "/settings", "/admin"];

export async function middleware(req: NextRequest) {
    const { nextUrl } = req;
    const pathname = nextUrl.pathname;

    const sessionCookie = getSessionCookie(req);
    const isLoggedIn = !!sessionCookie;

    const isApiRoute = pathname.startsWith("/api");
    const isProtectedPage = protectedPages.includes(pathname);
    const isAuthPage = pathname.startsWith("/auth/");

    if (isApiRoute && !isLoggedIn) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (isProtectedPage && !isLoggedIn) {
        return NextResponse.redirect(new URL("/auth/login", req.url));
    }

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
