"use client";
import type { Session } from "next-auth";
import { Drawer, Button } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { getAnonymousName } from "@/lib/utils/anonymousName";
import DefaultImg from "@/assets/login/DefaultImg.png";

export default function MyProfile({
  session,
  signOutAction,
}: {
  session: Session;
  signOutAction: () => void;
}) {
  const router = useRouter();
  const anonymousName = getAnonymousName(session.user?.id || "");

  return (
    <Drawer>
      <Button
        aria-label="프로필 메뉴"
        variant="secondary"
        className="bg-transparent px-2"
      >
        <div className="flex items-center gap-2">
          <Image
            src={DefaultImg}
            alt="profile"
            width={28}
            height={28}
            className="rounded-full"
          />
          <span className="hidden md:block text-sm font-semibold text-[#2A241D]">
            {anonymousName}
          </span>
        </div>
      </Button>
      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog>
            <Drawer.Header>
              <Drawer.CloseTrigger className="text-[#8C8478] hover:text-[#2A241D] transition-colors text-xl mt-3 mr-2" />
              <Drawer.Heading>
                <div className="flex items-center gap-3 mt-3">
                  <Image
                    src={DefaultImg}
                    alt="profile"
                    width={40}
                    height={40}
                    className="rounded-full"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-[#2A241D]">
                      {anonymousName}
                    </span>
                    <span className="text-xs text-[#8C8478]">
                      {session.user?.email}
                    </span>
                  </div>
                </div>
              </Drawer.Heading>
            </Drawer.Header>
            <Drawer.Body>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  slot="close"
                  variant="secondary"
                  className="w-full justify-start px-4 py-3 rounded-xl text-sm font-semibold text-[#2A241D] bg-[#F5F0EB] hover:bg-[#EDE8E0]"
                  onPress={() => router.push("/profile")}
                >
                  마이페이지
                </Button>
              </div>
            </Drawer.Body>
            <Drawer.Footer>
              <Button
                slot="close"
                className="flex-1 bg-[#2A241D] text-white"
                onPress={signOutAction}
              >
                로그아웃
              </Button>
            </Drawer.Footer>
          </Drawer.Dialog>
        </Drawer.Content>
      </Drawer.Backdrop>
    </Drawer>
  );
}
