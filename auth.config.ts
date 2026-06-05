import type { NextAuthConfig } from "next-auth";

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/hot") return true;
  // /board, /board/[id] 는 비로그인 접근 허용, /board/create 는 로그인 필요
  if (pathname === "/board" || pathname.startsWith("/board/")) {
    return pathname !== "/board/create";
  }
  return false;
}

export const authConfig = {
  providers: [],
  trustHost: true,
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (isPublicRoute(pathname)) return true;

      if (!isLoggedIn) {
        return Response.redirect(new URL("/board", nextUrl));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
