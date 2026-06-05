import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getNotificationsForUser,
  getUnreadNotificationCount,
  markNotificationsAsRead,
} from "@/lib/services/notificationService";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const [notifications, unreadCount] = await Promise.all([
      getNotificationsForUser(session.user.id),
      getUnreadNotificationCount(session.user.id),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error) {
    console.error("알림 조회 실패:", error);
    return NextResponse.json(
      { error: "알림을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      ids?: string[];
      markAll?: boolean;
    };

    const result = await markNotificationsAsRead(session.user.id, {
      ids: body.ids,
      markAll: body.markAll,
    });

    const unreadCount = await getUnreadNotificationCount(session.user.id);

    return NextResponse.json({ ...result, unreadCount });
  } catch (error) {
    console.error("알림 읽음 처리 실패:", error);
    return NextResponse.json(
      { error: "알림 읽음 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}
