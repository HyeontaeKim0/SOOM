import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const token = await getToken({
      req,
      secret: process.env.AUTH_SECRET,
    });

    if (!token || token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/board", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
