import { requireUser } from "@/lib/auth/requireUser";

export default async function BoardCreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return children;
}
