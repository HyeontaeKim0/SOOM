export default function LikedPostsSection({
  hideHeader = false,
}: {
  hideHeader?: boolean;
}) {
  return (
    <section className="flex flex-col gap-4 w-full">
      {!hideHeader && (
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[#2A241D]">좋아요한 글</h2>
          <span className="text-xs font-semibold text-[#8C8478] bg-[#F5F0EB] rounded-full px-2.5 py-0.5">
            준비 중
          </span>
        </div>
      )}
      <div className="flex flex-col items-center justify-center py-12 rounded-2xl bg-white border border-dashed border-gray-200 text-[#8C8478]">
        <span className="text-3xl mb-3">❤️</span>
        <p className="text-sm font-semibold">좋아요 기능이 곧 추가될 예정이에요</p>
        <p className="text-xs mt-1">마음에 든 글을 모아볼 수 있게 준비하고 있어요</p>
      </div>
    </section>
  );
}
