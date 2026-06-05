import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { hasSessionCookie, isPublicRoute } from "@/lib/auth/publicRoutes";

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isPublicRoute(pathname)) {
    return NextResponse.next();
  }

  if (!hasSessionCookie(request.cookies)) {
    return NextResponse.redirect(new URL("/board", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
