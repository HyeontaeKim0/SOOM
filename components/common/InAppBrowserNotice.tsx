"use client";

import { useEffect, useState } from "react";
import {
  getInAppBrowserName,
  isInAppBrowser,
} from "@/lib/utils/inAppBrowser";

const DISMISS_KEY = "soom-in-app-browser-notice-dismissed";

export default function InAppBrowserNotice() {
  const [visible, setVisible] = useState(false);
  const [appName, setAppName] = useState<string | null>(null);

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

  if (!visible) {
    return null;
  }

  return (
    <div className="border-b border-[#E8E2DA] bg-[#FFF8F0] px-4 py-3">
      <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3">
        <p className="text-xs leading-relaxed text-[#5C5246]">
          {appName ? `${appName} 앱` : "앱"} 내 브라우저에서는 Google 로그인이
          되지 않을 수 있어요.{" "}
          <span className="font-semibold text-[#2A241D]">
            우측 상단 메뉴(⋯) → Safari·Chrome에서 열기
          </span>
          로 접속해 주세요.
        </p>
        <button
          type="button"
          onClick={() => {
            sessionStorage.setItem(DISMISS_KEY, "1");
            setVisible(false);
          }}
          className="shrink-0 text-xs text-[#8C8478] hover:text-[#2A241D] transition-colors"
          aria-label="안내 닫기"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
