import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { toggleBoardCommentLike } from "@/lib/services/boardService";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id: postId, commentId } = await params;

  try {
    const comment = await prisma.boardComment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (comment.postId !== postId) {
      return NextResponse.json(
        { error: "댓글이 해당 게시글에 속하지 않습니다." },
        { status: 400 },
      );
    }

    const result = await toggleBoardCommentLike(commentId, session.user.id);
    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { error: "좋아요 처리에 실패했습니다." },
      { status: 500 },
    );
  }
}
