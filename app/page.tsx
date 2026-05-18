import Login from "@/components/toLoginButton/Login";

import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();
  return (
    <div className="flex flex-1 items-center justify-center bg-[#FBF7F3] font-sans">
      <div className="flex items-center justify-center">
        <Login />
      </div>

      {/* 로그인 전에 보여지는 화면 */}
    </div>
  );
}
