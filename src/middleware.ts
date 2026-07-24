import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("token");

  // Protect /dashboard — redirect to landing page if not authenticated
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  // Protect /login - redirect to dashboard if already authenticated
  if (request.nextUrl.pathname.startsWith("/login")) {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  // Allow everyone to view the landing page (/)
  // Logged-in users will see a "Go to Dashboard" button on the landing page itself.

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
