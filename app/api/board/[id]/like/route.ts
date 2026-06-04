import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getBoardPostById,
  toggleBoardPostLike,
} from "@/lib/services/boardService";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  try {
    const post = await getBoardPostById(id);

    if (!post) {
      return NextResponse.json(
        { error: "게시글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    const result = await toggleBoardPostLike(id, session.user.id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "좋아요 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}
