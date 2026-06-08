import { getPrisma } from "@/lib/prisma";
import type {
  NotificationItem,
  NotificationType,
} from "@/lib/types/NotificationData";

const notificationInclude = {
  comment: {
    select: {
      content: true,
      post: { select: { title: true } },
    },
  },
} as const;

function toNotificationItem(
  notification: {
    id: string;
    type: string;
    postId: string;
    commentId: string;
    actorId: string;
    readAt: Date | null;
    createdAt: Date;
    comment: { content: string; post: { title: string } };
  },
): NotificationItem {
  return {
    id: notification.id,
    type: notification.type as NotificationType,
    postId: notification.postId,
    commentId: notification.commentId,
    postTitle: notification.comment.post.title,
    commentPreview: notification.comment.content,
    actorId: notification.actorId,
    readAt: notification.readAt?.toISOString() ?? null,
    createdAt: notification.createdAt.toISOString(),
  };
}

export async function createCommentNotifications({
  postId,
  commentId,
  authorId,
  parentId,
}: {
  postId: string;
  commentId: string;
  authorId: string;
  parentId?: string | null;
}) {
  const recipients: { userId: string; type: NotificationType }[] = [];

  if (parentId) {
    const parent = await getPrisma().boardComment.findUnique({
      where: { id: parentId },
      select: { authorId: true },
    });

    if (parent && parent.authorId !== authorId) {
      recipients.push({
        userId: parent.authorId,
        type: "COMMENT_REPLY",
      });
    }
  } else {
    const post = await getPrisma().boardPost.findUnique({
      where: { id: postId },
      select: { authorId: true },
    });

    if (post && post.authorId !== authorId) {
      recipients.push({
        userId: post.authorId,
        type: "POST_COMMENT",
      });
    }
  }

  if (recipients.length === 0) {
    return;
  }

  await getPrisma().notification.createMany({
    data: recipients.map((recipient) => ({
      userId: recipient.userId,
      type: recipient.type,
      postId,
      commentId,
      actorId: authorId,
    })),
  });
}

export async function getNotificationsForUser(
  userId: string,
  limit = 30,
): Promise<NotificationItem[]> {
  const notifications = await getPrisma().notification.findMany({
    where: { userId, readAt: null },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: notificationInclude,
  });

  return notifications.map(toNotificationItem);
}

export async function getUnreadNotificationCount(
  userId: string,
): Promise<number> {
  return getPrisma().notification.count({
    where: { userId, readAt: null },
  });
}

export async function markNotificationsAsRead(
  userId: string,
  options: { ids?: string[]; markAll?: boolean },
) {
  const where = {
    userId,
    readAt: null,
    ...(options.markAll ? {} : { id: { in: options.ids ?? [] } }),
  };

  if (!options.markAll && (!options.ids || options.ids.length === 0)) {
    return { updated: 0 };
  }

  const result = await getPrisma().notification.updateMany({
    where,
    data: { readAt: new Date() },
  });

  return { updated: result.count };
}
