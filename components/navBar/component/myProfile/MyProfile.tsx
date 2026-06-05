"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "next-auth";
import { signOut } from "next-auth/react";
import { Drawer, Button, useOverlayState } from "@heroui/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";

import { getAnonymousName } from "@/lib/utils/anonymousName";
import type { NotificationItem } from "@/lib/types/NotificationData";
import NotificationList from "@/components/navBar/component/myProfile/notificationList/NotificationList";
import DefaultImg from "@/assets/login/DefaultImg.png";

const NOTIFICATION_POLL_INTERVAL_MS = 15_000;

export default function MyProfile({ session }: { session: Session }) {
  const router = useRouter();
  const drawerState = useOverlayState();
  const anonymousName = getAnonymousName(session.user?.id || "");
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const fetchNotifications = useCallback(
    async (options?: { silent?: boolean }) => {
      if (!options?.silent) {
        setIsLoading(true);
      }

      try {
        const res = await fetch("/api/notifications");
        if (!res.ok) return;

        const data = (await res.json()) as {
          notifications: NotificationItem[];
          unreadCount: number;
        };
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      } finally {
        if (!options?.silent) {
          setIsLoading(false);
        }
      }
    },
    [],
  );

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    if (drawerState.isOpen) {
      fetchNotifications();
    }
  }, [drawerState.isOpen, fetchNotifications]);

  useEffect(() => {
    const poll = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications({ silent: true });
      }
    };

    const intervalId = window.setInterval(poll, NOTIFICATION_POLL_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchNotifications({ silent: true });
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchNotifications]);

  const handleMarkAllRead = async () => {
    const res = await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ markAll: true }),
    });

    if (!res.ok) return;

    const data = (await res.json()) as { unreadCount: number };
    setUnreadCount(data.unreadCount);
    setNotifications((prev) =>
      prev.map((notification) => ({
        ...notification,
        readAt: notification.readAt ?? new Date().toISOString(),
      })),
    );
  };

  const handleSignOut = () => {
    drawerState.close();
    void signOut({ callbackUrl: "/board" });
  };

  const handleNotificationClick = async (notification: NotificationItem) => {
    if (!notification.readAt) {
      const res = await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: [notification.id] }),
      });

      if (res.ok) {
        const data = (await res.json()) as { unreadCount: number };
        setUnreadCount(data.unreadCount);
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === notification.id
              ? { ...item, readAt: new Date().toISOString() }
              : item,
          ),
        );
      }
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
                    >
                      모두 읽음
                    </Button>
                  </div>
                )}

                {isLoading && notifications.length === 0 ? (
                  <div className="flex flex-1 items-center justify-center">
                    <p className="text-sm text-center text-[#8C8478]">
                      알림을 불러오는 중...
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
