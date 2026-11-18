"use client";

import { useState, useSyncExternalStore } from "react";
import { isInAppBrowser } from "@/lib/utils/inAppBrowser";

const DISMISS_KEY = "soom-in-app-browser-notice-dismissed";

const subscribeNoop = () => () => {};

// 일부 인앱 브라우저·프라이빗 모드에서는 sessionStorage 접근이 예외를 던질 수 있다.
function readDismissed(): boolean {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === "1";
  } catch {
    return false;
  }
}

function writeDismissed() {
  try {
    sessionStorage.setItem(DISMISS_KEY, "1");
  } catch {
    // 저장에 실패해도 이번 화면에서만 닫히면 충분하다.
  }
}

export default function InAppBrowserNotice() {
  // 서버/하이드레이션 시에는 false, 클라이언트에서만 UA와 닫힘 여부로 판별
  const shouldShow = useSyncExternalStore(
    subscribeNoop,
    () => isInAppBrowser(navigator.userAgent) && !readDismissed(),
    () => false,
  );
  const [closed, setClosed] = useState(false);

  if (!shouldShow || closed) {
    return null;
  }

  return (
    <div className="border-b border-[#E8E2DA] bg-[#FFF8F0] px-4 py-3">
      <div className="mx-auto flex w-full max-w-3xl items-start justify-between gap-3">
        <p className="text-xs leading-relaxed text-[#5C5246]">
          어플 내부 브라우저에서는 Google 로그인이 되지 않을 수 있어요.{" "}
          <span className="font-semibold text-[#2A241D]">
            우측 상단 메뉴(⋯) → 외부 브라우저에서 열기
          </span>
          로 접속해 주세요.
        </p>
        <button
          type="button"
          onClick={() => {
            writeDismissed();
            setClosed(true);
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
