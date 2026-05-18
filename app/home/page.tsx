import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Login from "@/components/toLoginButton/Login";
import Image from "next/image";
export default async function Home() {
  const session = await auth();
  if (!session) {
    redirect("/login");
  }
  return <div className="flex flex-1 bg-[#FBF7F3] font-sans ">홈</div>;
}
