"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import MyProfile from "./component/myProfile/MyProfile";
import SearchInput from "./component/searchInput/SearchInput";
import SSOModal, { useOverlayState } from "@/components/auth/SSOModal";

import Logo from "@/assets/logo/BetaLogo.png";
import Image from "next/image";

export default function NavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const loginModalState = useOverlayState();

  return (
    <>
      <div className="flex items-center px-5   bg-white border-b border-[#F0EBE4] sticky top-0 z-40">
        <div className="flex items-center justify-between w-full mt-3">
          <div className="flex items-center gap-4 md:gap-6">
            <Link href="/board" className="">
              <Image src={Logo} alt="logo" width={80} />
            </Link>
          </div>

          <div className="flex items-center gap-1">
            {session ? (
              <MyProfile session={session} />
            ) : (
              <button
                onClick={loginModalState.open}
                className="rounded-full bg-[#2A241D] px-4 py-1.5 md:px-5 md:py-2 text-sm font-semibold text-white hover:bg-[#3D3530] transition-colors cursor-pointer"
              >
                시작하기
              </button>
            )}
          </div>
        </div>
      </div>
      <SSOModal state={loginModalState} />
    </>
  );
}
