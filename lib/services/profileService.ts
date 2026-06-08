import { prisma } from "@/lib/prisma";

const authorSelect = { id: true, name: true, image: true, role: true } as const;

export async function getUserBoardPosts(authorId: string) {
  return prisma.boardPost.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: authorSelect },
      _count: { select: { comments: true } },
    },
  });
}

export async function getUserBoardComments(authorId: string) {
  return prisma.boardComment.findMany({
    where: { authorId },
    orderBy: { createdAt: "desc" },
    include: {
      post: { select: { id: true, title: true } },
    },
  });
}

export async function getUserLikedPosts(userId: string) {
  const likes = await prisma.boardPostLike.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      post: {
        include: {
          author: { select: authorSelect },
          _count: { select: { comments: true } },
        },
      },
    },
  });

  return likes.map((like) => like.post);
}
