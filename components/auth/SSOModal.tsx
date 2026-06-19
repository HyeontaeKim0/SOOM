"use client";

import { useState } from "react";
import { Modal, useOverlayState } from "@heroui/react";
import type { UseOverlayStateReturn } from "@heroui/react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import {
  copyCurrentUrl,
  getInAppBrowserName,
  isInAppBrowser,
  openInExternalBrowser,
} from "@/lib/utils/inAppBrowser";

import Logo from "@/assets/logo/BetaLogo.png";

export { useOverlayState };
export type { UseOverlayStateReturn };

interface SSOModalProps {
  state: UseOverlayStateReturn;
}

export default function SSOModal({ state }: SSOModalProps) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const inAppBrowser = isInAppBrowser(
    typeof navigator !== "undefined" ? navigator.userAgent : "",
  );
  const appName = getInAppBrowserName(
    typeof navigator !== "undefined" ? navigator.userAgent : "",
  );

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/board" });
  };

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

  return (
    <Modal state={state}>
      <Modal.Backdrop isDismissable>
        <Modal.Container placement="center" size="sm">
          <Modal.Dialog className="bg-[#FBF7F3] rounded-2xl p-8">
            <Modal.Header className="flex justify-end">
              <Modal.CloseTrigger className="text-[#8C8478] hover:text-[#2A241D] transition-colors text-xl" />
            </Modal.Header>

            <Modal.Body className="flex flex-col items-center gap-6 pb-4">
              <Image src={Logo} alt="logo" width={150} />

              <div className="flex flex-col items-center gap-1 text-center">
                <Modal.Heading className="text-lg font-bold text-[#2A241D]">
                  로그인이 필요해요
                </Modal.Heading>
                <p className="text-sm text-[#8C8478]">
                  {inAppBrowser
                    ? `${appName ?? "인앱 브라우저"}에서는 Google 로그인이 차단됩니다. 외부 브라우저에서 열어주세요.`
                    : "숨(SOOM)을 이용하려면 먼저 로그인해 주세요."}
                </p>
              </div>

              {inAppBrowser ? (
                <button
                  type="button"
                  onClick={handleOpenExternal}
                  className="flex w-full items-center justify-center rounded-full bg-[#2A241D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3D3530] transition-colors cursor-pointer"
                >
                  외부 브라우저에서 열기
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center gap-2 w-full justify-center rounded-full bg-[#2A241D] px-6 py-3 text-sm font-semibold text-white hover:bg-[#3D3530] transition-colors cursor-pointer"
                >
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09a6.49 6.49 0 0 1 0-4.17V7.07H2.18a10.96 10.96 0 0 0 0 9.86l3.66-2.84Z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google로 시작하기
                </button>
              )}

              {feedback && (
                <p className="text-xs text-center text-[#8C8478]">{feedback}</p>
              )}
            </Modal.Body>
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </Modal>
  );
}
