"use client";

import { useState, KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { BOARD_CATEGORY_LABELS } from "@/lib/utils/BoardCategories";

export default function CreateBoardPage() {
  const router = useRouter();
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
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

  const isValid = category && title.trim() && content.trim();

  const handleSubmit = async () => {
    if (!isValid) return;
    setIsLoading(true);

    try {
      const res = await fetch("/api/board", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, title, content, tags }),
      });

      if (!res.ok) {
        const { error } = await res.json();
        alert(error);
        return;
      }

      const post = await res.json();
      router.push(`/board/${post.id}`); // 작성 후 상세 페이지로 이동
    } catch {
      alert("글 작성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans w-full">
      <div className="flex flex-col w-full max-w-3xl mx-auto px-4 py-5 md:px-8 md:py-10 gap-6">
        {/* 카드 영역 */}
        <div className="flex flex-col gap-5 bg-white rounded-2xl shadow-sm border border-gray-100 px-4 py-5 md:px-8 md:py-8">
          {/* 카테고리 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#4A4A4A]">
              카테고리 <span className="text-red-400">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(BOARD_CATEGORY_LABELS)
                .filter(([key]) => key !== "notice")
                .map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setCategory(key)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors ${
                      category === key
                        ? "bg-signature text-white border-signature"
                        : "bg-white text-[#6B6358] border-[#E0D9D0] hover:border-signature hover:text-signature"
                    }`}
                  >
                    {label}
                  </button>
                ))}
            </div>
          </div>

          {/* 제목 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#4A4A4A]">
              제목 <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력해주세요"
              maxLength={100}
              className="w-full border border-[#E0D9D0] rounded-xl px-4 py-3 text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none focus:border-signature transition-colors"
            />
            <div className="text-right text-xs text-[#C0B8B0]">
              {title.length}/100
            </div>
          </div>

          {/* 본문 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#4A4A4A]">
              내용 <span className="text-red-400">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력해주세요"
              maxLength={3000}
              rows={12}
              className="w-full border border-[#E0D9D0] rounded-xl px-4 py-3 text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none focus:border-signature transition-colors resize-none leading-relaxed"
            />
            <div className="text-right text-xs text-[#C0B8B0]">
              {content.length}/3000
            </div>
          </div>

          {/* 태그 */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-[#4A4A4A]">
              태그{" "}
              <span className="text-xs text-[#C0B8B0] font-normal">
                (최대 5개, Enter 또는 쉼표로 추가)
              </span>
            </label>
            <div className="flex flex-wrap items-center gap-2 border border-[#E0D9D0] rounded-xl px-4 py-3 min-h-[48px] focus-within:border-signature transition-colors">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 text-xs text-[#5f7a4a] bg-[#f1f5e8] rounded-full px-3 py-1"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 text-[#5f7a4a] hover:text-red-400 transition-colors text-xs leading-none"
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
                  className="flex-1 min-w-[100px] text-sm text-[#2A241D] placeholder-[#C0B8B0] focus:outline-none bg-transparent"
                />
              )}
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-semibold text-[#6B6358] border border-[#E0D9D0] hover:bg-[#F5F0EB] transition-colors"
          >
            취소
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!isValid}
            className={`flex-1 md:flex-none px-6 py-3 rounded-xl text-sm font-semibold transition-colors ${
              isValid
                ? "bg-[#2A241D] text-white hover:bg-[#3D3530]"
                : "bg-[#C0B8B0] text-white cursor-not-allowed"
            }`}
          >
            {isLoading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </div>
    </div>
  );
}
