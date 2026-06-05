"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getAnonymousName } from "@/lib/utils/anonymousName";
import type { BoardComment } from "@/lib/types/BoardData";
import SSOModal, { useOverlayState } from "@/components/auth/SSOModal";
import DeleteConfirmModal from "@/components/common/DeleteConfirmModal";
import DefaultProfile from "@/assets/login/DefaultImg.png";
import Image from "next/image";
import formatRelativeTime from "@/lib/utils/FormatRelativeTime";

interface CommentSectionProps {
  postId: string;
  comments: BoardComment[];
  currentUserId?: string;
  postAuthorId: string;
}

function ReplyForm({
  postId,
  parentId,
  onSubmit,
  onCancel,
}: {
  postId: string;
  parentId: string;
  onSubmit: (comment: BoardComment) => void;
  onCancel: () => void;
}) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/board/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim(), parentId }),
      });
      if (res.ok) {
        const newComment = (await res.json()) as BoardComment;
        onSubmit(newComment);
        setContent("");
      } else {
        const { error } = await res.json();
        alert(error ?? "답글 작성에 실패했습니다.");
      }
    } catch {
      alert("답글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2 flex flex-col gap-2 bg-[#F5F0EB] rounded-xl border border-[#E0D9D0] p-3">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="답글을 입력해주세요..."
        rows={2}
        maxLength={500}
        autoFocus
        className="w-full bg-transparent text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none resize-none leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <span className="text-xs text-[#C0B8B0]">{content.length}/500</span>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded-lg text-xs font-semibold text-[#6B6358] border border-[#E0D9D0] hover:bg-white transition-colors"
          >
            취소
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim() || isSubmitting}
            className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#2A241D] text-white hover:bg-[#3D3530] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "등록 중..." : "등록"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommentItem({
  comment,
  postId,
  postAuthorId,
  currentUserId,
  depth,
  onDelete,
  onReplyAdded,
  onLikeUpdated,
}: {
  comment: BoardComment;
  postId: string;
  postAuthorId: string;
  currentUserId?: string;
  depth: number;
  onDelete: (id: string) => void;
  onReplyAdded: (parentId: string, newReply: BoardComment) => void;
  onLikeUpdated: (
    commentId: string,
    liked: boolean,
    commentLikeCount: number,
  ) => void;
}) {
  const isPostAuthor = comment.author.id === postAuthorId;
  const deleteModalState = useOverlayState();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [commentLikeCount, setCommentLikeCount] = useState(
    comment.commentLikeCount,
  );
  const [isLiked, setIsLiked] = useState(comment.isLiked ?? false);
  const [isLikePending, setIsLikePending] = useState(false);

  const handleToggleLike = async () => {
    if (!currentUserId) return;
    if (isLikePending) return;

    setIsLikePending(true);
    try {
      const res = await fetch(
        `/api/board/${postId}/comments/${comment.id}/like`,
        { method: "POST" },
      );
      if (res.ok) {
        const { liked, commentLikeCount: nextCount } = (await res.json()) as {
          liked: boolean;
          commentLikeCount: number;
        };
        setIsLiked(liked);
        setCommentLikeCount(nextCount);
        onLikeUpdated(comment.id, liked, nextCount);
      } else {
        const { error } = await res.json();
        alert(error ?? "좋아요 처리에 실패했습니다.");
      }
    } catch {
      alert("좋아요 처리 중 오류가 발생했습니다.");
    } finally {
      setIsLikePending(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/board/${postId}/comments/${comment.id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        deleteModalState.close();
        onDelete(comment.id);
      } else {
        const { error } = await res.json();
        alert(error ?? "삭제에 실패했습니다.");
      }
    } catch {
      alert("삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  const indentClass =
    depth === 1
      ? "ml-8 pl-4 border-l-2 border-[#EDE8E2]"
      : depth === 2
        ? "ml-8 pl-4 border-l-2 border-[#E8E2DA]"
        : "";

  return (
    <li id={`comment-${comment.id}`} className={indentClass}>
      <div className="flex gap-3 py-3">
        {/* <Avatar size={depth === 0 ? 32 : 28} /> */}
        <div className="flex-1 flex  gap-3">
          <div>
            <Image src={DefaultProfile} alt="profile" width={30} height={20} />
          </div>
          <div className="flex flex-col justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-semibold text-[#4A4A4A]">
                {getAnonymousName(comment.author.id)}
              </span>
              {isPostAuthor && (
                <span className="text-[10px] font-semibold text-signature">
                  (글쓴이)
                </span>
              )}
            </div>
            <p className="text-sm text-[#2A241D] leading-relaxed whitespace-pre-wrap mt-1">
              {comment.content}
            </p>

            <span className="text-xs text-[#C0B8B0] mt-1">
              {formatRelativeTime(comment.createdAt)}
            </span>
            <div className="flex items-center gap-2 mt-1">
              {/* 답글 버튼 - depth 0, 1만 가능 */}
              {currentUserId && depth < 2 && (
                <button
                  onClick={() => setShowReplyForm((v) => !v)}
                  className="text-xs text-[#8C8478] hover:text-signature transition-colors"
                >
                  {showReplyForm ? "취소" : "답글"}
                </button>
              )}
              {currentUserId === comment.author.id && (
                <button
                  onClick={deleteModalState.open}
                  disabled={isDeleting}
                  className="text-xs text-[#C0B8B0] hover:text-red-400 transition-colors disabled:opacity-50"
                >
                  삭제
                </button>
              )}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={handleToggleLike}
          disabled={!currentUserId || isLikePending}
          className={`items-center gap-1 text-xs transition-colors disabled:cursor-default ${
            isLiked
              ? "text-red-500"
              : "text-[#8C8478] hover:text-red-400 disabled:hover:text-[#8C8478]"
          }`}
          aria-label={isLiked ? "좋아요 취소" : "좋아요"}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span>{commentLikeCount}</span>
        </button>
      </div>
      {/* 인라인 답글 입력폼 */}
      {showReplyForm && (
        <ReplyForm
          postId={postId}
          parentId={comment.id}
          onSubmit={(newReply) => {
            onReplyAdded(comment.id, newReply);
            setShowReplyForm(false);
          }}
          onCancel={() => setShowReplyForm(false)}
        />
      )}

      {/* 대댓글 렌더링 */}
      {comment.replies && comment.replies.length > 0 && (
        <ul className="flex flex-col">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              depth={depth + 1}
              onDelete={onDelete}
              onReplyAdded={onReplyAdded}
              onLikeUpdated={onLikeUpdated}
            />
          ))}
        </ul>
      )}

      <DeleteConfirmModal
        state={deleteModalState}
        title="댓글을 삭제하시겠어요?"
        description="삭제한 댓글은 복구할 수 없습니다."
        isPending={isDeleting}
        onConfirm={handleDelete}
      />
    </li>
  );
}

function countAllComments(comments: BoardComment[]): number {
  return comments.reduce((acc, c) => {
    return acc + 1 + countAllComments(c.replies ?? []);
  }, 0);
}

function deleteFromTree(comments: BoardComment[], id: string): BoardComment[] {
  return comments
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, replies: deleteFromTree(c.replies ?? [], id) }));
}

