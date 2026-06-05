import { BOARD_CATEGORIES } from "@/lib/utils/BoardCategories";
import type { CreateBoardPostRequest } from "@/lib/types/BoardData";

export const BOARD_POST_TITLE_MAX = 100;
export const BOARD_POST_CONTENT_MAX = 3000;
export const BOARD_POST_TAGS_MAX = 5;
export const BOARD_POST_TAG_MAX = 20;

const USER_WRITABLE_CATEGORIES = BOARD_CATEGORIES.filter(
  (category) => category !== "notice",
);

export function validateBoardPostBody(
  body: CreateBoardPostRequest,
): string | null {
  if (!body.category || !USER_WRITABLE_CATEGORIES.includes(body.category)) {
    return "유효하지 않은 카테고리입니다.";
  }

  const title = body.title?.trim() ?? "";
  if (!title) {
    return "제목을 입력해주세요.";
  }
  if (title.length > BOARD_POST_TITLE_MAX) {
    return `제목은 ${BOARD_POST_TITLE_MAX}자 이내로 입력해주세요.`;
  }

  const content = body.content?.trim() ?? "";
  if (!content) {
    return "내용을 입력해주세요.";
  }
  if (content.length > BOARD_POST_CONTENT_MAX) {
    return `내용은 ${BOARD_POST_CONTENT_MAX}자 이내로 입력해주세요.`;
  }

  const tags = body.tags ?? [];
  if (tags.length > BOARD_POST_TAGS_MAX) {
    return `태그는 최대 ${BOARD_POST_TAGS_MAX}개까지 등록할 수 있습니다.`;
  }

  for (const tag of tags) {
    const trimmed = tag.trim();
    if (!trimmed) {
      return "빈 태그는 등록할 수 없습니다.";
    }
    if (trimmed.length > BOARD_POST_TAG_MAX) {
      return `태그는 ${BOARD_POST_TAG_MAX}자 이내로 입력해주세요.`;
    }
  }

  return null;
}

export function normalizeBoardPostBody(
  body: CreateBoardPostRequest,
): CreateBoardPostRequest {
  return {
    category: body.category,
    title: body.title.trim(),
    content: body.content.trim(),
    tags: (body.tags ?? []).map((tag) => tag.trim().replace(/^#/, "")),
  };
}
