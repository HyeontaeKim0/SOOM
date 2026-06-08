"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PostImagePicker from "@/components/board/PostImagePicker";

export default function AdminNoticeCreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/^#/, "");
      if (newTag && !tags.includes(newTag) && tags.length < 5) {
        setTags([...tags, newTag]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const isValid = title.trim() && content.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: "notice",
          title,
          content,
          tags,
          images,
        }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(error);
        return;
      }

      router.push("/admin/posts?category=notice");
    } catch {
      alert("공지 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">공지 작성</h1>
          <p className="mt-1 text-sm text-gray-400">
            관리자 전용 공지 게시글을 작성합니다.
          </p>
        </div>
        <Link
          href="/admin/posts?category=notice"
          className="shrink-0 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 목록으로
        </Link>
      </div>

      <div className="flex flex-col gap-5 rounded-xl border border-gray-100 bg-white px-4 py-5 shadow-sm md:px-8 md:py-8">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#4A4A4A]">카테고리</label>
          <span className="inline-flex w-fit rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-[#d97b2c]">
            공지
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#4A4A4A]">
            제목 <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="공지 제목을 입력해주세요"
            maxLength={100}
            className="w-full rounded-xl border border-[#E0D9D0] px-4 py-3 text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:border-[#d97b2c] focus:outline-none transition-colors"
          />
          <div className="text-right text-xs text-[#C0B8B0]">
            {title.length}/100
          </div>
        </div>

        <PostImagePicker images={images} onChange={setImages} />

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#4A4A4A]">
            내용 <span className="text-red-400">*</span>
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="공지 내용을 입력해주세요"
            maxLength={3000}
            rows={12}
            className="w-full resize-none rounded-xl border border-[#E0D9D0] px-4 py-3 text-sm leading-relaxed text-[#2A241D] placeholder-[#C0B8B0] focus:border-[#d97b2c] focus:outline-none transition-colors"
          />
          <div className="text-right text-xs text-[#C0B8B0]">
            {content.length}/3000
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold text-[#4A4A4A]">
            태그{" "}
            <span className="text-xs font-normal text-[#C0B8B0]">
              (최대 5개, Enter 또는 쉼표로 추가)
            </span>
          </label>
          <div className="flex min-h-[48px] flex-wrap items-center gap-2 rounded-xl border border-[#E0D9D0] px-4 py-3 focus-within:border-[#d97b2c] transition-colors">
            {tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 rounded-full bg-[#f1f5e8] px-3 py-1 text-xs text-[#5f7a4a]"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-1 text-xs leading-none text-[#5f7a4a] hover:text-red-400 transition-colors"
                  aria-label={`${tag} 태그 삭제`}
                >
                  ×
                </button>
              </span>
            ))}
            {tags.length < 5 && (
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder={tags.length === 0 ? "#태그 입력" : ""}
                className="min-w-[100px] flex-1 bg-transparent text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none"
              />
            )}
          </div>
        </div>
      </div>

      <div className="mt-4 flex gap-3">
        <Link
          href="/admin/posts?category=notice"
          className="flex-1 rounded-xl border border-[#E0D9D0] px-6 py-3 text-center text-sm font-semibold text-[#6B6358] hover:bg-[#F5F0EB] transition-colors md:flex-none"
        >
          취소
        </Link>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!isValid || isLoading}
          className={`flex-1 rounded-xl px-6 py-3 text-sm font-semibold transition-colors md:flex-none ${
            isValid && !isLoading
              ? "bg-[#d97b2c] text-white hover:bg-[#c46a1f]"
              : "cursor-not-allowed bg-[#C0B8B0] text-white"
          }`}
        >
          {isLoading ? "등록 중..." : "공지 등록"}
        </button>
      </div>
    </div>
  );
}
