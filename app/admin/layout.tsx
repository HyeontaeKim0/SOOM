import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    redirect("/board");
  }

  return (
    <div className="flex min-h-screen bg-[#FBF7F3]">
      {/* 사이드바 */}
      <aside className="hidden md:flex w-56 flex-col border-r border-gray-200 bg-white px-4 py-6 shrink-0">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#d97b2c]">
            SOOM Admin
          </span>
        </div>
        <nav className="flex flex-col gap-1 text-sm font-medium">
          <AdminNavItem href="/admin" label="대시보드" />
          <AdminNavItem href="/admin/users" label="유저 관리" />
          <AdminNavItem href="/admin/posts" label="게시글 관리" />
          <AdminNavItem href="/admin/posts/create" label="공지 작성" />
          <AdminNavItem href="/admin/meetings" label="모임 관리" />
        </nav>
        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link
            href="/board"
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            ← 서비스로 돌아가기
          </Link>
        </div>
      </aside>

      {/* 모바일 상단 탭 */}
      <div className="flex flex-col flex-1 min-w-0">
        <div className="md:hidden flex items-center gap-1 border-b border-gray-200 bg-white px-4 py-2 text-xs font-medium overflow-x-auto scrollbar-hide">
          <MobileNavItem href="/admin" label="대시보드" />
          <MobileNavItem href="/admin/users" label="유저" />
          <MobileNavItem href="/admin/posts" label="게시글" />
          <MobileNavItem href="/admin/posts/create" label="공지" />
          <MobileNavItem href="/admin/meetings" label="모임" />
          <Link
            href="/board"
            className="ml-auto shrink-0 text-gray-400 hover:text-gray-600 px-2 py-1"
          >
            ← 서비스
          </Link>
        </div>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}

function AdminNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-md px-3 py-2 text-gray-600 hover:bg-[#FBF7F3] hover:text-[#d97b2c] transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileNavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="shrink-0 rounded-md px-3 py-1.5 text-gray-600 hover:bg-[#FBF7F3] hover:text-[#d97b2c] transition-colors"
    >
      {label}
    </Link>
  );
}
