"use client";

import { Button } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import SSOModal, { useOverlayState } from "@/components/auth/SSOModal";

import { SquarePen } from "lucide-react";

export default function CreatePostButton({
  compact = false,
}: {
  compact?: boolean;
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const loginModalState = useOverlayState();

  const handlePress = () => {
    if (session) {
      router.push("/board/create");
    } else {
      loginModalState.open();
    }
  };

  if (compact) {
    return (
      <div className="fixed bottom-[100px] right-5">
        <button
          onClick={handlePress}
          className="flex items-center justify-center w-12 h-12 rounded-xl bg-signature text-white text-lg font-bold shrink-0 active:bg-[#3D3530] transition-colors"
          aria-label="글쓰기"
        >
          <SquarePen className="w-6 h-6" />
        </button>
        <SSOModal state={loginModalState} />
      </div>
    );
  }

  return (
    <>
      <Button
        className="bg-[#2A241D] text-white rounded-xl w-full h-[50px]"
        onPress={handlePress}
      >
        + 글쓰기
      </Button>
      <SSOModal state={loginModalState} />
    </>
  );
}
