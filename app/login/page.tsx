import Login from "../../components/login/Login";
import Image from "next/image";
import loginBackground from "../../assets/login/loginLeftSession.png";

export default function LoginPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#FBF7F3] font-sans">
      <div className="flex items-center justify-center basis-1/2 ">
        <div className="flex min-h-[calc(100vh)] w-full flex-col items-center justify-center gap-6 px-4 bg-[#F8F6E9] font-sans">
          <Image
            src={loginBackground}
            alt="Login Background"
            width={250}
            height={250}
          />
          <div className="flex flex-col items-center justify-center gap-2">
            <span className="text-2xl text-[#4A4A4A] font-bold">
              <span className="text-[#D97B2C]">취향</span>이 닿는 사람들의 이웃
              동네
            </span>
            <span className="text-sm text-[#4A4A4A]">
              등산, 독서, 보드게임… 비슷한 결의 사람과 가볍게 만나는 작은 모임을
              만나보세요.
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center basis-1/2">
        <Login />
      </div>
    </div>
  );
}
