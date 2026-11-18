import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  BOARD_POST_CONTENT_MAX,
  BOARD_POST_IMAGES_MAX,
  BOARD_POST_TAGS_MAX,
  BOARD_POST_TITLE_MAX,
  normalizeBoardPostBody,
  validateBoardPostBody,
} from "@/lib/validation/boardPost";
import type { CreateBoardPostRequest } from "@/lib/types/BoardData";

const image = "https://res.cloudinary.com/mycloud/image/upload/v1/a.png";

const valid: CreateBoardPostRequest = {
  category: "free",
  title: "제목",
  content: "내용",
  tags: ["태그"],
  images: [image],
};

beforeEach(() => {
  vi.stubEnv("CLOUDINARY_CLOUD_NAME", "mycloud");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("validateBoardPostBody", () => {
  it("올바른 본문은 통과한다", () => {
    expect(validateBoardPostBody(valid)).toBeNull();
  });

  it("유효하지 않은 카테고리는 거부한다", () => {
    expect(validateBoardPostBody({ ...valid, category: "nope" })).toBe(
      "유효하지 않은 카테고리입니다.",
    );
  });

  it("공지 카테고리는 allowNotice일 때만 허용한다", () => {
    const notice = { ...valid, category: "notice" };

    expect(validateBoardPostBody(notice)).not.toBeNull();
    expect(validateBoardPostBody(notice, { allowNotice: true })).toBeNull();
  });

  it("제목은 비어 있거나 너무 길면 거부한다", () => {
    expect(validateBoardPostBody({ ...valid, title: "   " })).toBe(
      "제목을 입력해주세요.",
    );
    expect(
      validateBoardPostBody({
        ...valid,
        title: "가".repeat(BOARD_POST_TITLE_MAX + 1),
      }),
    ).not.toBeNull();
  });

  it("내용은 비어 있거나 너무 길면 거부한다", () => {
    expect(validateBoardPostBody({ ...valid, content: "" })).toBe(
      "내용을 입력해주세요.",
    );
    expect(
      validateBoardPostBody({
        ...valid,
        content: "가".repeat(BOARD_POST_CONTENT_MAX + 1),
      }),
    ).not.toBeNull();
  });

  it("태그는 개수·빈 값을 검사한다", () => {
    expect(
      validateBoardPostBody({
        ...valid,
        tags: Array.from({ length: BOARD_POST_TAGS_MAX + 1 }, (_, i) => `t${i}`),
      }),
    ).not.toBeNull();
    expect(validateBoardPostBody({ ...valid, tags: ["  "] })).toBe(
      "빈 태그는 등록할 수 없습니다.",
    );
  });

  it("이미지는 개수 제한과 Cloudinary URL만 허용한다", () => {
    expect(
      validateBoardPostBody({
        ...valid,
        images: Array.from({ length: BOARD_POST_IMAGES_MAX + 1 }, () => image),
      }),
    ).not.toBeNull();
    expect(
      validateBoardPostBody({ ...valid, images: ["https://evil.example.com/a.png"] }),
    ).toBe("유효하지 않은 이미지 URL입니다.");
  });
});

describe("normalizeBoardPostBody", () => {
  it("공백을 제거하고 태그 앞의 #을 뗀다", () => {
    const result = normalizeBoardPostBody({
      ...valid,
      title: "  제목  ",
      content: " 내용 ",
      tags: [" #태그 "],
    });

    expect(result.title).toBe("제목");
    expect(result.content).toBe("내용");
    expect(result.tags).toEqual(["태그"]);
  });

  it("tags·images가 없으면 빈 배열로 채운다", () => {
    // 타입상 tags는 필수지만, 런타임 입력은 비어 있을 수 있어 기본값을 검증한다.
    const result = normalizeBoardPostBody({
      category: "free",
      title: "t",
      content: "c",
    } as CreateBoardPostRequest);

    expect(result.tags).toEqual([]);
    expect(result.images).toEqual([]);
  });
});
