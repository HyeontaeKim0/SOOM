import { NextResponse } from "next/server";
import { incrementViewCount } from "@/lib/services/boardService";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await incrementViewCount(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "조회수 업데이트에 실패했습니다." },
      { status: 500 },
    );
  }
}
