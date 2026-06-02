import { NextResponse } from "next/server";
import { auth } from "@/auth";
import {
  getBoardPostById,
  updateBoardPost,
  deleteBoardPost,
} from "@/lib/services/boardService";
import type { CreateBoardPostRequest } from "@/lib/types/BoardData";

// PATCH /api/board/[id]
export async function PATCH(
  request: Request,
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

    if (post.author.id !== session.user.id) {
      return NextResponse.json(
        { error: "수정 권한이 없습니다." },
        { status: 403 },
      );
    }

    const body = (await request.json()) as CreateBoardPostRequest;

    if (!body.category || !body.title?.trim() || !body.content?.trim()) {
      return NextResponse.json(
        { error: "카테고리, 제목, 내용은 필수입니다." },
        { status: 400 },
      );
    }

    const updated = await updateBoardPost(id, body);
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "게시글 수정에 실패했습니다." },
      { status: 500 },
    );
  }
}

// DELETE /api/board/[id]
export async function DELETE(
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

    if (post.author.id !== session.user.id) {
      return NextResponse.json(
        { error: "삭제 권한이 없습니다." },
        { status: 403 },
      );
    }

    await deleteBoardPost(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "게시글 삭제에 실패했습니다." },
      { status: 500 },
    );
  }
}
