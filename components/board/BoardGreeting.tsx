"use client";

import { useSession } from "next-auth/react";

import { getAnonymousName } from "@/lib/utils/anonymousName";

export default function BoardGreeting() {
  const { data: session } = useSession();
  const userId = session?.user?.id;

  if (!userId) {
    return <>자유롭게 이야기를 나눠보세요.</>;
  }

  return (
    <>
      <span className="text-signature font-bold">
        {getAnonymousName(userId)}
      </span>{" "}
      님, 자유롭게 이야기를 나눠보세요.
    </>
  );
}
