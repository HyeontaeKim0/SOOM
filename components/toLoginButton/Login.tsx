import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";
export default async function Login() {
  const session = await auth();
  return (
    <div className="flex flex-1 flex-col items-center justify-center  font-sans">
      <main className="flex flex-1 flex-col items-center  bg-[#FBF7F3]">
        <div className="flex  items-center gap-4 text-center ">
          <div className="flex flex-wrap justify-center gap-3">
            {session?.user ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="cursor-pointer text-[#4A4A4A]">
                  로그아웃
                </button>
              </form>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
              >
                로그인
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
