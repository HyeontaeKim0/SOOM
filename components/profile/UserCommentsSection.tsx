import Link from "next/link";
import type { UserBoardComment } from "@/lib/types/ProfileData";

export default function UserCommentsSection({
  comments,
  hideHeader = false,
}: {
  comments: UserBoardComment[];
  hideHeader?: boolean;
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      {!hideHeader && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#2A241D]">작성한 댓글</h2>
          <span className="text-sm text-[#8C8478]">({comments.length}개)</span>
        </div>
      )}
      {comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-gray-100 text-[#8C8478]">
          <span className="text-3xl mb-3">💬</span>
          <p className="text-sm font-semibold">아직 작성한 댓글이 없어요</p>
          <Link
            href="/board"
            className="mt-3 text-sm font-semibold text-signature hover:underline"
          >
            게시판 둘러보기
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {comments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </section>
  );
}

function CommentItem({ comment }: { comment: UserBoardComment }) {
  const formattedDate = new Date(comment.createdAt).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return (
    <Link
      href={`/board/${comment.post.id}`}
      className="flex flex-col gap-2 rounded-2xl bg-white border border-gray-100 shadow-sm px-5 py-4 hover:shadow-md transition-shadow"
    >
      <p className="text-sm text-[#2A241D] leading-relaxed line-clamp-2">
        {comment.content}
      </p>
      <div className="flex items-center justify-between text-xs text-[#8C8478] border-t border-gray-50 pt-2">
        <span className="font-semibold text-[#6B6358] line-clamp-1">
          {comment.post.title}
        </span>
        <span className="shrink-0 ml-2">{formattedDate}</span>
      </div>
    </Link>
  );
}
