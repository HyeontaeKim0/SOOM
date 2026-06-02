import { prisma } from "@/lib/prisma";

const authorSelect = { id: true, name: true, image: true } as const;

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
