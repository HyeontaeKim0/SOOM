import Image from "next/image";
import { getAdminUsers } from "@/lib/admin/adminService";
import { DeleteButton, RoleToggleButton } from "./UserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const { users, total, pages } = await getAdminUsers({ page });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">유저 관리</h1>
        <span className="text-sm text-gray-400">총 {total}명</span>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-[#FBF7F3] text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">유저</th>
                <th className="px-4 py-3 text-left">이메일</th>
                <th className="px-4 py-3 text-center">역할</th>
                <th className="px-4 py-3 text-center">게시글</th>
                <th className="px-4 py-3 text-center">댓글</th>
                <th className="px-4 py-3 text-center">모임</th>
                <th className="px-4 py-3 text-center">가입일</th>
                <th className="px-4 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt=""
                          width={28}
                          height={28}
                          className="rounded-full"
                        />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">
                          ?
                        </div>
                      )}
                      <span className="text-gray-700 font-medium">
                        {user.nickname || user.name || "—"}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {user.email}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
                        user.role === "ADMIN"
                          ? "bg-orange-100 text-[#d97b2c]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {user.role === "ADMIN" ? "관리자" : "유저"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {user._count.boardPosts}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {user._count.boardComments}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {user._count.meetings}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">
                    {user.emailVerified
                      ? new Date(user.emailVerified).toLocaleDateString("ko-KR")
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-1">
                      <RoleToggleButton
                        userId={user.id}
                        currentRole={user.role}
                      />
                      <DeleteButton
                        id={user.id}
                        type="user"
                        label={user.email ?? user.id}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} basePath="/admin/users" />
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
          href={`${basePath}?page=${p}`}
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
