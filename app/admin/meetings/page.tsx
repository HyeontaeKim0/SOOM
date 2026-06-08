import { getAdminMeetings } from "@/lib/admin/adminService";
import { DeleteButton } from "../users/UserActions";

export const dynamic = "force-dynamic";

export default async function AdminMeetingsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;
  const { meetings, total, pages } = await getAdminMeetings({ page });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">모임 관리</h1>
        <span className="text-sm text-gray-400">총 {total}개</span>
      </div>

      <div className="rounded-xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-[#FBF7F3] text-xs text-gray-500 uppercase tracking-wide">
              <tr>
                <th className="px-4 py-3 text-left">제목</th>
                <th className="px-4 py-3 text-center">카테고리</th>
                <th className="px-4 py-3 text-left">호스트</th>
                <th className="px-4 py-3 text-left">장소</th>
                <th className="px-4 py-3 text-center">날짜</th>
                <th className="px-4 py-3 text-center">최대 인원</th>
                <th className="px-4 py-3 text-center">형태</th>
                <th className="px-4 py-3 text-center">등록일</th>
                <th className="px-4 py-3 text-center">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {meetings.map((meeting) => (
                <tr
                  key={meeting.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-3 max-w-[180px]">
                    <span className="text-gray-700 line-clamp-1">
                      {meeting.title}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className="inline-block rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
                      {meeting.category}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {meeting.host.nickname || meeting.host.email}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 max-w-[120px] truncate">
                    {meeting.location}
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-500">
                    {meeting.date}
                  </td>
                  <td className="px-4 py-3 text-center text-gray-600">
                    {meeting.maxParticipants}명
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                        meeting.isOnline
                          ? "bg-blue-50 text-blue-500"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {meeting.isOnline ? "온라인" : "오프라인"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center text-xs text-gray-400">
                    {new Date(meeting.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <DeleteButton
                      id={meeting.id}
                      type="meeting"
                      label={meeting.title}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={page} pages={pages} basePath="/admin/meetings" />
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
