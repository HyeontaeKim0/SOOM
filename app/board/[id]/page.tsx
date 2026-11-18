import {
  getBoardPostById,
  getLikedCommentIdsForPost,
  isBoardPostLikedByUser,
} from "@/lib/services/boardService";
import {
  presentBoardComments,
  presentBoardPost,
  type RawBoardComment,
} from "@/lib/utils/boardPresenter";
import { auth } from "@/auth";
import BoardDetailClient from "@/components/board/boardDetail/BoardDetailClient";
import CommentSection from "@/components/board/boardDetail/CommentSection";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getBoardPostById(id);

  if (!post) {
    return { title: "게시글" };
  }

  const description = post.content.replace(/\s+/g, " ").trim().slice(0, 150);

  return {
    title: post.title,
    description,
    alternates: {
      canonical: `/board/${id}`,
    },
    openGraph: {
      title: post.title,
      description,
      type: "article",
    },
  };
}

export default async function BoardDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, session] = await Promise.all([getBoardPostById(id), auth()]);

  if (!post) notFound();

  const currentUserId = session?.user?.id;
  const [isLiked, likedCommentIds] = currentUserId
    ? await Promise.all([
        isBoardPostLikedByUser(id, currentUserId),
        getLikedCommentIdsForPost(id, currentUserId),
      ])
    : [false, new Set<string>()];

  // 브라우저로 내려가기 전에 작성자 식별 값(id, authorId)을 제거하고 표시용 값만 계산한다.
  const { comments: rawComments, ...rawPost } = post;
  const comments = presentBoardComments(rawComments as RawBoardComment[], {
    viewerId: currentUserId,
    postAuthorId: post.authorId,
    likedIds: likedCommentIds,
  });
  const publicPost = presentBoardPost(rawPost, currentUserId);

  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans w-full">
      <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-5 md:px-8 md:py-10 gap-4 md:gap-6">
        {/* 뒤로가기 */}
        <Link
          href="/board"
          className="flex items-center gap-1.5 text-sm text-[#8C8478] hover:text-[#2A241D] transition-colors w-fit"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          게시판으로 돌아가기
        </Link>

        {/* 게시글 본문 (인라인 수정 포함) */}
        <BoardDetailClient
          post={{ ...publicPost, comments }}
          currentUserId={currentUserId}
          isLiked={isLiked}
        />

        {/* 댓글 섹션 */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5 md:px-8 md:py-6">
          <CommentSection
            postId={post.id}
            comments={comments}
            currentUserId={currentUserId}
          />
        </div>
      </div>
    </div>
  );
}
