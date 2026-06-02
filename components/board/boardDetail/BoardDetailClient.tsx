"use client";

import { useState, useEffect, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { BOARD_CATEGORY_LABELS } from "@/lib/utils/BoardCategories";
import { getAnonymousName } from "@/lib/utils/anonymousName";
import type { BoardPostDetail } from "@/lib/types/BoardData";
import Image from "next/image";
import DefaultProfile from "@/assets/login/DefaultImg.png";

interface BoardDetailClientProps {
  post: BoardPostDetail;
  currentUserId?: string;
}

function formatDate(date: Date | string) {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default function BoardDetailClient({
  post,
  currentUserId,
}: BoardDetailClientProps) {
  const router = useRouter();
  const isAuthor = currentUserId === post.author.id;

  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/board/${post.id}/view`, {
      method: "POST",
      signal: controller.signal,
    }).catch(() => {});
    return () => controller.abort();
  }, [post.id]);

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [editCategory, setEditCategory] = useState(post.category);
  const [editTitle, setEditTitle] = useState(post.title);
  const [editContent, setEditContent] = useState(post.content);
  const [editTags, setEditTags] = useState<string[]>(post.tags);
  const [tagInput, setTagInput] = useState("");

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (newTag && !editTags.includes(newTag) && editTags.length < 5) {
        setEditTags([...editTags, newTag]);
      }
      setTagInput("");
    }
  };

  const handleCancelEdit = () => {
    setEditCategory(post.category);
    setEditTitle(post.title);
    setEditContent(post.content);
    setEditTags(post.tags);
    setTagInput("");
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!editTitle.trim() || !editContent.trim() || !editCategory) return;
    setIsSaving(true);

    try {
      const res = await fetch(`/api/board/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: editCategory,
          title: editTitle,
          content: editContent,
          tags: editTags,
        }),
      });

      if (res.ok) {
        setIsEditing(false);
        router.refresh();
      } else {
        const { error } = await res.json();
        alert(error ?? "수정에 실패했습니다.");
      }
    } catch {
      alert("수정 중 오류가 발생했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/board/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/board");
        router.refresh();
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

  return (
    <article className="flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5 md:px-8 md:py-8 gap-5 md:gap-6">
      {/* 헤더 영역 */}
      <div className="flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2 flex-1">
            {/* 카테고리 */}
            {isEditing ? (
              <div className="flex flex-wrap gap-2">
                {Object.entries(BOARD_CATEGORY_LABELS)
                  .filter(([key]) => key !== "notice")
                  .map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setEditCategory(key)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border transition-colors ${
                        editCategory === key
                          ? "bg-signature text-white border-signature"
                          : "bg-white text-[#6B6358] border-[#E0D9D0] hover:border-signature hover:text-signature"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
              </div>
            ) : (
              <span className="text-xs font-semibold text-signature bg-signature/15 rounded-full px-3 py-1 w-fit">
                {BOARD_CATEGORY_LABELS[post.category] ?? post.category}
              </span>
            )}

            {/* 제목 */}
            {isEditing ? (
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                maxLength={100}
                placeholder="제목을 입력해주세요"
                className="w-full border border-[#E0D9D0] rounded-xl px-4 py-2.5 text-base font-bold text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none focus:border-signature transition-colors"
              />
            ) : (
              <h1 className="text-lg md:text-xl font-bold text-[#2A241D] leading-snug">
                {post.title}
              </h1>
            )}
          </div>
        </div>

        {/* 작성자 정보 + 메타 */}
        <div className="flex items-center justify-between text-xs text-[#8C8478] border-b border-gray-100 pb-5">
          <div className="flex items-center gap-2.5">
            <Image
              src={DefaultProfile}
              alt="profile"
              width={30}
              height={30}
              className="rounded-full"
            />
            <span className="font-semibold text-[#6B6358]">
              {getAnonymousName(post.author.id)}
            </span>
            <span>·</span>
            <span>{formatDate(post.createdAt)}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {post.viewCount}
            </span>
            <span className="flex items-center gap-1">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              {post.comments.length}
            </span>
          </div>
        </div>
      </div>

      {/* 본문 */}
      {isEditing ? (
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          maxLength={3000}
          rows={14}
          placeholder="내용을 입력해주세요"
          className="w-full border border-[#E0D9D0] rounded-xl px-4 py-3 text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none focus:border-signature transition-colors resize-none leading-relaxed"
        />
      ) : (
        <div className="text-sm text-[#2A241D] leading-7 whitespace-pre-wrap min-h-[200px]">
          {post.content}
        </div>
      )}
      {/* 작성자 버튼 */}
      {isAuthor && (
        <div className="flex gap-2 shrink-0 justify-end">
          {isEditing ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-[#E0D9D0] text-[#6B6358] hover:bg-[#F5F0EB] transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={
                  isSaving ||
                  !editTitle.trim() ||
                  !editContent.trim() ||
                  !editCategory
                }
                className="px-4 py-1.5 rounded-lg text-sm font-semibold bg-[#2A241D] text-white hover:bg-[#3D3530] transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isSaving ? "저장 중..." : "저장"}
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-[#E0D9D0] text-[#6B6358] hover:bg-[#F5F0EB] transition-colors"
              >
                수정
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-1.5 rounded-lg text-sm font-semibold border border-red-200 text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                {isDeleting ? "삭제 중..." : "삭제"}
              </button>
            </>
          )}
        </div>
      )}

      {/* 태그 */}
      {isEditing ? (
        <div className="flex flex-col gap-1.5">
          <div className="flex flex-wrap items-center gap-2 border border-[#E0D9D0] rounded-xl px-4 py-3 min-h-[48px] focus-within:border-signature transition-colors">
            {editTags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-xs text-[#5f7a4a] bg-[#f1f5e8] rounded-full px-3 py-1"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => setEditTags(editTags.filter((t) => t !== tag))}
                  className="ml-1 text-[#5f7a4a] hover:text-red-400 transition-colors leading-none"
                >
                  ×
                </button>
              </span>
            ))}
            {editTags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={
                  editTags.length === 0 ? "#태그 입력 (Enter로 추가)" : ""
                }
                className="flex-1 min-w-[120px] text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none bg-transparent"
              />
            )}
          </div>
          <p className="text-xs text-[#C0B8B0]">
            최대 5개, Enter 또는 쉼표로 추가
          </p>
        </div>
      ) : (
        post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 border-t border-gray-50 pt-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs text-[#5f7a4a] bg-[#f1f5e8] rounded-full px-3 py-1"
              >
                #{tag}
              </span>
            ))}
          </div>
        )
      )}
    </article>
  );
}
