export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.AUTH_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null);

  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }

  return "http://localhost:3000";
}
