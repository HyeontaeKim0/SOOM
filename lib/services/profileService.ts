import { prisma } from "@/lib/prisma";

// 익명 게시판이므로 실명(name)·프로필 사진(image) 등 개인 식별 정보는 조회하지 않는다.
const authorSelect = { id: true, role: true } as const;

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
