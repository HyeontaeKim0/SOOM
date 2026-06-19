const IN_APP_BROWSER_PATTERN =
  /KAKAOTALK|Instagram|FBAN|FBAV|Line\/|NAVER|Snapchat|Twitter|Threads/i;

export function isInAppBrowser(userAgent = ""): boolean {
  if (!userAgent) {
    return false;
  }

  const isIosWebView =
    /iPhone|iPad|iPod/i.test(userAgent) &&
    /AppleWebKit/i.test(userAgent) &&
    !/Safari/i.test(userAgent);

  const isAndroidWebView =
    /Android/i.test(userAgent) && /;\s*wv\)|Version\/\d+.*Chrome/i.test(userAgent);

  return (
    IN_APP_BROWSER_PATTERN.test(userAgent) || isIosWebView || isAndroidWebView
  );
}

export function getInAppBrowserName(userAgent = ""): string | null {
  if (/KAKAOTALK/i.test(userAgent)) return "카카오톡";
  if (/Instagram/i.test(userAgent)) return "인스타그램";
  if (/FBAN|FBAV/i.test(userAgent)) return "페이스북";
  if (/Line\//i.test(userAgent)) return "라인";
  if (/NAVER/i.test(userAgent)) return "네이버";
  if (/Threads/i.test(userAgent)) return "Threads";

  if (isInAppBrowser(userAgent)) return "앱";
  return null;
}

/**
 * 인앱 브라우저에서 외부 브라우저로 열기를 시도합니다.
 * OS·앱 정책상 100% 보장되지 않으며, 사용자 탭(클릭)이 필요합니다.
 */
export async function openInExternalBrowser(
  url = typeof window !== "undefined" ? window.location.href : "",
): Promise<"opened" | "copied"> {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";

  if (/Android/i.test(ua)) {
    const path = url.replace(/^https?:\/\//, "");
    const fallback = encodeURIComponent(url);
    window.location.href = `intent://${path}#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=${fallback};end`;
    return "opened";
  }

  if (/iPhone|iPad|iPod/i.test(ua)) {
    const safariUrl = url.replace(/^https:\/\//, "x-safari-https://");
    window.location.href = safariUrl;
    return "opened";
  }

  window.open(url, "_blank", "noopener,noreferrer");
  return "opened";
}

export async function copyCurrentUrl(): Promise<void> {
  if (typeof window === "undefined" || !navigator.clipboard) {
    return;
  }

  await navigator.clipboard.writeText(window.location.href);
}
