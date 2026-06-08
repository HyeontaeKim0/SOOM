import Link from "next/link";
import { getAdminPosts } from "@/lib/admin/adminService";
import { DeleteButton } from "../users/UserActions";

export const dynamic = "force-dynamic";

const CATEGORIES: Record<string, string> = {
  notice: "공지",
  free: "자유",
  question: "질문",
  review: "후기",
  info: "정보",
};

export default async function AdminPostsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const { page: pageParam, category } = await searchParams;
  const page = Number(pageParam) || 1;
  const { posts, total, pages } = await getAdminPosts({ page, category });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-800">게시글 관리</h1>
          <span className="text-sm text-gray-400">총 {total}개</span>
        </div>
        <Link
          href="/admin/posts/create"
          className="shrink-0 rounded-lg bg-[#d97b2c] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c46a1f] transition-colors"
        >
          공지 작성
        </Link>
      </div>

      {/* 카테고리 필터 */}
      <div className="mb-4 flex flex-wrap gap-2">
        <a
          href="/admin/posts"
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !category
              ? "bg-[#d97b2c] text-white"
              : "bg-white text-gray-500 border border-gray-200 hover:border-[#d97b2c] hover:text-[#d97b2c]"
          }`}
        >
          전체
        </a>
        {Object.entries(CATEGORIES).map(([key, label]) => (
          <a
            key={key}
            href={`/admin/posts?category=${key}`}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              category === key
                ? "bg-[#d97b2c] text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-[#d97b2c] hover:text-[#d97b2c]"
            }`}
          >
            {label}
          </a>
        ))}
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-[#FBF7F3] text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">제목</th>
                <th className="px-4 py-3 text-center">카테고리</th>
                <th className="px-4 py-3 text-left">작성자</th>
                <th className="px-4 py-3 text-center">조회</th>
                <th className="px-4 py-3 text-center">좋아요</th>
                <th className="px-4 py-3 text-center">댓글</th>
                <th className="px-4 py-3 text-center">작성일</th>
                <th className="px-4 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 max-w-[200px]">
                    <Link
                      href={`/board/${post.id}`}
                      target="_blank"
                      className="text-gray-700 hover:text-[#d97b2c] transition-colors line-clamp-1"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        post.category === "notice"
                          ? "bg-orange-100 text-[#d97b2c]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {CATEGORIES[post.category] ?? post.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {post.author.nickname || post.author.email}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {post.viewCount}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {post.likeCount}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {post._count.comments}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DeleteButton
                      id={post.id}
                      type="post"
                      label={post.title}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination
        page={page}
        pages={pages}
        basePath={`/admin/posts${category ? `?category=${category}&` : "?"}`}
      />
    </div>
  );
}

function Pagination({
  page,
  pages,
  basePath,
}: {
  page: number;
  pages: number;
  basePath: string;
}) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex justify-center gap-1 text-sm">
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <a
          key={p}
          href={`${basePath}page=${p}`}
          className={`rounded-lg px-3 py-1.5 transition-colors ${
            p === page
              ? "bg-[#d97b2c] text-white"
              : "bg-white text-gray-600 hover:bg-[#FBF7F3]"
          }`}
        >
          {p}
        </a>
      ))}
    </div>
  );
}
