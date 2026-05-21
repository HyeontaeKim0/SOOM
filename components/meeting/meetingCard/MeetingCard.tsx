import { Button } from "@heroui/react";
import { CATEGORY_LABELS } from "@/lib/utils/MeetingCategories";
import type { Session } from "next-auth";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

import type { MeetingWithHost } from "@/lib/types/MeetingData";

function getDateParts(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate(),
    dayOfWeek: DAY_NAMES[date.getDay()],
  };
}

export default function MeetingCard({
  meeting,
  session,
}: {
  meeting: MeetingWithHost;
  session: Session;
}) {
  const { day, dayOfWeek } = getDateParts(meeting.date);
  const isHost = session?.user?.id === meeting.host.id;

  return (
    <div className="flex w-full rounded-2xl bg-white overflow-hidden shadow-sm border border-gray-100">
      {/* 이미지 섹션 */}
      <div className="w-[200px] min-h-[160px] shrink-0">
        {meeting.image ? (
          <img
            src={meeting.image}
            alt={meeting.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[#E8E0D6] flex items-center justify-center text-[#8a8175] text-sm">
            이미지 없음
          </div>
        )}
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="flex flex-col justify-between flex-1 px-4 py-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-signature bg-signature/15 rounded-full px-3 py-1 w-fit">
            {CATEGORY_LABELS[meeting.category] ?? meeting.category}
          </span>
          <h3 className="text-lg font-bold text-[#2A241D]">{meeting.title}</h3>
          <p className="text-sm text-[#8C8478] leading-relaxed line-clamp-2">
            {meeting.description}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-[#6B6358]">
          <span className="flex items-center gap-1.5">
            <span className="font-medium">{meeting.host.name ?? "호스트"}</span>
          </span>
          <span className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="text-[#8C8478]"
            >
              <path
                d="M7 1.167A4.088 4.088 0 0 0 2.917 5.25C2.917 8.313 7 12.833 7 12.833s4.083-4.52 4.083-7.583A4.088 4.088 0 0 0 7 1.167Zm0 5.541a1.458 1.458 0 1 1 0-2.916 1.458 1.458 0 0 1 0 2.916Z"
                fill="currentColor"
              />
            </svg>
            <span>
              {meeting.isOnline ? "온라인" : meeting.location || "미정"}
            </span>
          </span>
        </div>
      </div>

      {/* 날짜 & 참여 섹션 */}
      <div className="flex flex-col items-center justify-between w-[160px] shrink-0 border-l border-gray-100 px-4 py-5">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-[#2A241D]">{day}</span>
            <span className="text-base font-medium text-[#6B6358]">
              {dayOfWeek}
            </span>
          </div>
          <span className="text-sm text-[#8C8478]">
            {meeting.time} · {meeting.price}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 w-full mt-3">
          <div className="flex items-center justify-between w-full text-xs text-[#6B6358]">
            <span>정원 {meeting.maxParticipants}명</span>
          </div>
          {isHost ? (
            <Button
              className="w-full mt-2 bg-signature text-white font-semibold text-sm rounded-xl h-9"
              size="sm"
            >
              모임 관리
            </Button>
          ) : (
            <Button
              className="w-full mt-2 bg-signature text-white font-semibold text-sm rounded-xl h-9"
              size="sm"
            >
              참여 신청
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
