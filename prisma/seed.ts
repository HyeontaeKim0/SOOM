import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const SEED_USERS = [
  {
    email: "seed-user-1@unnieside.internal",
    nickname: "새벽러너지은",
    bio: "워킹맘 · 새벽 러닝이 유일한 나만의 시간",
  },
  {
    email: "seed-user-2@unnieside.internal",
    nickname: "혼행러민지",
    bio: "30대 비혼 · 혼자 여행 좋아해요",
  },
  {
    email: "seed-user-3@unnieside.internal",
    nickname: "커피앤북",
    bio: "주말엔 카페에서 책 읽기",
  },
  {
    email: "seed-user-4@unnieside.internal",
    nickname: "이직준비중",
    bio: "마케터 7년차 · 다음 커리어 고민 중",
  },
  {
    email: "seed-user-5@unnieside.internal",
    nickname: "주말요리사",
    bio: "1인 가구 · 집밥이 최고의 취미",
  },
] as const;

type SeedPost = {
  authorEmail: (typeof SEED_USERS)[number]["email"];
  category: "free" | "question" | "review" | "info";
  title: string;
  content: string;
  tags: string[];
  daysAgo: number;
  viewCount?: number;
  likeCount?: number;
};

const SEED_POSTS: SeedPost[] = [
  {
    authorEmail: "seed-user-1@unnieside.internal",
    category: "free",
    title: "새벽 6시 러닝 시작한 지 3주 됐어요",
    content:
      "처음엔 정말 힘들었는데, 이제는 오히려 이 시간이 없으면 하루가 허전해요. 아이들 깨기 전 40분만 달리는데 기분이 확 달라집니다. 비슷하게 운동 시작하신 분 계신가요?",
    tags: ["러닝", "워킹맘", "아침루틴"],
    daysAgo: 12,
    viewCount: 34,
    likeCount: 5,
  },
  {
    authorEmail: "seed-user-1@unnieside.internal",
    category: "question",
    title: "직장인 러닝 크루 추천 부탁드려요",
    content:
      "강남·송파 쪽에서 평일 새벽이나 토요일 아침에 같이 뛸 수 있는 크루 있을까요? 초보 페이스(6분30초~7분)라 부담 없는 분위기면 좋겠어요.",
    tags: ["러닝", "모임추천"],
    daysAgo: 8,
    viewCount: 21,
    likeCount: 2,
  },
  {
    authorEmail: "seed-user-2@unnieside.internal",
    category: "review",
    title: "제주 혼행 3박4일 후기 (비혼 30대 기준)",
    content:
      "처음 혼자 제주 갔는데 생각보다 외롭지 않았어요. 렌트카 빌려서 동쪽 해안 드라이브하고, 성산일출봉은 일출 말고 오후에 가니 한적했습니다. 혼행 처음이시면 숙소는 시내 근처 추천해요.",
    tags: ["혼행", "제주", "후기"],
    daysAgo: 10,
    viewCount: 58,
    likeCount: 11,
  },
  {
    authorEmail: "seed-user-2@unnieside.internal",
    category: "free",
    title: "친구 결혼식 다녀온 날의 기분",
    content:
      "축하는 진심인데 집에 와서 왠지 모르게 공허했어요. 나이 들수록 라이프스타일이 달라지는 게 느껴지는 순간이더라고요. 비슷한 감정 겪어보신 분들 어떻게 넘기셨나요?",
    tags: ["일상", "30대"],
    daysAgo: 5,
    viewCount: 42,
    likeCount: 8,
  },
  {
    authorEmail: "seed-user-3@unnieside.internal",
    category: "info",
    title: "서울 독서하기 좋은 카페 3곳",
    content:
      "1) 성수 ○○서점 카페 — 책 분위기 좋고 콘센트 많음\n2) 연남 △△로스터리 — 조용하고 의자 편함\n3) 망원 □□브런치 — 주말 오전 한산\n혼자 가도 부담 없고, 노트북보다 책 들고 가기 좋아요.",
    tags: ["카페", "독서", "서울"],
    daysAgo: 14,
    viewCount: 67,
    likeCount: 14,
  },
  {
    authorEmail: "seed-user-3@unnieside.internal",
    category: "question",
    title: "한 달에 책 한 권 읽기, 현실적으로 가능할까요?",
    content:
      "독서 모임 가입해볼까 하는데 출퇴근+집안일 하면 하루 끝이 너무 빨리 와요. 직장인 분들 책 읽는 루틴이 궁금합니다.",
    tags: ["독서", "루틴"],
    daysAgo: 6,
    viewCount: 29,
    likeCount: 4,
  },
  {
    authorEmail: "seed-user-4@unnieside.internal",
    category: "free",
    title: "7년차 마케터, 이직 고민 중입니다",
    content:
      "브랜드 마케팅만 해왔는데 요즘은 프로덕트 쪽도 끌리고, 스타트업도 궁금하고… 30대 중반 커리어 전환, 혼자 고민하기엔 막막해서 글 남겨봅니다.",
    tags: ["커리어", "이직", "30대"],
    daysAgo: 9,
    viewCount: 51,
    likeCount: 7,
  },
  {
    authorEmail: "seed-user-4@unnieside.internal",
    category: "info",
    title: "이직 준비할 때 도움 됐던 것들",
    content:
      "포트폴리오는 '성과 숫자' 위주로 정리했고, 면접 전에 지원 회사 최근 뉴스 3개는 꼭 읽었어요. 커피챗은 부담 갖지 말고 짧게 요청하는 게 좋았습니다. 더 궁금한 거 있으면 댓글 주세요.",
    tags: ["이직", "커리어"],
    daysAgo: 3,
    viewCount: 38,
    likeCount: 9,
  },
  {
    authorEmail: "seed-user-5@unnieside.internal",
    category: "free",
    title: "1인 가구 밀프렙 첫 도전",
    content:
      "일요일에 3일치 도시락 만들어봤어요. 닭가슴살·브로콜리·고구마 조합은 무난했는데, 금요일 점심이 좀 심심했네요. 1인 가구 식단 레시피 공유해주실 분!",
    tags: ["요리", "1인가구", "밀프렙"],
    daysAgo: 11,
    viewCount: 33,
    likeCount: 6,
  },
  {
    authorEmail: "seed-user-5@unnieside.internal",
    category: "review",
    title: "주말 글쓰기 모임 4주 다녀왔어요",
    content:
      "에세이 초보라 걱정했는데 '하루 200자만 쓰기'로 시작해서 부담이 적었어요. 피드백이 따뜻해서 다음 시즌도 연장할 예정입니다. 글쓰기 막막하신 분께 추천해요.",
    tags: ["글쓰기", "모임후기"],
    daysAgo: 7,
    viewCount: 45,
    likeCount: 10,
  },
  {
    authorEmail: "seed-user-1@unnieside.internal",
    category: "info",
    title: "워킹맘을 위한 짧은 자기시간 아이디어",
    content:
      "① 출근 전 20분 산책 ② 점심시간 카페 15분 ③ 퇴근 후 샤워 전 스트레칭 5분. 완벽한 루틴보다 '매일 조금'이 오래 갑니다.",
    tags: ["워킹맘", "자기관리"],
    daysAgo: 4,
    viewCount: 27,
    likeCount: 5,
  },
  {
    authorEmail: "seed-user-3@unnieside.internal",
    category: "free",
    title: "금요일 저녁, 혼자 영화 보는 게 최고",
    content:
      "친구들 다들 가족 모임 가는 주말 전날, 저는 영화관 혼자 가요. 편하고 좋아요. 혼자 있는 시간 즐기는 법, 다들 어떻게 하고 계세요?",
    tags: ["일상", "혼자시간"],
    daysAgo: 2,
    viewCount: 19,
    likeCount: 3,
  },
  {
    authorEmail: "seed-user-2@unnieside.internal",
    category: "question",
    title: "30대 비혼 모임, 처음 참여할 때 팁 있을까요?",
    content:
      "관심은 있는데 낯가림이 심해서 망설여지네요. 온라인으로 먼저 인사하는 게 나을까요, 아니면 그냥 현장에서 자연스럽게 섞이는 게 나을까요?",
    tags: ["모임", "비혼"],
    daysAgo: 1,
    viewCount: 15,
    likeCount: 2,
  },
  {
    authorEmail: "seed-user-4@unnieside.internal",
    category: "question",
    title: "스터디 모임 vs 라운드테이블, 어떤 게 나을까요?",
    content:
      "커리어 고민 나누고 싶은데 스터디는 부담스럽고, 라운드테이블은 깊은 대화가 될지 모르겠어요. 비슷한 고민 있으신 분 조언 부탁드려요.",
    tags: ["모임", "커리어"],
    daysAgo: 13,
    viewCount: 22,
    likeCount: 1,
  },
  {
    authorEmail: "seed-user-5@unnieside.internal",
    category: "info",
    title: "집들이 대신 '브런치 초대' 어떠세요?",
    content:
      "청소 부담 때문에 집들이를 안 했는데, 카페에서 브런치 사서 만나니 훨씬 편했어요. 소규모 3~4명이 딱 좋았습니다.",
    tags: ["모임", "1인가구"],
    daysAgo: 15,
    viewCount: 31,
    likeCount: 6,
  },
];

