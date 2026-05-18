import { signIn } from "@/auth";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          로그인
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Google 계정으로 계속합니다.
        </p>
      </div>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/" });
        }}
      >
        <button
          type="submit"
          className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200"
        >
          Google로 로그인
        </button>
      </form>
      <Link
        href="/"
        className="text-sm text-zinc-500 underline-offset-4 hover:text-zinc-700 hover:underline dark:hover:text-zinc-300"
      >
        홈으로
      </Link>
    </div>
  );
}
