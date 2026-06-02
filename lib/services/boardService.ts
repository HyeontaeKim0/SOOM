import { prisma } from "@/lib/prisma";
import type { CreateBoardPostRequest } from "@/lib/types/BoardData";

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

export async function incrementViewCount(id: string) {
  return prisma.boardPost.update({
    where: { id },
    data: { viewCount: { increment: 1 } },
    select: { id: true },
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
