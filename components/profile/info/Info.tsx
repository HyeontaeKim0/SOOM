import Image from "next/image";
import DefaultImg from "@/assets/login/DefaultImg.png";
import { getAnonymousName } from "@/lib/utils/anonymousName";

type ProfileInfoProps = {
  userId: string;
  email: string | null | undefined;
};

export default function Info({ userId, email }: ProfileInfoProps) {
  const anonymousName = getAnonymousName(userId);

  return (
    <section className="flex flex-col gap-4 rounded-2xl bg-white border border-gray-100 shadow-sm px-6 py-6 w-full">
      <h2 className="text-sm font-semibold text-[#8C8478]">내 정보</h2>
      <div className="flex items-center gap-4">
        <Image
          src={DefaultImg}
          alt="프로필"
          width={56}
          height={56}
          className="rounded-full shrink-0"
        />
        <div className="flex flex-col gap-1 min-w-0">
          <span className="text-lg font-bold text-[#2A241D]">
            {anonymousName}
          </span>
          <span className="text-sm text-[#8C8478] truncate">
            {email ?? "이메일 정보 없음"}
          </span>
        </div>
      </div>
    </section>
  );
}
