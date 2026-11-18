import { describe, expect, it } from "vitest";
import {
  presentBoardComments,
  presentBoardPost,
  presentBoardPosts,
  type RawBoardComment,
} from "@/lib/utils/boardPresenter";

const AUTHOR_ID = "cmauthor0000000000000000";
const OTHER_ID = "cmother00000000000000000";

const rawPost = {
  id: "post1",
  title: "제목",
  content: "내용",
  authorId: AUTHOR_ID,
  author: { id: AUTHOR_ID, role: "USER" as const },
  todayViewCount: 7,
};

describe("presentBoardPost", () => {
  it("authorId와 author.id를 응답에서 제거한다 (익명성 회귀 방지)", () => {
    const result = presentBoardPost(rawPost, OTHER_ID);

    expect(result).not.toHaveProperty("authorId");
    expect(result.author).not.toHaveProperty("id");
    expect(JSON.stringify(result)).not.toContain(AUTHOR_ID);
  });

  it("표시 이름과 역할만 작성자 정보로 내려준다", () => {
    const result = presentBoardPost(rawPost);

    expect(Object.keys(result.author).sort()).toEqual(["displayName", "role"]);
    expect(result.author.displayName).toMatch(/^지나가는 숨숨 \d{4}$/);
    expect(result.author.role).toBe("USER");
  });

  it("관리자는 '관리자'로 표시한다", () => {
    const result = presentBoardPost({
      ...rawPost,
      author: { id: AUTHOR_ID, role: "ADMIN" as const },
    });

    expect(result.author.displayName).toBe("관리자");
  });

  it("본인 글이면 isMine이 true, 타인·비로그인이면 false다", () => {
    expect(presentBoardPost(rawPost, AUTHOR_ID).isMine).toBe(true);
    expect(presentBoardPost(rawPost, OTHER_ID).isMine).toBe(false);
    expect(presentBoardPost(rawPost, undefined).isMine).toBe(false);
  });

  it("다른 필드는 그대로 유지한다", () => {
    const result = presentBoardPost(rawPost);

    expect(result.title).toBe("제목");
    expect(result.todayViewCount).toBe(7);
  });

  it("같은 작성자는 항상 같은 표시 이름을 갖는다", () => {
    const [a, b] = presentBoardPosts([rawPost, { ...rawPost, id: "post2" }]);

    expect(a.author.displayName).toBe(b.author.displayName);
  });
});

function comment(
  id: string,
  authorId: string,
  replies?: RawBoardComment["replies"],
): RawBoardComment {
  return {
    id,
    content: `내용-${id}`,
    createdAt: "2026-01-01T00:00:00.000Z",
    parentId: null,
    depth: 0,
    authorId,
    author: { id: authorId, role: "USER" },
    replies,
  };
}

describe("presentBoardComments", () => {
  const context = {
    viewerId: OTHER_ID,
    postAuthorId: AUTHOR_ID,
    likedIds: new Set(["c2"]),
  };

  it("댓글 트리 어디에도 작성자 id가 남지 않는다 (익명성 회귀 방지)", () => {
    const tree = [
      comment("c1", AUTHOR_ID, [comment("c2", OTHER_ID, [comment("c3", AUTHOR_ID)])]),
    ];

    const json = JSON.stringify(presentBoardComments(tree, context));

    expect(json).not.toContain(AUTHOR_ID);
    expect(json).not.toContain(OTHER_ID);
    expect(json).not.toContain("authorId");
  });

  it("isMine, isPostAuthor, isLiked를 서버에서 계산한다", () => {
    const [top] = presentBoardComments(
      [comment("c1", AUTHOR_ID, [comment("c2", OTHER_ID)])],
      context,
    );
    const reply = top.replies[0];

    expect(top.isPostAuthor).toBe(true);
    expect(top.isMine).toBe(false);
    expect(top.isLiked).toBe(false);
    expect(reply.isPostAuthor).toBe(false);
    expect(reply.isMine).toBe(true);
    expect(reply.isLiked).toBe(true);
  });

  it("필요한 필드만 골라 담는다 (원본에 다른 컬럼이 있어도 새지 않음)", () => {
    const withExtra = {
      ...comment("c1", AUTHOR_ID),
      postId: "post1",
      secret: "노출되면 안 됨",
    } as RawBoardComment;

    const [result] = presentBoardComments([withExtra], context);

    expect(Object.keys(result).sort()).toEqual(
      [
        "author",
        "commentLikeCount",
        "content",
        "createdAt",
        "depth",
        "id",
        "isLiked",
        "isMine",
        "isPostAuthor",
        "parentId",
        "replies",
      ].sort(),
    );
  });

  it("commentLikeCount가 없으면 0으로 채운다", () => {
    const [result] = presentBoardComments([comment("c1", AUTHOR_ID)], context);

    expect(result.commentLikeCount).toBe(0);
  });

  it("작성자 정보가 없는 { id } 항목(조회 깊이 제한)은 건너뛴다", () => {
    const [result] = presentBoardComments(
      [comment("c1", AUTHOR_ID, [{ id: "deep" }])],
      context,
    );

    expect(result.replies).toEqual([]);
  });

  it("비로그인이면 isMine은 모두 false다", () => {
    const [result] = presentBoardComments([comment("c1", AUTHOR_ID)], {
      ...context,
      viewerId: undefined,
    });

    expect(result.isMine).toBe(false);
  });
});
