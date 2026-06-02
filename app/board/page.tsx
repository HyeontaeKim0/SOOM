import { Suspense } from "react";
import Link from "next/link";
import { auth } from "@/auth";
import { BOARD_CATEGORY_LABELS } from "@/lib/utils/BoardCategories";
import { getAnonymousName } from "@/lib/utils/anonymousName";
import CreatePostButton from "@/components/board/createPost/Button";
import BoardSideFilters from "@/components/board/sideFilters/SideFilters";
import BoardCard from "@/components/board/boardCard/BoardCard";
import { getBoardPosts } from "@/lib/services/boardService";

export default async function BoardPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const session = await auth();

  const allPosts = await getBoardPosts();
  const filteredPosts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts;

  const categories = allPosts.reduce(
    (acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagCounts = allPosts
    .flatMap((p) => p.tags)
    .reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const popularTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans w-full">
      {/* 모바일: 단일 컬럼 / 데스크탑: 사이드바 + 콘텐츠 */}
      <div className="flex w-full max-w-6xl mx-auto">
        {/* 데스크탑 사이드바 */}
        <div className="hidden md:flex flex-col py-10 px-8 w-[280px] shrink-0">
          <CreatePostButton />
          <Suspense>
            <BoardSideFilters
              categories={categories}
              popularTags={popularTags}
            />
          </Suspense>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="flex flex-col gap-3 flex-1 font-sans px-4 py-5 md:py-10 md:px-6">
          {/* 모바일 카테고리 필터 + 글쓰기 버튼 */}
          <div className="flex items-center gap-2 md:hidden">
            <div className="flex-1 overflow-hidden">
              <Suspense>
                <BoardSideFilters
                  categories={categories}
                  popularTags={popularTags}
                  mobileMode
                />
              </Suspense>
            </div>
            <div className="shrink-0">
              <CreatePostButton compact />
            </div>
          </div>

          {/* 타이틀 */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl text-text-signature font-bold mt-1">
                {category
                  ? (BOARD_CATEGORY_LABELS[category] ?? category)
                  : "전체 게시판"}
              </h1>
              <span className="text-sm text-text-signature mt-1">
                ({filteredPosts.length}개)
              </span>
            </div>
            <span className="text-sm text-text-signature mt-1">
              {session?.user?.id ? (
                <>
                  <span className="text-signature font-bold">
                    {getAnonymousName(session.user.id)}
                  </span>{" "}
                  님, 자유롭게 이야기를 나눠보세요.
                </>
              ) : (
                "자유롭게 이야기를 나눠보세요."
              )}
            </span>
            <div className="w-full h-px bg-[#E0E0E0] mt-4 mb-2"></div>
          </div>

          {/* 게시글 목록 */}
          <div className="flex flex-col gap-3">
            {filteredPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#8a8175]">
                <span className="text-4xl mb-4">📭</span>
                <p className="text-lg font-bold mb-1">아직 게시글이 없어요</p>
                <p className="text-sm">첫 번째 글을 작성해보세요!</p>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <Link key={post.id} href={`/board/${post.id}`}>
                  <BoardCard post={post} />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
