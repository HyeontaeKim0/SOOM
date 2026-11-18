import type { Role } from "@prisma/client";
import { getDisplayName } from "@/lib/utils/anonymousName";
import type { BoardComment, PublicAuthor } from "@/lib/types/BoardData";

/**
 * DB 조회 결과를 브라우저로 내려보내기 전에 거치는 변환 계층.
 * 익명 게시판이므로 작성자의 id / authorId 등 계정 식별 값은 응답에서 제거하고,
 * 화면에 필요한 값(표시 이름, 내 글 여부, 글쓴이 여부)만 서버에서 계산해 내려준다.
 * 서버 전용 모듈이다(클라이언트 컴포넌트에서 import 하지 않는다).
 */

type RawAuthor = { id: string; role: Role };

export function toPublicAuthor(author: RawAuthor): PublicAuthor {
  return {
    displayName: getDisplayName({ userId: author.id, role: author.role }),
    role: author.role,
  };
}

/** 게시글 한 건 변환: authorId·author.id 제거, displayName / isMine 추가 */
export function presentBoardPost<
  T extends { authorId: string; author: RawAuthor },
>(post: T, viewerId?: string) {
  // authorId는 응답에 포함되지 않도록 분리해서 버린다.
  const { authorId, author, ...rest } = post;
  return {
    ...rest,
    author: toPublicAuthor(author),
    isMine: viewerId !== undefined && viewerId === authorId,
  };
}

export function presentBoardPosts<
  T extends { authorId: string; author: RawAuthor },
>(posts: T[], viewerId?: string) {
  return posts.map((post) => presentBoardPost(post, viewerId));
}

export type RawBoardComment = {
  id: string;
  content: string;
  createdAt: Date | string;
  parentId: string | null;
  depth: number;
  commentLikeCount?: number;
  authorId: string;
  author: RawAuthor;
  // 가장 깊은 단계는 { id }만 조회되므로 작성자 정보가 없는 항목이 섞일 수 있다.
  replies?: Array<RawBoardComment | { id: string }>;
};

function isFullComment(
  comment: RawBoardComment | { id: string },
): comment is RawBoardComment {
  return "author" in comment;
}

/**
 * 댓글 트리 변환. 필요한 필드만 골라 담는 방식(화이트리스트)이라
 * 새 컬럼이 추가되어도 실수로 응답에 노출되지 않는다.
 */
export function presentBoardComments(
  comments: Array<RawBoardComment | { id: string }>,
  context: {
    viewerId?: string;
    postAuthorId: string;
    likedIds: Set<string>;
  },
): BoardComment[] {
  return comments.filter(isFullComment).map((comment) => ({
    id: comment.id,
    content: comment.content,
    createdAt: comment.createdAt,
    parentId: comment.parentId,
    depth: comment.depth,
    commentLikeCount: comment.commentLikeCount ?? 0,
    isLiked: context.likedIds.has(comment.id),
    author: toPublicAuthor(comment.author),
    isMine:
      context.viewerId !== undefined && context.viewerId === comment.authorId,
    isPostAuthor: comment.authorId === context.postAuthorId,
    replies: presentBoardComments(comment.replies ?? [], context),
  }));
}
