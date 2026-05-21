import { Suspense } from "react";
import { auth } from "@/auth";
import { getMeetings } from "@/lib/services/meetingService";
import { CATEGORY_LABELS } from "@/lib/utils/MeetingCategories";

import type { Session } from "next-auth";

import MeetingCard from "@/components/meeting/meetingCard/MeetingCard";
import CreateMeetingButton from "@/components/meeting/createMeeting/button/Button";
import SideFillters from "@/components/meeting/sideFillters/SideFillters";

export default async function MeetingPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const session = await auth();
  const allMeetings = await getMeetings();
  const meetings = category
    ? allMeetings.filter((m) => m.category === category)
    : allMeetings;

  // 카테고리/태그 카운트는 전체 데이터 기준으로 계산
  const categories = allMeetings.reduce(
    (acc, m) => {
      acc[m.category] = (acc[m.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const tagCounts = allMeetings
    .flatMap((m) => m.tags)
    .reduce(
      (acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

  const topTags = Object.entries(tagCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([tag]) => tag);

  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans w-full mx-auto px-[220px]">
      <div className="py-[50px] px-[40px] w-[320px] shrink-0">
        <CreateMeetingButton />
        <Suspense>
          <SideFillters categories={categories} topTags={topTags} />
        </Suspense>
      </div>
      <div className="flex flex-col gap-4 flex-1 font-sans py-[50px] px-[10px]">
        {/* 타이틀 */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl text-text-signature font-bold">
              {category ? (CATEGORY_LABELS[category] ?? category) : "전체 모임"}
            </h1>
            <span className="text-sm text-text-signature mt-2">
              ({meetings.length}개)
            </span>
          </div>
          <span className="text-sm text-text-signature mt-2">
            <span className="text-signature font-bold">
              {session?.user?.name}
            </span>
            님, 관심 있는 모임에 참여해보세요.
          </span>
          <div className="w-full h-px bg-[#E0E0E0] mt-5 mb-3"></div>
        </div>
        <div className=" flex flex-col gap-4">
          {meetings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-[#8a8175]">
              <span className="text-4xl mb-4">📭</span>
              <p className="text-lg font-bold mb-1">아직 모임이 없어요</p>
              <p className="text-sm">첫 번째 모임을 만들어보세요!</p>
            </div>
          ) : (
            meetings.map((meeting) => (
              <MeetingCard
                key={meeting.id}
                meeting={meeting}
                session={session as Session}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
