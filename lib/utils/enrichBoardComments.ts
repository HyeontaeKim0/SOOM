import type { BoardComment } from "@/lib/types/BoardData";

export type BoardCommentInput = {
  id: string;
  content: string;
  createdAt: Date | string;
  parentId: string | null;
  depth: number;
  commentLikeCount?: number;
  author: BoardComment["author"];
  replies?: BoardCommentInput[];
};

export function enrichBoardCommentsWithLikes(
  comments: BoardCommentInput[],
  likedIds: Set<string>,
): BoardComment[] {
  return comments.map((comment) => ({
    ...comment,
    commentLikeCount: comment.commentLikeCount ?? 0,
    isLiked: likedIds.has(comment.id),
    replies: enrichBoardCommentsWithLikes(comment.replies ?? [], likedIds),
  }));
}
