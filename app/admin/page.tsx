import { getAdminOverview } from "@/lib/admin/adminService";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const stats = await getAdminOverview();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-gray-800">대시보드</h1>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        <StatCard
          label="전체 유저"
          value={stats.totalUsers}
          sub={`오늘 +${stats.newUsersToday}`}
          color="orange"
        />
        <StatCard
          label="이번 주 신규 유저"
          value={stats.newUsersThisWeek}
          color="amber"
        />
        <StatCard
          label="전체 게시글"
          value={stats.totalPosts}
          sub={`오늘 +${stats.postsToday}`}
          color="orange"
        />
        <StatCard
          label="전체 댓글"
          value={stats.totalComments}
          color="amber"
        />
        <StatCard
          label="전체 모임"
          value={stats.totalMeetings}
          color="orange"
        />
        <StatCard
          label="오늘 조회수"
          value={stats.todayViews}
          color="amber"
        />
      </div>

      <div className="mt-8 rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-gray-600">빠른 링크</h2>
        <div className="flex flex-wrap gap-2">
          {[
            { href: "/admin/posts/create", label: "공지 작성 →" },
            { href: "/admin/users", label: "유저 관리 →" },
            { href: "/admin/posts", label: "게시글 관리 →" },
            { href: "/admin/meetings", label: "모임 관리 →" },
            { href: "/board", label: "서비스 보기 →" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg bg-[#FBF7F3] px-4 py-2 text-sm text-[#d97b2c] font-medium hover:bg-orange-50 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  color,
}: {
  label: string;
  value: number;
  sub?: string;
  color: "orange" | "amber";
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
      <p className="text-xs text-gray-400">{label}</p>
      <p
        className={`mt-1 text-2xl font-bold ${
          color === "orange" ? "text-[#d97b2c]" : "text-amber-500"
        }`}
      >
        {value.toLocaleString()}
      </p>
      {sub && <p className="mt-1 text-xs text-gray-400">{sub}</p>}
    </div>
  );
}
