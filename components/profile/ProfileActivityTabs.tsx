"use client";

import { Tabs } from "@heroui/react";
import UserPostsSection from "@/components/profile/UserPostsSection";
import UserCommentsSection from "@/components/profile/UserCommentsSection";
import LikedPostsSection from "@/components/profile/LikedPostsSection";
import type { BoardPost } from "@/lib/types/BoardData";
import type { UserBoardComment } from "@/lib/types/ProfileData";

type ProfileActivityTabsProps = {
  posts: BoardPost[];
  comments: UserBoardComment[];
};

export default function ProfileActivityTabs({
  posts,
  comments,
}: ProfileActivityTabsProps) {
  return (
    <Tabs
      className="w-full [&_[data-slot=tabs-tab][data-selected=true]]:text-signature [&_[data-slot=tabs-tab][data-selected=true]]:font-semibold [&_[data-slot=tabs-indicator]]:bg-signature"
      variant="secondary"
    >
      <Tabs.ListContainer>
        <Tabs.List aria-label="마이페이지 활동">
          <Tabs.Tab id="posts">
            작성한 글 ({posts.length})
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="comments">
            작성한 댓글 ({comments.length})
            <Tabs.Indicator />
          </Tabs.Tab>
          <Tabs.Tab id="liked">
            좋아요한 글
            <Tabs.Indicator />
          </Tabs.Tab>
        </Tabs.List>
      </Tabs.ListContainer>
      <Tabs.Panel className="pt-4" id="posts">
        <UserPostsSection posts={posts} hideHeader />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="comments">
        <UserCommentsSection comments={comments} hideHeader />
      </Tabs.Panel>
      <Tabs.Panel className="pt-4" id="liked">
        <LikedPostsSection hideHeader />
      </Tabs.Panel>
    </Tabs>
  );
}