function addReplyToTree(
  comments: BoardComment[],
  parentId: string,
  newReply: BoardComment,
): BoardComment[] {
  return comments.map((c) => {
    if (c.id === parentId) {
      return { ...c, replies: [...(c.replies ?? []), newReply] };
    }
    return {
      ...c,
      replies: addReplyToTree(c.replies ?? [], parentId, newReply),
    };
  });
}

function updateCommentLikeInTree(
  comments: BoardComment[],
  commentId: string,
  liked: boolean,
  commentLikeCount: number,
): BoardComment[] {
  return comments.map((c) => {
    if (c.id === commentId) {
      return { ...c, isLiked: liked, commentLikeCount };
    }
    return {
      ...c,
      replies: updateCommentLikeInTree(
        c.replies ?? [],
        commentId,
        liked,
        commentLikeCount,
      ),
    };
  });
}

export default function CommentSection({
  postId,
  comments: initialComments,
  currentUserId,
  postAuthorId,
}: CommentSectionProps) {
  const router = useRouter();
  const loginModalState = useOverlayState();
  const [comments, setComments] = useState<BoardComment[]>(initialComments);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalCount = countAllComments(comments);

  const handleSubmitRoot = async () => {
    if (!content.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/board/${postId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: content.trim() }),
      });
      if (res.ok) {
        const newComment = (await res.json()) as BoardComment;
        setComments((prev) => [
          ...prev,
          {
            ...newComment,
            commentLikeCount: newComment.commentLikeCount ?? 0,
            isLiked: false,
            replies: newComment.replies ?? [],
          },
        ]);
        setContent("");
        router.refresh();
      } else {
        const { error } = await res.json();
        alert(error ?? "댓글 작성에 실패했습니다.");
      }
    } catch {
      alert("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    setComments((prev) => deleteFromTree(prev, id));
    router.refresh();
  };

  const handleReplyAdded = (parentId: string, newReply: BoardComment) => {
    setComments((prev) =>
      addReplyToTree(prev, parentId, {
        ...newReply,
        commentLikeCount: newReply.commentLikeCount ?? 0,
        isLiked: false,
        replies: newReply.replies ?? [],
      }),
    );
    router.refresh();
  };

  const handleLikeUpdated = (
    commentId: string,
    liked: boolean,
    commentLikeCount: number,
  ) => {
    setComments((prev) =>
      updateCommentLikeInTree(prev, commentId, liked, commentLikeCount),
    );
  };

  return (
    <section className="flex flex-col gap-4">
      {/* 댓글 헤더 */}
      <div className="flex items-center gap-2 border-t border-gray-100 pt-6">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#6B6358"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-sm font-bold text-[#4A4A4A]">
          댓글 <span className="text-signature font-bold">{totalCount}</span>
        </span>
      </div>

      {/* 루트 댓글 입력 */}
      {currentUserId ? (
        <div className="flex flex-col gap-2 bg-[#FAFAF9] rounded-xl border border-[#E0D9D0] p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="댓글을 입력해주세요..."
            rows={3}
            maxLength={500}
            className="w-full bg-transparent text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#C0B8B0]">{content.length}/500</span>
            <button
              onClick={handleSubmitRoot}
              disabled={!content.trim() || isSubmitting}
              className="px-5 py-1.5 rounded-lg text-sm font-semibold bg-[#2A241D] text-white hover:bg-[#3D3530] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "등록 중..." : "댓글 등록"}
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 py-5 bg-[#FAFAF9] rounded-xl border border-[#E0D9D0]">
          <p className="text-sm text-[#C0B8B0]">
            댓글을 작성하려면 로그인이 필요합니다.
          </p>
          <button
            onClick={() => loginModalState.open()}
            className="cursor-pointer px-5 py-1.5 rounded-lg text-sm font-semibold bg-[#2A241D] text-white hover:bg-[#3D3530] transition-colors"
          >
            시작하기
          </button>
        </div>
      )}
      <SSOModal state={loginModalState} />

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-sm text-[#C0B8B0]">
          첫 번째 댓글을 남겨보세요 :)
        </div>
      ) : (
        <ul className="flex flex-col divide-y divide-gray-50">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              postAuthorId={postAuthorId}
              currentUserId={currentUserId}
              depth={0}
              onDelete={handleDelete}
              onReplyAdded={handleReplyAdded}
              onLikeUpdated={handleLikeUpdated}
            />
          ))}
        </ul>
      )}
    </section>
  );
}
