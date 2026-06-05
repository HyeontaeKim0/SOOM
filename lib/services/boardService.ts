import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { CreateBoardPostRequest } from "@/lib/types/BoardData";
import {
  buildAnonymousViewerKey,
  buildUserViewerKey,
} from "@/lib/viewTracking";

export type BoardPostLikeResult = {
  liked: boolean;
  likeCount: number;
};

export type BoardCommentLikeResult = {
  liked: boolean;
  commentLikeCount: number;
};

export async function getBoardPosts(category?: string) {
  return prisma.boardPost.findMany({
    where: category ? { category } : undefined,
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { comments: true } },
    },
  });
}

const authorSelect = { id: true, name: true, image: true } as const;

export type BoardPostViewResult = {
  counted: boolean;
  viewCount: number;
};

export async function recordBoardPostView(
  postId: string,
  options: { userId?: string; anonymousViewerId: string },
): Promise<BoardPostViewResult | null> {
  const post = await prisma.boardPost.findUnique({
    where: { id: postId },
    select: { authorId: true, viewCount: true },
  });

  if (!post) {
    return null;
  }

  if (options.userId && options.userId === post.authorId) {
    return { counted: false, viewCount: post.viewCount };
  }

  const userKey = options.userId
    ? buildUserViewerKey(options.userId)
    : null;
  const anonKey = buildAnonymousViewerKey(options.anonymousViewerId);

  return prisma.$transaction(async (tx) => {
    if (userKey) {
      const existing = await tx.boardPostView.findFirst({
        where: {
          postId,
          viewerKey: { in: [userKey, anonKey] },
        },
        select: { id: true, viewerKey: true },
      });

      if (existing) {
        if (existing.viewerKey === anonKey) {
          await tx.boardPostView.update({
            where: { id: existing.id },
            data: { viewerKey: userKey },
          });
        }
        const current = await tx.boardPost.findUniqueOrThrow({
          where: { id: postId },
          select: { viewCount: true },
        });
        return { counted: false, viewCount: current.viewCount };
      }
    } else {
      const existing = await tx.boardPostView.findUnique({
        where: { postId_viewerKey: { postId, viewerKey: anonKey } },
        select: { id: true },
      });

      if (existing) {
        return { counted: false, viewCount: post.viewCount };
      }
    }

    const viewerKey = userKey ?? anonKey;

    try {
      await tx.boardPostView.create({
        data: { postId, viewerKey },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const current = await tx.boardPost.findUniqueOrThrow({
          where: { id: postId },
          select: { viewCount: true },
        });
        return { counted: false, viewCount: current.viewCount };
      }
      throw error;
    }

    const updated = await tx.boardPost.update({
      where: { id: postId },
      data: { viewCount: { increment: 1 } },
      select: { viewCount: true },
    });

    return { counted: true, viewCount: updated.viewCount };
  });
}

function isUniqueConstraintError(
  error: unknown,
): error is Prisma.PrismaClientKnownRequestError {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

export async function isBoardPostLikedByUser(
  postId: string,
  userId: string,
): Promise<boolean> {
  const like = await prisma.boardPostLike.findUnique({
    where: { postId_userId: { postId, userId } },
    select: { id: true },
  });
  return like !== null;
}

export async function likeBoardPost(
  postId: string,
  userId: string,
): Promise<BoardPostLikeResult> {
  return prisma.$transaction(async (tx) => {
    try {
      await tx.boardPostLike.create({
        data: { postId, userId },
      });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const post = await tx.boardPost.findUniqueOrThrow({
          where: { id: postId },
          select: { likeCount: true },
        });
        return { liked: true, likeCount: post.likeCount };
      }
      throw error;
    }

    const post = await tx.boardPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });

    return { liked: true, likeCount: post.likeCount };
  });
}

export async function unlikeBoardPost(
  postId: string,
  userId: string,
): Promise<BoardPostLikeResult> {
  return prisma.$transaction(async (tx) => {
    const deleted = await tx.boardPostLike.deleteMany({
      where: { postId, userId },
    });

    if (deleted.count === 0) {
      const post = await tx.boardPost.findUniqueOrThrow({
        where: { id: postId },
        select: { likeCount: true },
      });
      return { liked: false, likeCount: post.likeCount };
    }

    const post = await tx.boardPost.update({
      where: { id: postId },
      data: { likeCount: { decrement: 1 } },
      select: { likeCount: true },
    });

    return { liked: false, likeCount: post.likeCount };
  });
}

