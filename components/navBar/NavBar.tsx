"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/actions/auth";
import type { Session } from "next-auth";

import MyProfile from "./component/myProfile/MyProfile";
import SearchInput from "./component/searchInput/SearchInput";
import SSOModal, { useOverlayState } from "@/components/auth/SSOModal";

import Logo from "@/assets/logo/BetaLogo.png";
import Image from "next/image";

export default function NavBar({ session }: { session: Session | null }) {
  const pathname = usePathname();
  const loginModalState = useOverlayState();

  return (
    <>
      <div className="flex items-center px-5   bg-white border-b border-[#F0EBE4] sticky top-0 z-40">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/board" className="mt-1">
              <Image src={Logo} alt="logo" width={80} />
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {session ? (
              <MyProfile session={session} signOutAction={signOutAction} />
            ) : (
              <button
                onClick={loginModalState.open}
                className="rounded-full bg-[#2A241D] px-4 py-1.5 md:px-5 md:py-2 text-sm font-semibold text-white hover:bg-[#3D3530] transition-colors cursor-pointer"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
      <SSOModal state={loginModalState} />
    </>
  );
}
