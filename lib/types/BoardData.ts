// 익명 게시판: 클라이언트로 내려가는 작성자 정보는 표시 이름과 역할만 포함한다.
// (id, authorId 등 계정을 식별할 수 있는 값은 서버에서 변환 후 제거한다)
export type PublicAuthor = {
  displayName: string;
  role: "USER" | "ADMIN";
};

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
  author: PublicAuthor;
  isMine: boolean;
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
  author: PublicAuthor;
  isMine: boolean;
  isPostAuthor: boolean;
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
  author: PublicAuthor;
  isMine: boolean;
  comments: BoardComment[];
};

export type CreateBoardPostRequest = {
  category: string;
  title: string;
  content: string;
  images?: string[];
  tags: string[];
};
