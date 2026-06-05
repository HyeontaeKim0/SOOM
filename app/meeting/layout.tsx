import { requireUser } from "@/lib/auth/requireUser";

export default async function MeetingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return children;
}
