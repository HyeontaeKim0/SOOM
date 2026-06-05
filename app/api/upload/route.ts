import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { uploadBoardImage } from "@/lib/services/cloudinaryService";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "로그인이 필요합니다." },
      { status: 401 },
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "이미지 파일을 선택해주세요." },
        { status: 400 },
      );
    }

    const url = await uploadBoardImage(file, session.user.id);
    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "이미지 업로드에 실패했습니다.";

    const isConfigError = message.includes("environment variables");
    const isValidationError =
      message.includes("업로드할 수 있습니다") ||
      message.includes("5MB");

    return NextResponse.json(
      { error: message },
      {
        status: isConfigError ? 500 : isValidationError ? 400 : 500,
      },
    );
  }
}
