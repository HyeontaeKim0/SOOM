"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { Session } from "next-auth";
import { Flame, Clipboard, UserPen } from "lucide-react";
import SSOModal, { useOverlayState } from "@/components/auth/SSOModal";

const navItemClassName =
  "flex flex-col items-center justify-center gap-0.5 flex-1 h-full active:bg-[#F5F0EB] transition-colors";

const navItems = [
  {
    href: "/board",
    label: "게시판",
    icon: (active: boolean) => (
      <Clipboard className={active ? "text-signature" : "text-[#8C8478]"} />
    ),
  },
  {
    href: "/hot",
    label: "인기",
    icon: (active: boolean) => (
      <Flame className={active ? "text-signature" : "text-[#8C8478]"} />
    ),
  },
  {
    href: "/profile",
    label: "프로필",
    requiresAuth: true,
    icon: (active: boolean) => (
      <UserPen className={active ? "text-signature" : "text-[#8C8478]"} />
    ),
  },
];

export default function BottomNav({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const router = useRouter();
  const loginModalState = useOverlayState();

  const handleProfilePress = () => {
    if (session) {
      router.push("/profile");
    } else {
      loginModalState.open();
    }
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#E8E2DA] md:hidden">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              pathname.startsWith(item.href + "/");

            if (item.requiresAuth && !session) {
              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={handleProfilePress}
                  className={navItemClassName}
                >
                  {item.icon(false)}
                  <span className="text-[10px] font-semibold text-[#8C8478]">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={navItemClassName}
              >
                {item.icon(isActive)}
                <span
                  className={`text-[10px] font-semibold ${
                    isActive ? "text-signature" : "text-[#8C8478]"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
      <SSOModal state={loginModalState} />
    </>
  );
}
