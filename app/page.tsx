import Image from "next/image";
import Link from "next/link";

import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  console.log("로그인 세션", session);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-1 flex-col items-center justify-between bg-white px-16 py-32 dark:bg-black sm:items-start">
        <div className="flex  items-center gap-4 text-center sm:items-start sm:text-left">
          <div className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            {session?.user ? (
              <div className="flex items-center gap-2 ">
                {session.user.image && (
                  <>
                    <Image
                      src={session.user.image}
                      alt="User Image"
                      width={32}
                      height={32}
                    />
                  </>
                )}
                <span className="font-medium text-zinc-950 dark:text-zinc-50">
                  {session.user.name ?? session.user.email}
                </span>
              </div>
            ) : (
              <>로그인하지 않았습니다.</>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
            {session?.user ? (
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
                >
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
