import { redirect } from "next/navigation";
import type { Session } from "next-auth";

import { auth } from "@/auth";

export async function requireUser(): Promise<
  Session & { user: { id: string } }
> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    redirect("/board");
  }

  return {
    ...session,
    user: { ...session!.user, id: userId },
  };
}
