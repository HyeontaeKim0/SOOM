export type NotificationType = "POST_COMMENT" | "COMMENT_REPLY";

export type NotificationItem = {
  id: string;
  type: NotificationType;
  postId: string;
  commentId: string;
  postTitle: string;
  commentPreview: string;
  actorName: string;
  readAt: string | null;
  createdAt: string;
};
