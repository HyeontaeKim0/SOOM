"use client";
import { useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { CATEGORY_LABELS } from "@/lib/utils/MeetingCategories";

export default function SideFillters({
  categories,
  topTags,
}: {
  categories: Record<string, number>;
  topTags: string[];
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
                <>
                  <div className="text-sm font-bold text-signature">
                    한번 더 누르면 전체
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm font-bold text-[#4A4A4A]">
                    {CATEGORY_LABELS[category]}
                  </div>
                  <div className="text-sm text-[#4A4A4A]">{count}</div>
                </>
              )}
            </div>
          );
        })}
      </div>
      {/* 지금 뜨는 태그 필터 */}
      {topTags.length > 0 && (
        <div className="flex flex-col gap-2 mt-10 bg-[#f1f5e8] rounded-xl p-4 border border-[#dfe8d0]">
          <span className="text-sm text-[#4A4A4A] font-bold">
            지금 뜨는 태그
          </span>
          <div className="flex flex-wrap gap-2 mt-2">
            {topTags.map((tag) => (
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
