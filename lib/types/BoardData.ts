export type BoardPost = {
  id: string;
  category: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date | string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  _count: {
    comments: number;
  };
};

export type BoardComment = {
  id: string;
  content: string;
  createdAt: Date | string;
  parentId: string | null;
  depth: number;
  commentLikeCount: number;
  isLiked?: boolean;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies: BoardComment[];
};

export type BoardPostDetail = {
  id: string;
  category: string;
  title: string;
  content: string;
  images: string[];
  tags: string[];
  viewCount: number;
  likeCount: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
  comments: BoardComment[];
};

export type CreateBoardPostRequest = {
  category: string;
  title: string;
  content: string;
  images?: string[];
  tags: string[];
};
