import { requireUser } from "@/lib/auth/requireUser";

export default async function Home() {
  await requireUser();
  return <div className="flex flex-1 bg-[#FBF7F3] font-sans ">홈</div>;
}
