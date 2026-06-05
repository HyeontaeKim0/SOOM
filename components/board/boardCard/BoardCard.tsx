import { BOARD_CATEGORY_LABELS } from "@/lib/utils/BoardCategories";
import { getAnonymousName } from "@/lib/utils/anonymousName";
import type { BoardPost } from "@/lib/types/BoardData";
import formatRelativeTime from "@/lib/utils/FormatRelativeTime";

export type { BoardPost };

export default function BoardCard({
  post,
  displayViewCount,
}: {
  post: BoardPost;
  displayViewCount?: number;
}) {
  const viewCount = displayViewCount ?? post.viewCount;
  const formattedDate = new Date(post.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <div className="flex flex-col w-full rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100 px-6 py-5 gap-3 cursor-pointer hover:shadow-md transition-shadow">
      {/* 상단: 카테고리 + 제목 */}
      <div className="flex flex-col gap-1.5">
        <span className="text-xs font-semibold text-signature bg-signature/15 rounded-full px-3 py-1 w-fit">
          {BOARD_CATEGORY_LABELS[post.category] ?? post.category}
        </span>
        <h3 className="text-base font-bold text-[#2A241D] leading-snug line-clamp-1">
          {post.title}
        </h3>
        <p className="text-sm text-[#8C8478] leading-relaxed line-clamp-2">
          {post.content}
        </p>
      </div>

      {/* 태그 */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-[#5f7a4a] bg-[#f1f5e8] rounded-full px-2 py-0.5"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 하단: 작성자 + 날짜 + 조회/댓글 */}
      <div className="flex items-center justify-between text-xs text-[#8C8478] border-t border-gray-50 pt-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-[#6B6358]">
            {getAnonymousName(post.author.id)}
          </span>
          <span>·</span>
          <span>{formatRelativeTime(post.createdAt)}</span>
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
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            {post.likeCount}
          </span>
          {/* 뷰 카운터가 있으나 굳이 보여줄 필요 없어보임 */}
          {/* <span className="flex items-center gap-1">
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
          </span> */}
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
            {post._count.comments}
          </span>
        </div>
      </div>
    </div>
  );
}
