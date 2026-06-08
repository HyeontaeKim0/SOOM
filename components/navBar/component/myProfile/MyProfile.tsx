"use client";

import { useEffect } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Drawer, Button, useOverlayState } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { getAnonymousName } from "@/lib/utils/anonymousName";
import type { NotificationItem } from "@/lib/types/NotificationData";
import {
  useMarkNotificationsReadMutation,
  useNotificationsQuery,
} from "@/lib/queries/notifications";
import NotificationList from "@/components/navBar/component/myProfile/notificationList/NotificationList";
import DefaultImg from "@/assets/login/DefaultImg.png";

export default function MyProfile({ session }: { session: Session }) {
  const router = useRouter();
  const drawerState = useOverlayState();
  const anonymousName = getAnonymousName(session.user?.id || "");

  const {
    data,
    isPending,
    isError,
    refetch,
  } = useNotificationsQuery();
  const markReadMutation = useMarkNotificationsReadMutation();

  const notifications = data?.notifications ?? [];
  const unreadCount = data?.unreadCount ?? 0;

  useEffect(() => {
    if (drawerState.isOpen) {
      void refetch();
    }
  }, [drawerState.isOpen, refetch]);

  const handleMarkAllRead = () => {
    markReadMutation.mutate({ markAll: true });
  };

  const handleSignOut = () => {
    drawerState.close();
    void signOut({ callbackUrl: "/board" });
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    try {
      await markReadMutation.mutateAsync({ ids: [notification.id] });
    } catch {
      return;
    }

    drawerState.close();
    router.push(
      `/board/${notification.postId}#comment-${notification.commentId}`,
    );
  };

  return (
    <Drawer state={drawerState}>
      <Button
        aria-label="프로필 메뉴"
        variant="secondary"
        className="flex flex-col items-center bg-transparent px-2 h-auto min-h-0 py-1 gap-0.5"
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
        {unreadCount > 0 && (
          <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-red-500" />
        )}
      </Button>

      <Drawer.Backdrop>
        <Drawer.Content placement="right">
          <Drawer.Dialog className="flex flex-col h-full">
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

            <Drawer.Body className="flex flex-1 flex-col px-0 min-h-0">
              <div className="px-4 flex flex-1 flex-col min-h-0 mt-6">
                {unreadCount > 0 && notifications.length > 0 && (
                  <div className="flex justify-end mb-3 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="text-xs font-semibold text-[#6B6358] bg-[#F5F0EB]"
                      onPress={handleMarkAllRead}
                      isDisabled={markReadMutation.isPending}
                    >
                      모두 읽음
                    </Button>
                  </div>
                )}

                {isPending && notifications.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-center text-[#8C8478]">
                      알림을 불러오는 중...
                    </p>
                  </div>
                ) : isError ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-[#8C8478]">
                    <p className="text-sm font-semibold">
                      알림을 불러오지 못했어요
                    </p>
                  </div>
                ) : notifications.length === 0 ? (
                  <div className="flex flex-1 flex-col items-center justify-center text-[#8C8478]">
                    <Bell className="w-8 h-8 mb-2 opacity-40" />
                    <p className="text-sm font-semibold">새 알림이 없어요</p>
                  </div>
                ) : (
                  <NotificationList
                    notifications={notifications}
                    onNotificationClick={handleNotificationClick}
                  />
                )}
              </div>
            </Drawer.Body>

            <Drawer.Footer>
              <div className="px-4">
                <Button
                  slot="close"
                  variant="secondary"
                  className="w-full justify-start px-4 py-3 rounded-xl text-sm font-semibold text-[#2A241D] bg-[#F5F0EB] hover:bg-[#EDE8E0]"
                  onPress={() => router.push("/profile")}
                >
                  마이페이지
                </Button>
              </div>
              <Button
                className="flex-1 bg-[#2A241D] text-white"
                onPress={handleSignOut}
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