export async function toggleBoardPostLike(
  postId: string,
  userId: string,
): Promise<BoardPostLikeResult> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.boardPostLike.findUnique({
      where: { postId_userId: { postId, userId } },
      select: { id: true },
    });

    if (existing) {
      await tx.boardPostLike.delete({ where: { id: existing.id } });
      const post = await tx.boardPost.update({
        where: { id: postId },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
      return { liked: false, likeCount: post.likeCount };
    }

    try {
      await tx.boardPostLike.create({ data: { postId, userId } });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const post = await tx.boardPost.findUniqueOrThrow({
          where: { id: postId },
          select: { likeCount: true },
        });
        return { liked: true, likeCount: post.likeCount };
      }
      throw error;
    }

    const post = await tx.boardPost.update({
      where: { id: postId },
      data: { likeCount: { increment: 1 } },
      select: { likeCount: true },
    });

    return { liked: true, likeCount: post.likeCount };
  });
}

export async function getBoardPostById(id: string) {
  return prisma.boardPost.findUnique({
    where: { id },
    include: {
      author: { select: authorSelect },
      comments: {
        where: { parentId: null }, // 최상위 댓글만
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: authorSelect },
          replies: {
            orderBy: { createdAt: "asc" },
            include: {
              author: { select: authorSelect },
              replies: {
                orderBy: { createdAt: "asc" },
                include: {
                  author: { select: authorSelect },
                  replies: { select: { id: true } }, // 더 깊은 depth 차단용 (빈 배열 보장)
                },
              },
            },
          },
        },
      },
    },
  });
}

export async function createBoardPost(
  data: CreateBoardPostRequest,
  authorId: string,
) {
  return prisma.boardPost.create({
    data: {
      category: data.category,
      title: data.title,
      content: data.content,
      tags: data.tags ?? [],
      authorId,
    },
  });
}

export async function updateBoardPost(
  id: string,
  data: CreateBoardPostRequest,
) {
  return prisma.boardPost.update({
    where: { id },
    data: {
      category: data.category,
      title: data.title,
      content: data.content,
      tags: data.tags ?? [],
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });
}

export async function deleteBoardPost(id: string) {
  return prisma.boardPost.delete({ where: { id } });
}

export async function isBoardCommentLikedByUser(
  commentId: string,
  userId: string,
): Promise<boolean> {
  const like = await prisma.boardCommentLike.findUnique({
    where: { commentId_userId: { commentId, userId } },
    select: { id: true },
  });
  return like !== null;
}

export async function getLikedCommentIdsForPost(
  postId: string,
  userId: string,
): Promise<Set<string>> {
  const likes = await prisma.boardCommentLike.findMany({
    where: {
      userId,
      comment: { postId },
    },
    select: { commentId: true },
  });
  return new Set(likes.map((l) => l.commentId));
}

export async function toggleBoardCommentLike(
  commentId: string,
  userId: string,
): Promise<BoardCommentLikeResult> {
  return prisma.$transaction(async (tx) => {
    const existing = await tx.boardCommentLike.findUnique({
      where: { commentId_userId: { commentId, userId } },
      select: { id: true },
    });

    if (existing) {
      await tx.boardCommentLike.delete({ where: { id: existing.id } });
      const comment = await tx.boardComment.update({
        where: { id: commentId },
        data: { commentLikeCount: { decrement: 1 } },
        select: { commentLikeCount: true },
      });
      return { liked: false, commentLikeCount: comment.commentLikeCount };
    }

    try {
      await tx.boardCommentLike.create({ data: { commentId, userId } });
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        const comment = await tx.boardComment.findUniqueOrThrow({
          where: { id: commentId },
          select: { commentLikeCount: true },
        });
        return { liked: true, commentLikeCount: comment.commentLikeCount };
      }
      throw error;
    }

    const comment = await tx.boardComment.update({
      where: { id: commentId },
      data: { commentLikeCount: { increment: 1 } },
      select: { commentLikeCount: true },
    });

    return { liked: true, commentLikeCount: comment.commentLikeCount };
  });
}

export async function createBoardComment({
  postId,
  authorId,
  content,
  parentId,
}: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}) {
  const depth = parentId
    ? await prisma.boardComment
        .findUnique({ where: { id: parentId }, select: { depth: true } })
        .then((p) => (p ? p.depth + 1 : 0))
    : 0;

  return prisma.boardComment.create({
    data: { postId, authorId, content, parentId: parentId ?? null, depth },
    include: {
      author: { select: authorSelect },
      replies: { select: { id: true } },
    },
  });
}

export async function deleteBoardComment(id: string) {
  return prisma.boardComment.delete({ where: { id } });
}
