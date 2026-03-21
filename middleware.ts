import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip login page and API routes
  if (pathname === "/studio/login" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/studio")) {
    const auth = request.cookies.get("studio-auth");
    const password = process.env.STUDIO_PASSWORD;

    if (!password || auth?.value !== password) {
      const loginUrl = new URL("/studio/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/studio/:path*"],
};
