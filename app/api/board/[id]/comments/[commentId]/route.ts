import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { deleteBoardComment } from "@/lib/services/boardService";

// DELETE /api/board/[id]/comments/[commentId]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string; commentId: string }> },
) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { commentId } = await params;

  try {
    const comment = await prisma.boardComment.findUnique({
      where: { id: commentId },
      select: { authorId: true },
    });

    if (!comment) {
      return NextResponse.json(
        { error: "댓글을 찾을 수 없습니다." },
        { status: 404 },
      );
    }

    if (comment.authorId !== session.user.id) {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 },
      );
    }

    await deleteBoardComment(commentId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "댓글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
