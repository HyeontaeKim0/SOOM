"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

async function requireAdmin() {
  const session = await auth();
  if (!session || session.user.role !== "ADMIN") {
    throw new Error("권한이 없습니다.");
  }
}

export async function deleteUserAction(userId: string) {
  await requireAdmin();
  await prisma.user.delete({ where: { id: userId } });
  revalidatePath("/admin/users");
}

export async function deletePostAction(postId: string) {
  await requireAdmin();
  await prisma.boardPost.delete({ where: { id: postId } });
  revalidatePath("/admin/posts");
}

export async function deleteMeetingAction(meetingId: string) {
  await requireAdmin();
  await prisma.meeting.delete({ where: { id: meetingId } });
  revalidatePath("/admin/meetings");
}

export async function changeUserRoleAction(
  userId: string,
  role: "USER" | "ADMIN"
) {
  await requireAdmin();
  await prisma.user.update({ where: { id: userId }, data: { role } });
  revalidatePath("/admin/users");
}
