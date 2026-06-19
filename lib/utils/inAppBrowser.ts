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
