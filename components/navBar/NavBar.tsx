"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import type { Session } from "next-auth";
import Image from "next/image";
import { Button } from "@heroui/react";
import MyProfile from "./component/myProfile/MyProfile";

export default function NavBar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  return (
    <div className="flex items-center gap-6 p-4 bg-[#Ffff]">
      <div className="flex items-center gap-6 justify-between w-full">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-2xl text-[#D97B2C] font-bold">LOGO</span>
          </div>
          <div className="flex items-center space-x-2">
            <Link
              href="/home"
              className={`text-l font-bold text-[#4A4A4A] rounded-lg px-4 py-1 ${pathname === "/home" ? "bg-[#F4EFE6]" : ""}`}
            >
              홈
            </Link>
            <Link
              href="/meeting"
              className={`text-l font-bold text-[#4A4A4A] rounded-lg px-4 py-1 ${pathname === "/meeting" ? "bg-[#F4EFE6]" : ""}`}
            >
              모임
            </Link>
            <Link
              href="/board"
              className={`text-l font-bold text-[#4A4A4A] rounded-lg px-4 py-1 ${pathname === "/board" ? "bg-[#F4EFE6]" : ""}`}
            >
              게시판
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <MyProfile
            session={session as Session}
            signOutAction={signOutAction}
          />
        </div>
      </div>
    </div>
  );
}
