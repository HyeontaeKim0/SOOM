export function isPublicRoute(pathname: string): boolean {
  if (pathname === "/") return true;
  if (pathname === "/hot") return true;
  // /board, /board/[id] 는 비로그인 접근 허용, /board/create 는 로그인 필요
  if (pathname === "/board" || pathname.startsWith("/board/")) {
    return pathname !== "/board/create";
  }
  return false;
}

const SESSION_COOKIE_NAMES = [
  "__Secure-authjs.session-token",
  "authjs.session-token",
  "__Secure-next-auth.session-token",
  "next-auth.session-token",
] as const;

export function hasSessionCookie(
  cookies: Pick<import("next/server").NextRequest["cookies"], "has">,
): boolean {
  return SESSION_COOKIE_NAMES.some((name) => cookies.has(name));
}
