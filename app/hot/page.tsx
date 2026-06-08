import Link from "next/link";
import { Flame } from "lucide-react";
import BoardCard from "@/components/board/boardCard/BoardCard";
import { getHotBoardPosts } from "@/lib/services/boardService";
import type { Metadata } from "next";

export const revalidate = 30;

export const metadata: Metadata = {
  title: "인기 게시물",
  description: "오늘 가장 많이 읽힌 커뮤니티 게시글을 확인하세요.",
  alternates: {
    canonical: "/hot",
  },
};

export default async function HotPage() {
  const hotPosts = await getHotBoardPosts();

  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans w-full">
      <div className="flex w-full max-w-3xl mx-auto">
        <div className="flex flex-col gap-3 flex-1 font-sans px-4 py-5 md:py-10 md:px-6">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1 className="text-xl md:text-2xl text-text-signature font-bold mt-1">
                인기 게시물
              </h1>
              <span className="text-sm text-text-signature mt-1">
                ({hotPosts.length}개)
              </span>
            </div>
            <span className="text-sm text-text-signature mt-1">
              오늘 조회수가 많은 게시물을 모았어요.
            </span>
            <div className="w-full h-px bg-[#E0E0E0] mt-4 mb-2" />
          </div>

          <div className="flex flex-col gap-3">
            {hotPosts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-[#8a8175]">
                <span className="text-4xl mb-4">🔥</span>
                <p className="text-lg font-bold mb-1">
                  아직 인기 게시글이 없어요
                </p>
                <p className="text-sm">
                  게시판에서 글을 읽어보면 순위가 올라가요!
                </p>
              </div>
            ) : (
              hotPosts.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="flex gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <BoardCard
                      post={post}
                      displayViewCount={post.todayViewCount}
                    />
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
