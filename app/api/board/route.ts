import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getBoardPosts, createBoardPost } from "@/lib/services/boardService";
import type { CreateBoardPostRequest } from "@/lib/types/BoardData";
import {
  normalizeBoardPostBody,
  validateBoardPostBody,
} from "@/lib/validation/boardPost";

// GET /api/board?category=free
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") ?? undefined;

  try {
    const posts = await getBoardPosts(category);
    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "게시글 목록을 불러오지 못했습니다." },
      { status: 500 },
    );
  }
}

// POST /api/board
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const body = (await request.json()) as CreateBoardPostRequest;

    const validationError = validateBoardPostBody(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const post = await createBoardPost(
      normalizeBoardPostBody(body),
      session.user.id,
    );
    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "게시글 작성에 실패했습니다." },
      { status: 500 },
    );
  }
}
