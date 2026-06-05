"use client";

import { MessageCircle, Reply } from "lucide-react";

import { getAnonymousName } from "@/lib/utils/anonymousName";
import type { NotificationItem } from "@/lib/types/NotificationData";
import formatRelativeTime from "@/lib/utils/FormatRelativeTime";

type NotificationListProps = {
  notifications: NotificationItem[];
  onNotificationClick: (notification: NotificationItem) => void;
};

function NotificationListItem({
  notification,
  onClick,
}: {
  notification: NotificationItem;
  onClick: () => void;
}) {
  const isUnread = !notification.readAt;
  const isReply = notification.type === "COMMENT_REPLY";
  const actorName = getAnonymousName(notification.actorId);
  const Icon = isReply ? Reply : MessageCircle;

  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className={`group relative w-full text-left rounded-xl border px-3.5 py-3 transition-colors hover:bg-[#F5F0EB] ${
          isUnread
            ? "border-[#E8D5C4] bg-[#FFF8F2] shadow-sm"
            : "border-[#F0EBE4] bg-white"
        }`}
      >
        {isUnread && (
          <span
            aria-hidden
            className="absolute left-0 top-3 bottom-3 w-0.5 rounded-full bg-[#C4956A]"
          />
        )}

        <div className="flex gap-3">
          <div
            className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
              isUnread
                ? "bg-[#F5EBE0] text-[#8B5E3C]"
                : "bg-[#F5F0EB] text-[#8C8478]"
            }`}
          >
            <Icon className="h-3.5 w-3.5" strokeWidth={2.25} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="mt-1.5 text-xs leading-relaxed text-[#6B6358]">
                  {/* <span className="font-semibold text-[#2A241D]">{actorName}</span> */}
                  {isReply
                    ? "내 댓글에 답글을 남겼어요"
                    : "내 게시글에 댓글을 남겼어요"}
                </p>
              </div>

              {isUnread && (
                <span
                  aria-label="읽지 않음"
                  className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C4956A]"
                />
              )}
            </div>

            <p className="mt-2 text-xs font-semibold text-[#2A241D] line-clamp-1">
              {notification.postTitle}
            </p>

            {notification.commentPreview && (
              <p className="mt-1.5 border-l-2 border-[#E8DDD0] pl-2 text-[11px] leading-relaxed text-[#8C8478] line-clamp-2">
                {notification.commentPreview}
              </p>
            )}

            <p className="mt-2 text-[10px] text-[#B0A89C]">
              {formatRelativeTime(notification.createdAt)}
            </p>
          </div>
        </div>
      </button>
    </li>
  );
}

export default function NotificationList({
  notifications,
  onNotificationClick,
}: NotificationListProps) {
  return (
    <ul className="flex max-h-[720px] flex-col gap-2 overflow-y-auto pr-0.5">
      {notifications.map((notification) => (
        <NotificationListItem
          key={notification.id}
          notification={notification}
          onClick={() => onNotificationClick(notification)}
        />
      ))}
    </ul>
  );
}
