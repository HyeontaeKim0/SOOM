import { prisma } from "@/lib/prisma";

export async function getAdminOverview() {
  const now = new Date();
  const todayKST = new Date(
    now.toLocaleDateString("en-CA", { timeZone: "Asia/Seoul" })
  );
  const weekAgo = new Date(todayKST);
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    totalPosts,
    postsToday,
    totalComments,
    totalMeetings,
    todayViews,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { emailVerified: { gte: todayKST } },
    }),
    prisma.user.count({
      where: { emailVerified: { gte: weekAgo } },
    }),
    prisma.boardPost.count(),
    prisma.boardPost.count({
      where: { createdAt: { gte: todayKST } },
    }),
    prisma.boardComment.count(),
    prisma.meeting.count(),
    prisma.boardPostView.count({
      where: { viewedOn: { gte: todayKST } },
    }),
  ]);

  return {
    totalUsers,
    newUsersToday,
    newUsersThisWeek,
    totalPosts,
    postsToday,
    totalComments,
    totalMeetings,
    todayViews,
  };
}

export async function getAdminUsers({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { emailVerified: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        nickname: true,
        image: true,
        role: true,
        emailVerified: true,
        _count: {
          select: {
            boardPosts: true,
            boardComments: true,
            meetings: true,
          },
        },
      },
    }),
    prisma.user.count(),
  ]);

  return { users, total, pages: Math.ceil(total / limit) };
}

export async function getAdminPosts({
  page = 1,
  limit = 20,
  category,
}: {
  page?: number;
  limit?: number;
  category?: string;
}) {
  const where = category ? { category } : {};

  const [posts, total] = await Promise.all([
    prisma.boardPost.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        viewCount: true,
        likeCount: true,
        createdAt: true,
        author: {
          select: { email: true, nickname: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    }),
    prisma.boardPost.count({ where }),
  ]);

  return { posts, total, pages: Math.ceil(total / limit) };
}

export async function getAdminMeetings({
  page = 1,
  limit = 20,
}: {
  page?: number;
  limit?: number;
}) {
  const [meetings, total] = await Promise.all([
    prisma.meeting.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        title: true,
        category: true,
        location: true,
        date: true,
        maxParticipants: true,
        isOnline: true,
        createdAt: true,
        host: {
          select: { email: true, nickname: true },
        },
      },
    }),
    prisma.meeting.count(),
  ]);

  return { meetings, total, pages: Math.ceil(total / limit) };
}
