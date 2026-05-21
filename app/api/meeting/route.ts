import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createMeeting } from "@/lib/services/meetingService";
import type { CreateMeetingRequest } from "@/lib/types/MeetingData";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as CreateMeetingRequest;

    if (!body.title || !body.category || !body.date || !body.time) {
      return NextResponse.json(
        { error: "필수 항목을 입력해주세요. (제목, 카테고리, 날짜, 시간)" },
        { status: 400 },
      );
    }

    const meeting = await createMeeting(body, session.user.id);

    return NextResponse.json(meeting, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "모임 생성에 실패했습니다." },
      { status: 500 },
    );
  }
}
