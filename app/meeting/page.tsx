import { auth } from "@/auth";
import { Button } from "@heroui/react";

export default async function MeetingPage() {
  const session = await auth();
  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans ">
      <div className="py-[50px] px-[50px]">
        <Button className="bg-[#2A241D] text-white rounded-xl w-[250px] h-[50px]">
          + 새 모임 만들기
        </Button>
      </div>
      <div className="flex flex-col gap-4 flex-1  font-sans py-[50px]">
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
        </div>
        {/* 모임 리스트 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">dd</div>
        </div>
      </div>
    </div>
  );
}
