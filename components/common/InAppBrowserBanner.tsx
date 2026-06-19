"use client";

import { useEffect, useState } from "react";
import {
  copyCurrentUrl,
  getInAppBrowserName,
  isInAppBrowser,
  openInExternalBrowser,
} from "@/lib/utils/inAppBrowser";

const DISMISS_KEY = "soom-in-app-browser-banner-dismissed";

export default function InAppBrowserBanner() {
  const [visible, setVisible] = useState(false);
  const [appName, setAppName] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const ua = navigator.userAgent;

    if (!isInAppBrowser(ua)) {
      return;
    }

    if (sessionStorage.getItem(DISMISS_KEY) === "1") {
      return;
    }

    setAppName(getInAppBrowserName(ua));
    setVisible(true);
  }, []);

  const handleOpenExternal = async () => {
    setFeedback(null);

    try {
      await openInExternalBrowser();
      setFeedback("외부 브라우저로 이동을 시도했어요.");
    } catch {
      await copyCurrentUrl();
      setFeedback("주소를 복사했어요. Safari·Chrome에 붙여넣어 주세요.");
    }
  };

  const handleCopyUrl = async () => {
    try {
      await copyCurrentUrl();
      setFeedback("주소를 복사했어요. Safari·Chrome에 붙여넣어 주세요.");
    } catch {
      setFeedback("복사에 실패했어요. 주소창 URL을 직접 복사해 주세요.");
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  };

  if (!visible) {
    return null;
  }

  return (
    <div className="sticky top-0 z-60 border-b border-[#E8E2DA] bg-[#FFF8F0] px-4 py-3">
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-2">
        <p className="text-sm font-semibold text-[#2A241D]">
          {appName ? `${appName} 앱` : "인앱 브라우저"}에서는 Google 로그인·일부
          기능이 제한될 수 있어요.
        </p>
        <p className="text-xs text-[#8C8478]">
          Safari·Chrome에서 열면 정상적으로 이용할 수 있어요.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleOpenExternal}
            className="rounded-full bg-[#2A241D] px-4 py-2 text-xs font-semibold text-white hover:bg-[#3D3530] transition-colors"
          >
            외부 브라우저에서 열기
          </button>
          <button
            type="button"
            onClick={handleCopyUrl}
            className="rounded-full border border-[#E0D9D0] bg-white px-4 py-2 text-xs font-semibold text-[#6B6358] hover:bg-[#F5F0EB] transition-colors"
          >
            주소 복사
          </button>
          <button
            type="button"
            onClick={handleDismiss}
            className="rounded-full px-3 py-2 text-xs font-semibold text-[#8C8478] hover:text-[#2A241D] transition-colors"
          >
            닫기
          </button>
        </div>

        {feedback && (
          <p className="text-xs text-[#6B6358]">{feedback}</p>
        )}
      </div>
    </div>
  );
}
