import Info from "@/components/profile/info/Info";
import ProfileActivityTabs from "@/components/profile/ProfileActivityTabs";
import { requireUser } from "@/lib/auth/requireUser";
import {
  getUserBoardPosts,
  getUserBoardComments,
  getUserLikedPosts,
} from "@/lib/services/profileService";

export default async function ProfilePage() {
  const session = await requireUser();
  const userId = session.user.id;

  const [posts, comments, likedPosts] = await Promise.all([
    getUserBoardPosts(userId),
    getUserBoardComments(userId),
    getUserLikedPosts(userId),
  ]);

  return (
    <div className="flex flex-1 bg-[#FBF7F3] font-sans w-full">
      <div className="flex flex-col gap-8 w-full max-w-3xl mx-auto px-4 py-5 md:py-12 md:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl md:text-2xl font-bold text-[#2A241D]">
            마이페이지
          </h1>
        </div>

        <Info userId={userId} email={session.user?.email} />

        <ProfileActivityTabs
          posts={posts}
          comments={comments}
          likedPosts={likedPosts}
        />
      </div>
    </div>
  );
}
