import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { NotificationItem } from "@/lib/types/NotificationData";

export const NOTIFICATION_POLL_INTERVAL_MS = 15_000;

export const notificationKeys = {
  all: ["notifications"] as const,
};

export type NotificationsResponse = {
  notifications: NotificationItem[];
  unreadCount: number;
};

type MarkNotificationsReadInput = {
  ids?: string[];
  markAll?: boolean;
};

type MarkNotificationsReadResponse = {
  updated: number;
  unreadCount: number;
};

export async function fetchNotifications(): Promise<NotificationsResponse> {
  const res = await fetch("/api/notifications", { cache: "no-store" });

  if (!res.ok) {
    throw new Error("알림을 불러오지 못했습니다.");
  }

  return res.json() as Promise<NotificationsResponse>;
}

async function markNotificationsAsRead(
  body: MarkNotificationsReadInput,
): Promise<MarkNotificationsReadResponse> {
  const res = await fetch("/api/notifications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("알림 읽음 처리에 실패했습니다.");
  }

  return res.json() as Promise<MarkNotificationsReadResponse>;
}

function applyOptimisticRead(
  previous: NotificationsResponse,
  variables: MarkNotificationsReadInput,
): NotificationsResponse {
  if (variables.markAll) {
    return { notifications: [], unreadCount: 0 };
  }

  const ids = new Set(variables.ids ?? []);
  const notifications = previous.notifications.filter(
    (notification) => !ids.has(notification.id),
  );

  const removedCount = previous.notifications.length - notifications.length;

  return {
    notifications,
    unreadCount: Math.max(0, previous.unreadCount - removedCount),
  };
}

export function useNotificationsQuery() {
  return useQuery({
    queryKey: notificationKeys.all,
    queryFn: fetchNotifications,
    refetchInterval: NOTIFICATION_POLL_INTERVAL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationsReadMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markNotificationsAsRead,
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: notificationKeys.all });

      const previous = queryClient.getQueryData<NotificationsResponse>(
        notificationKeys.all,
      );

      if (previous) {
        queryClient.setQueryData(
          notificationKeys.all,
          applyOptimisticRead(previous, variables),
        );
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(notificationKeys.all, context.previous);
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData<NotificationsResponse | undefined>(
        notificationKeys.all,
        (current) =>
          current
            ? { ...current, unreadCount: data.unreadCount }
            : current,
      );
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