function daysAgoDate(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(10 + (days % 8), (days * 7) % 60, 0, 0);
  return date;
}

async function main() {
  const userByEmail = new Map<string, string>();

  for (const user of SEED_USERS) {
    const record = await prisma.user.upsert({
      where: { email: user.email },
      create: {
        email: user.email,
        nickname: user.nickname,
        bio: user.bio,
        emailVerified: new Date(),
      },
      update: {
        nickname: user.nickname,
        bio: user.bio,
      },
    });
    userByEmail.set(user.email, record.id);
    console.log(`✓ 사용자: ${user.nickname}`);
  }

  let created = 0;
  let skipped = 0;

  for (const post of SEED_POSTS) {
    const authorId = userByEmail.get(post.authorEmail);
    if (!authorId) continue;

    const existing = await prisma.boardPost.findFirst({
      where: { title: post.title, authorId },
    });

    if (existing) {
      skipped++;
      continue;
    }

    await prisma.boardPost.create({
      data: {
        category: post.category,
        title: post.title,
        content: post.content,
        tags: [...post.tags],
        authorId,
        viewCount: post.viewCount ?? 0,
        likeCount: post.likeCount ?? 0,
        createdAt: daysAgoDate(post.daysAgo),
        updatedAt: daysAgoDate(post.daysAgo),
      },
    });
    created++;
    console.log(`  + 글: ${post.title}`);
  }

  console.log(`\n완료 — 새 글 ${created}개, 기존 글 ${skipped}개 건너뜀`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
