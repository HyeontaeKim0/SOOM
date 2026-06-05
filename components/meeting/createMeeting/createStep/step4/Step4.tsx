"use client";

import type { MeetingFormData } from "@/lib/types/MeetingData";

const CATEGORY_LABELS: Record<string, string> = {
  hiking: "등산·아웃도어",
  reading: "독서",
  running: "러닝·운동",
  photo: "사진",
  boardgame: "보드게임",
  craft: "공예·핸드메이드",
  music: "음악·악기",
  cooking: "쿠킹·미식",
  language: "외국어·공부",
};

const FILTER_LABELS: Record<string, string> = {
  beginner: "🌱초보 환영",
  experienced: "🎯경험자",
  "20s": "20대",
  "30s": "30대",
  "40s": "40대 이상",
  women: "여성 한정",
  men: "남성 한정",
  family: "가족 동반",
  pet: "반려동물 동반",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "날짜 미선택";
  const d = new Date(dateStr);
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  return `${d.getMonth() + 1}월 ${d.getDate()}일 ${days[d.getDay()]}요일`;
}

interface Step4Props {
  data: MeetingFormData;
}

export default function Step4({ data }: Step4Props) {
  return (
    <>
      {/* Step Header */}
      <div className="mb-2">
        <span className="text-xs font-bold text-signature">STEP 4 / 4</span>
        <span className="text-xs text-[#8a8175]"> · 미리보기</span>
      </div>
      <h1 className="text-[26px] font-bold text-[#2A241D] leading-tight">
        이대로 게시할까요?
      </h1>
      <p className="text-[13px] text-[#8a8175] mt-1 mb-6">
        게시 전 마지막으로 한 번만 확인해주세요
      </p>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-10">
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            className="h-[3px] flex-1 rounded-full bg-signature"
          />
        ))}
      </div>

      {/* Notice */}
      <div className="flex items-start gap-3 px-5 py-4 bg-[#F4EFE6] rounded-xl mb-8">
        <span className="text-[#8a8175] text-sm mt-0.5">ⓘ</span>
        <p className="text-sm text-[#5C5246] leading-relaxed">
          모임을 게시하면 호스트로서 책임이 따라요. 모임 일정·장소를 지키고,
          참가자들과 약속한 분위기를 만들어주세요.
        </p>
      </div>

      {/* Preview Card */}
      <div className="bg-white rounded-2xl border border-[#E8E0D6] overflow-hidden">
        {/* Image */}
        {data.image ? (
          <div className="relative w-full h-56">
            <img
              src={data.image}
              alt="대표 이미지"
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 px-3 py-1 bg-signature text-white text-xs font-medium rounded-md">
              대표 이미지
            </span>
          </div>
        ) : (
          <div className="relative w-full h-56 bg-[#E8E0D6] flex items-center justify-center">
            <span className="text-sm text-[#8a8175]">이미지 미선택</span>
            <span className="absolute top-3 left-3 px-3 py-1 bg-signature text-white text-xs font-medium rounded-md">
              대표 이미지
            </span>
          </div>
        )}

        <div className="p-6">
          {/* Category & Filter Tags */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {data.category && (
              <span className="px-3 py-1 bg-[#FFF8F0] text-signature text-xs font-medium rounded-full border border-signature/30">
                {CATEGORY_LABELS[data.category] ?? data.category}
              </span>
            )}
            {data.filter.map((f) => (
              <span
                key={f}
                className="px-3 py-1 bg-[#FFF8F0] text-signature text-xs font-medium rounded-full border border-signature/30"
              >
                {FILTER_LABELS[f] ?? f}
              </span>
            ))}
          </div>

          {/* Title & Description */}
          <h2
            className={`text-xl font-bold mb-2 ${data.title ? "text-[#2A241D]" : "text-[#B8AD9E]"}`}
          >
            {data.title || "모임 제목을 입력해주세요"}
          </h2>
          <p
            className={`text-sm mb-6 ${data.description ? "text-[#5C5246]" : "text-[#B8AD9E]"}`}
          >
            {data.description || "소개글을 입력해주세요"}
          </p>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-y-5 gap-x-6 py-5 border-t border-[#E8E0D6]">
            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#8a8175] mb-1">
                <span>📅</span> 일정
              </div>
              <p className="text-sm font-bold text-[#2A241D]">
                {formatDate(data.date)}
                {data.time ? ` · ${data.time}` : ""}
              </p>
              <p className="text-xs text-[#8a8175] mt-0.5">
                {data.duration} 예상
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#8a8175] mb-1">
                <span>📍</span> 장소
              </div>
              <p className="text-sm font-bold text-[#2A241D]">
                {data.isOnline
                  ? "온라인"
                  : data.location || "장소 미입력"}
              </p>
              <p className="text-xs text-[#8a8175] mt-0.5">
                {data.isOnline
                  ? "온라인 모임"
                  : "시작 24시간 전 주소 공개"}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#8a8175] mb-1">
                <span>👥</span> 정원
              </div>
              <p className="text-sm font-bold text-[#2A241D]">
                {data.maxParticipants}명
              </p>
              <p className="text-xs text-[#8a8175] mt-0.5">호스트 포함</p>
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-xs text-[#8a8175] mb-1">
                <span>🎫</span> 참가비
              </div>
              <p className="text-sm font-bold text-[#2A241D]">{data.price}</p>
              <p className="text-xs text-[#8a8175] mt-0.5">
                {data.price === "무료" ? "비용 없음" : "현장 결제"}
              </p>
            </div>
          </div>

          {/* Hashtags */}
          {data.tags.length > 0 && (
            <div className="flex gap-2 pt-5 border-t border-[#E8E0D6] flex-wrap">
              {data.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-[#F4EFE6] text-[#5C5246] text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Host Info */}
          <div className="flex items-center gap-3 mt-5 pt-5 border-t border-[#E8E0D6]">
            <div className="w-10 h-10 rounded-full bg-[#FFF8F0] border border-signature/30 flex items-center justify-center text-signature font-bold text-sm">
              나
            </div>
            <div>
              <p className="text-sm font-bold text-[#2A241D]">나 · 호스트</p>
              <p className="text-xs text-[#8a8175]">이번이 첫 모임이에요</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
