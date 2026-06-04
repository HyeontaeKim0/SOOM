import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { recordBoardPostView } from "@/lib/services/boardService";
import { getOrCreateAnonymousViewerId } from "@/lib/viewTracking";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const [session, anonymousViewerId] = await Promise.all([
      auth(),
      getOrCreateAnonymousViewerId(),
    ]);

    const result = await recordBoardPostView(id, {
      userId: session?.user?.id,
      anonymousViewerId,
    });

    if (!result) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "조회수 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}
