/** KST(Asia/Seoul) 기준 오늘 날짜. Prisma @db.Date 저장용(UTC 자정). */
export function getTodayKST(): Date {
  const dateStr = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
  }).format(new Date());
  return new Date(`${dateStr}T00:00:00.000Z`);
}
