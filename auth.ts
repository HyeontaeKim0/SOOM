import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";

import { prisma } from "@/lib/prisma";

function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/hot") return true;
  // /board, /board/[id] 는 비로그인 접근 허용, /board/create 는 로그인 필요
  if (pathname === "/board" || pathname.startsWith("/board/")) {
    return pathname !== "/board/create";
  }
  return false;
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  // DB 세션은 Edge 미들웨어와 Prisma 조합에서 문제가 되기 쉬워 JWT 세션을 사용합니다.
  // User / Account 등은 여전히 PostgreSQL에 저장됩니다.
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const pathname = nextUrl.pathname;

      if (isPublicRoute(pathname)) return true;

      // 로그인이 필요한 경로에 비로그인 접근 시 게시판으로 리다이렉트
      if (!isLoggedIn) {
        return Response.redirect(new URL("/board", nextUrl));
      }

      return true;
    },
  },
  trustHost: true,
});
