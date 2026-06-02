"use client";
import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { BOARD_CATEGORY_LABELS } from "@/lib/utils/BoardCategories";

export default function BoardSideFilters({
  categories,
  popularTags,
  mobileMode = false,
}: {
  categories: Record<string, number>;
  popularTags: string[];
  mobileMode?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeCategory = searchParams.get("category");

  const handleCategoryClick = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (activeCategory === category) {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      const query = params.toString();
      router.replace(pathname + (query ? `?${query}` : ""), { scroll: false });
    },
    [router, pathname, searchParams, activeCategory],
  );

  /* 모바일: 수평 스크롤 칩 */
  if (mobileMode) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("category");
            router.replace(pathname + (params.toString() ? `?${params.toString()}` : ""), { scroll: false });
          }}
          className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
            !activeCategory
              ? "bg-signature text-white border-signature"
              : "bg-white text-[#6B6358] border-[#E0D9D0]"
          }`}
        >
          전체
        </button>
        {Object.entries(categories).map(([category, count]) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors ${
                isActive
                  ? "bg-signature text-white border-signature"
                  : "bg-white text-[#6B6358] border-[#E0D9D0]"
              }`}
            >
              {BOARD_CATEGORY_LABELS[category] ?? category}
              <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>
    );
  }

  /* 데스크탑: 세로 사이드바 */
  return (
    <div>
      {/* 카테고리 필터 */}
      <div className="flex flex-col gap-2 mt-5 rounded-xl p-4">
        <span className="text-sm text-[#4A4A4A] font-bold">카테고리</span>
        {Object.entries(categories).map(([category, count]) => {
          const isActive = activeCategory === category;
          return (
            <div
              key={category}
              className={`flex justify-between px-2 mt-2 cursor-pointer rounded-lg py-1 transition-colors ${
                isActive
                  ? "bg-signature/10 text-signature"
                  : "hover:bg-gray-100"
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {isActive ? (
                <div className="text-sm font-bold text-signature">
                  한번 더 누르면 전체 !!
                </div>
              ) : (
                <>
                  <div className="text-sm font-bold text-[#4A4A4A]">
                    {BOARD_CATEGORY_LABELS[category] ?? category}
                  </div>
                  <div className="text-sm text-[#4A4A4A]">{count}</div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* 인기 태그 */}
      {popularTags.length > 0 && (
        <div className="flex flex-col gap-2 mt-10 bg-[#f1f5e8] rounded-xl p-4 border border-[#dfe8d0]">
          <span className="text-sm text-[#4A4A4A] font-bold">인기 태그</span>
          <div className="flex flex-wrap gap-2 mt-2">
            {popularTags.map((tag) => (
              <div key={tag} className="flex gap-2 items-center">
                <div className="text-sm font-bold text-[#5f7a4a] bg-[#ffffff] rounded-full px-2 py-1 whitespace-nowrap">
                  #{tag}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
