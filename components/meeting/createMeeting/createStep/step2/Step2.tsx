"use client";

import { useState } from "react";
import type { MeetingFormData } from "@/lib/types/MeetingData";

const TIME_SLOTS = [
  "06:00",
  "09:00",
  "11:00",
  "14:00",
  "17:00",
  "19:00",
  "20:00",
  "21:00",
];

const DURATION_OPTIONS = [
  "1시간",
  "1시간 30분",
  "2시간",
  "2시간 30분",
  "3시간",
  "4시간",
  "5시간 이상",
];

const REGIONS = [
  "서울특별시",
  "경기도",
  "인천광역시",
  "부산광역시",
  "대구광역시",
  "대전광역시",
  "광주광역시",
  "울산광역시",
  "세종특별자치시",
  "강원도",
  "충청북도",
  "충청남도",
  "전라북도",
  "전라남도",
  "경상북도",
  "경상남도",
  "제주특별자치도",
];

const DAY_LABELS = ["일", "월", "화", "수", "목", "금", "토"];

function getCalendarDays(year: number, month: number) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  return days;
}

interface Step2Props {
  data: MeetingFormData;
  onChange: (partial: Partial<MeetingFormData>) => void;
}

export default function Step2({ data, onChange }: Step2Props) {
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [region, setRegion] = useState("서울특별시");
  const [locationQuery, setLocationQuery] = useState(data.location);

  const calendarDays = getCalendarDays(calYear, calMonth);

  const selectedDay = (() => {
    if (!data.date) return null;
    const d = new Date(data.date);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth)
      return d.getDate();
    return null;
  })();

  const selectDate = (day: number) => {
    const m = String(calMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange({ date: `${calYear}-${m}-${d}` });
  };

  const prevMonth = () => {
    if (calMonth === 0) {
      setCalYear((y) => y - 1);
      setCalMonth(11);
    } else {
      setCalMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (calMonth === 11) {
      setCalYear((y) => y + 1);
      setCalMonth(0);
    } else {
      setCalMonth((m) => m + 1);
    }
  };

  const isToday = (day: number) =>
    day === today.getDate() &&
    calMonth === today.getMonth() &&
    calYear === today.getFullYear();

  return (
    <>
      {/* Step Header */}
      <div className="mb-2">
        <span className="text-xs font-bold text-signature">STEP 2 / 4</span>
        <span className="text-xs text-[#8a8175]"> · 일정·장소</span>
      </div>
      <h1 className="text-[26px] font-bold text-[#2A241D] leading-tight">
        언제, 어디서 만날까요?
      </h1>
      <p className="text-[13px] text-[#8a8175] mt-1 mb-6">
        날짜와 시간, 만날 장소를 정해주세요
      </p>

      {/* Progress Bar */}
      <div className="flex gap-1 mb-10">
        {[0, 1, 2, 3].map((step) => (
          <div
            key={step}
            className={`h-[3px] flex-1 rounded-full ${
              step <= 1 ? "bg-signature" : "bg-[#E5DDD3]"
            }`}
          />
        ))}
      </div>

      {/* Date & Time */}
      <section className="mb-8">
        <label className="text-sm font-bold text-[#2A241D] mb-3 block">
          날짜 <span className="text-signature">*</span>
        </label>

        <div className="flex gap-6 flex-col md:flex-row">
          {/* Calendar */}
          <div className="border border-[#E8E0D6] rounded-xl bg-white p-4 flex-1">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={prevMonth}
                className="text-[#5C5246] hover:text-[#2A241D] p-1 cursor-pointer"
              >
                ←
              </button>
              <span className="text-sm font-bold text-[#2A241D]">
                {calYear}년 {calMonth + 1}월
              </span>
              <button
                type="button"
                onClick={nextMonth}
                className="text-[#5C5246] hover:text-[#2A241D] p-1 cursor-pointer"
              >
                →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center">
              {DAY_LABELS.map((label, i) => (
                <span
                  key={label}
                  className={`text-xs font-medium pb-2 ${
                    i === 0
                      ? "text-[#C06E25]"
                      : i === 6
                        ? "text-[#4A7EBF]"
                        : "text-[#8a8175]"
                  }`}
                >
                  {label}
                </span>
              ))}

              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <span key={`empty-${idx}`} />;
                }

                const dayOfWeek = idx % 7;
                const selected = selectedDay === day;
                const todayMark = isToday(day);

                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => selectDate(day)}
                    className={`relative w-9 h-9 mx-auto flex items-center justify-center text-sm rounded-full transition-colors cursor-pointer ${
                      selected
                        ? "bg-signature text-white font-bold"
                        : todayMark
                          ? "font-bold text-[#2A241D]"
                          : dayOfWeek === 0
                            ? "text-[#C06E25]"
                            : dayOfWeek === 6
                              ? "text-[#4A7EBF]"
                              : "text-[#2A241D] hover:bg-[#F4EFE6]"
                    }`}
                  >
                    {day}
                    {todayMark && !selected && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-signature" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="flex-1 flex flex-col gap-6">
            <div>
              <label className="text-sm font-bold text-[#2A241D] mb-3 block">
                시간
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TIME_SLOTS.map((time) => {
                  const selected = data.time === time;
                  return (
                    <button
                      key={time}
                      type="button"
                      onClick={() => onChange({ time })}
                      className={`py-2.5 rounded-xl text-sm font-medium border transition-colors cursor-pointer ${
                        selected
                          ? "bg-signature text-white border-signature"
                          : "bg-white text-[#5C5246] border-[#E8E0D6] hover:border-[#C8B89E]"
                      }`}
                    >
                      {time}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-bold text-[#2A241D] mb-3 block">
                소요 시간
              </label>
              <select
                value={data.duration}
                onChange={(e) => onChange({ duration: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-[#E8E0D6] bg-white text-sm text-[#2A241D] focus:outline-none focus:border-signature transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%235C5246%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_16px_center]"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-bold text-[#2A241D]">
            장소 <span className="text-signature">*</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <div
              className={`relative w-10 h-5 rounded-full transition-colors ${
                data.isOnline ? "bg-signature" : "bg-[#D5CFC5]"
              }`}
              onClick={() => onChange({ isOnline: !data.isOnline })}
            >
              <div
                className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  data.isOnline ? "translate-x-5" : "translate-x-0.5"
                }`}
              />
            </div>
            <span className="text-sm text-[#5C5246]">온라인 모임</span>
          </label>
        </div>

        {!data.isOnline && (
          <div className="flex flex-col gap-3">
            <div className="flex gap-2">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="px-4 py-3 rounded-xl border border-[#E8E0D6] bg-white text-sm text-[#2A241D] focus:outline-none focus:border-signature transition-colors cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%235C5246%22%20d%3D%22M2%204l4%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-position-[right_16px_center] pr-10 min-w-[140px]"
              >
                {REGIONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>

              <div className="flex flex-1 gap-2">
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => {
                    setLocationQuery(e.target.value);
                    onChange({ location: e.target.value });
                  }}
                  placeholder="장소명을 검색해주세요 (예: 북한산 우이동 분소)"
                  className="flex-1 px-4 py-3 rounded-xl border border-[#E8E0D6] bg-white text-sm text-[#2A241D] placeholder:text-[#B8AD9E] focus:outline-none focus:border-signature transition-colors"
                />
                <button
                  type="button"
                  className="px-4 py-3 bg-[#2A241D] text-white text-sm font-medium rounded-xl hover:bg-[#1A170F] transition-colors cursor-pointer shrink-0"
                >
                  지도 검색
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 px-4 py-3 bg-[#F4EFE6] rounded-xl">
              <span className="text-[#8a8175] text-sm">ⓘ</span>
              <span className="text-xs text-[#8a8175]">
                상세 주소는 모임 시작 24시간 전 참가자에게만 공개돼요.
              </span>
            </div>
          </div>
        )}

        {data.isOnline && (
          <div className="flex flex-col gap-3">
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange({ location: e.target.value })}
              placeholder="온라인 모임 링크를 입력해주세요 (예: Zoom, Google Meet)"
              className="w-full px-4 py-3 rounded-xl border border-[#E8E0D6] bg-white text-sm text-[#2A241D] placeholder:text-[#B8AD9E] focus:outline-none focus:border-signature transition-colors"
            />
          </div>
        )}
      </section>
    </>
  );
}
