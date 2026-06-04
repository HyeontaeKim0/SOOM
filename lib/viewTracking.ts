import { cookies } from "next/headers";

export const VIEWER_ID_COOKIE = "viewer_id";

const VIEWER_ID_MAX_AGE = 60 * 60 * 24 * 365;

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidViewerId(id: string): boolean {
  return UUID_RE.test(id);
}

export function buildUserViewerKey(userId: string): string {
  return `u:${userId}`;
}

export function buildAnonymousViewerKey(viewerId: string): string {
  return `a:${viewerId}`;
}

export async function getOrCreateAnonymousViewerId(): Promise<string> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(VIEWER_ID_COOKIE)?.value;

  if (existing && isValidViewerId(existing)) {
    return existing;
  }

  const viewerId = crypto.randomUUID();
  cookieStore.set(VIEWER_ID_COOKIE, viewerId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: VIEWER_ID_MAX_AGE,
    path: "/",
  });

  return viewerId;
}
