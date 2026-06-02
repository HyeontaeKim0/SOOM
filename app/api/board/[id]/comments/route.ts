import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { createBoardComment } from "@/lib/services/boardService";

// POST /api/board/[id]/comments
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id: postId } = await params;

  try {
    const body = (await request.json()) as {
      content: string;
      parentId?: string;
    };

    if (!body.content?.trim()) {
      return NextResponse.json(
        { error: "댓글 내용을 입력해주세요." },
        { status: 400 },
      );
    }

    if (body.content.length > 500) {
      return NextResponse.json(
        { error: "댓글은 500자 이내로 입력해주세요." },
        { status: 400 },
      );
    }

    const comment = await createBoardComment({
      postId,
      authorId: session.user.id,
      content: body.content.trim(),
      parentId: body.parentId,
    });

    return NextResponse.json(comment, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "댓글 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
