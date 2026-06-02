import Link from "next/link";
import BoardCard from "@/components/board/boardCard/BoardCard";
import type { BoardPost } from "@/lib/types/BoardData";

export default function UserPostsSection({
  posts,
  hideHeader = false,
}: {
  posts: BoardPost[];
  hideHeader?: boolean;
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      {!hideHeader && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#2A241D]">작성한 글</h2>
          <span className="text-sm text-[#8C8478]">({posts.length}개)</span>
        </div>
      )}
      {posts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 text-[#8C8478]">
          <span className="text-3xl mb-3">✍️</span>
          <p className="text-sm font-semibold">아직 작성한 글이 없어요</p>
          <Link
            href="/board/create"
            className="mt-3 text-sm font-semibold text-signature hover:underline"
          >
            첫 글 작성하기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <Link key={post.id} href={`/board/${post.id}`}>
              <BoardCard post={post} />
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
