import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  createBoardComment,
  getBoardPostAuthorId,
} from "@/lib/services/boardService";
import { presentBoardComments } from "@/lib/utils/boardPresenter";
import { createCommentNotifications } from "@/lib/services/notificationService";

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

    try {
      await createCommentNotifications({
        postId,
        commentId: comment.id,
        authorId: session.user.id,
        parentId: body.parentId,
      });
    } catch (notificationError) {
      console.error("댓글 알림 생성 실패:", notificationError);
    }

    const postAuthorId = await getBoardPostAuthorId(postId);
    const [presented] = presentBoardComments([comment], {
      viewerId: session.user.id,
      postAuthorId: postAuthorId ?? "",
      likedIds: new Set<string>(),
    });

    return NextResponse.json(presented, { status: 201 });
  } catch (error) {
    console.error("댓글 작성 실패:", error);
    return NextResponse.json(
      { error: "댓글 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
