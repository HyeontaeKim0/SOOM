export type UserBoardComment = {
  id: string;
  content: string;
  createdAt: Date | string;
  post: {
    id: string;
    title: string;
  };
};
