import { auth } from "@/auth";
import { Button } from "@heroui/react";
import MeetingCard from "@/components/meeting/meetingCard/MeetingCard";
import { mockMeetingData } from "@/lib/mockData/MockData";
import type { MeetingData } from "@/lib/types/MeetingData";

export default async function MeetingPage() {
  const session = await auth();
  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans max-w-7xl mx-auto">
      <div className="py-[50px] px-[40px] w-[360px] shrink-0">
        <Button className="bg-[#2A241D] text-white rounded-xl w-full h-[50px]">
          + 새 모임 만들기
        </Button>
        {/*  mockMeetingData 카테고리 나열 */}
        <div className="flex flex-col gap-2 mt-5  rounded-xl p-4">
          <span className="text-sm text-[#4A4A4A] font-bold">카테고리</span>
          {[...new Set(mockMeetingData.map((m) => m.category))].map(
            (category) => (
              <div key={category} className="flex justify-between px-2 mt-2">
                <div className="text-sm font-bold text-[#4A4A4A]">
                  {category}
                </div>
                <div className="text-sm text-[#4A4A4A]">
                  {
                    mockMeetingData.filter((m) => m.category === category)
                      .length
                  }
                </div>
              </div>
            ),
          )}
        </div>
        {/* mockMeetingData 태그갯수를 카운트하여 가장 많은거 부터 상위 5개 태그를 출력 */}
        <div className="flex flex-col gap-2 mt-10 bg-[#f1f5e8] rounded-xl p-4 border border-[#dfe8d0]">
          <span className="text-sm text-[#4A4A4A] font-bold">
            지금 뜨는 태그
          </span>
          {/* 한줄에 최대 3개만 보이고 넘어가면 다음줄 */}
          <div className="flex flex-wrap gap-2 mt-2">
            {[...new Set(mockMeetingData.flatMap((m) => m.tags))]
              .sort(
                (a, b) =>
                  mockMeetingData.filter((m) => m.tags.includes(b)).length -
                  mockMeetingData.filter((m) => m.tags.includes(a)).length,
              )
              .slice(0, 5)
              .map((tag) => (
                <div key={tag} className="flex gap-2 items-center">
                  <div className="text-sm font-bold text-[#5f7a4a] bg-[#ffffff] rounded-full px-2 py-1 whitespace-nowrap">
                    #{tag}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 flex-1 font-sans py-[50px] px-[10px]">
        {/* 타이틀 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-[#4A4A4A] font-bold">이번 주 모임</h1>
            <span className="text-sm text-[#4A4A4A] mt-2"> (2개)</span>
          </div>
          <span className="text-sm text-[#4A4A4A] mt-2">
            <span className="text-[#D97B2C] font-bold">
              {session?.user?.name}
            </span>
            님의 관심사 <span className="font-bold">등산</span>,{" "}
            <span className="font-bold">사진</span>,{" "}
            <span className="font-bold">독서</span>에 어울리는 모임을 모았어요.
          </span>
          {/* 선 */}
          <div className="w-full h-[1px] bg-[#E0E0E0] my-4"></div>
          {/* 필터 */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-[#4A4A4A]">
              이번 주말
            </div>
            <div className="flex items-center text-sm text-[#4A4A4A]">
              초보환영
            </div>
            <div className="flex items-center text-sm text-[#4A4A4A]">무료</div>
            <div className="flex items-center text-sm text-[#4A4A4A]">
              정원 여유
            </div>
            <div className="flex items-center text-sm text-[#4A4A4A]">
              온라인
            </div>
            <div className="flex items-center text-sm text-[#4A4A4A]">
              오프라인
            </div>
          </div>
        </div>
        <div className="mt-5 flex flex-col gap-4">
          {mockMeetingData.map((meeting: MeetingData) => (
            <MeetingCard key={meeting.id} meetingData={meeting} />
          ))}
        </div>
      </div>
    </div>
  );
}
