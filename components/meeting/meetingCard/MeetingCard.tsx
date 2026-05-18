import type { MeetingData } from "@/lib/types/MeetingData";
import { Button } from "@heroui/react";

const DAY_NAMES = ["일", "월", "화", "수", "목", "금", "토"];

function getDateParts(dateStr: string) {
  const date = new Date(dateStr);
  return {
    day: date.getDate(),
    dayOfWeek: DAY_NAMES[date.getDay()],
  };
}

export default function MeetingCard({
  meetingData,
}: {
  meetingData: MeetingData;
}) {
  const { day, dayOfWeek } = getDateParts(meetingData.date);
  const participationRate = Math.round(
    (meetingData.participants / meetingData.maxParticipants) * 100,
  );

  return (
    <div className="flex w-full rounded-2xl  bg-white overflow-hidden shadow-sm border border-gray-100">
      {/* 이미지 섹션 */}
      <div className="w-[200px] min-h-[160px] shrink-0">
        <img
          src={meetingData.image}
          alt={meetingData.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 콘텐츠 섹션 */}
      <div className="flex flex-col justify-between flex-1 px-6 py-5">
        <div className="flex flex-col gap-2">
          <span className="text-xs font-semibold text-[#D97B2C] bg-[#FFF3E8] rounded-full px-3 py-1 w-fit">
            {meetingData.category}
          </span>
          <h3 className="text-lg font-bold text-[#2A241D]">
            {meetingData.title}
          </h3>
          <p className="text-sm text-[#8C8478] leading-relaxed line-clamp-2">
            {meetingData.description}
          </p>
        </div>
        <div className="flex items-center gap-4 mt-3 text-sm text-[#6B6358]">
          <span className="flex items-center gap-1.5">
            <span>{meetingData.groupIcon}</span>
            <span className="font-medium">{meetingData.groupName}</span>
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
            <span>{meetingData.location}</span>
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
          <span className="text-sm text-[#8C8478] ">
            {meetingData.time} · {meetingData.price}
          </span>
        </div>

        <div className="flex flex-col items-center gap-2 w-full mt-3">
          <div className="flex items-center justify-between w-full text-xs text-[#6B6358]">
            <span>
              참여 {meetingData.participants}/{meetingData.maxParticipants}
            </span>
            <span className="font-semibold">{participationRate}%</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8B7E3B] rounded-full transition-all"
              style={{ width: `${participationRate}%` }}
            />
          </div>
          <Button
            className="w-full mt-2 bg-[#D97B2C] text-white font-semibold text-sm rounded-xl h-9"
            size="sm"
          >
            참여 신청
          </Button>
        </div>
      </div>
    </div>
  );
}
