"use client";

import { useTransition } from "react";
import {
  deleteUserAction,
  changeUserRoleAction,
  deletePostAction,
  deleteMeetingAction,
} from "@/lib/admin/adminActions";

export function DeleteButton({
  id,
  type,
  label,
}: {
  id: string;
  type: "user" | "post" | "meeting";
  label: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`정말 삭제하시겠습니까?\n"${label}"`)) return;
    startTransition(async () => {
      if (type === "user") await deleteUserAction(id);
      if (type === "post") await deletePostAction(id);
      if (type === "meeting") await deleteMeetingAction(id);
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="rounded px-2 py-1 text-xs text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
    >
      {isPending ? "..." : "삭제"}
    </button>
  );
}

export function RoleToggleButton({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [isPending, startTransition] = useTransition();
  const isAdmin = currentRole === "ADMIN";

  const handleToggle = () => {
    const nextRole = isAdmin ? "USER" : "ADMIN";
    if (!confirm(`역할을 ${nextRole === "ADMIN" ? "관리자" : "일반 유저"}로 변경하시겠습니까?`)) return;
    startTransition(async () => {
      await changeUserRoleAction(userId, nextRole);
    });
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors disabled:opacity-40"
    >
      {isPending ? "..." : isAdmin ? "강등" : "승격"}
    </button>
  );
}
