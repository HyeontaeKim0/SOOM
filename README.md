# SOOM (숨 돌리는 곳)

> **가치관이 맞는 모임장과 모임을 추천해주는, 20-30대 라이프스테이지 기반 커뮤니티·모임 앱**

기존 모임 앱(소모임·문토)이 카테고리로 모임을 찾는 곳이라면, SOOM은 **가치관으로 사람(모임장)을 찾고, 그 모임장의 모임에 들어가는** 서비스를 목표로 합니다.

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 프레임워크 | [Next.js 16](https://nextjs.org) (App Router) |
| 언어 | TypeScript |
| UI | React 19, [HeroUI](https://heroui.com), Tailwind CSS 4 |
| 데이터 | PostgreSQL, [Prisma ORM](https://www.prisma.io) |
| 인증 | [Auth.js (NextAuth v5)](https://authjs.dev) — Google OAuth, JWT 세션 |
| 상태 관리 | TanStack React Query |
| 이미지 | Cloudinary |
| 배포 (예정) | Vercel + Neon |

---

## 구현 현황

### 커뮤니티

- 익명 게시판 (카테고리: 공지·자유·질문·후기·정보, 태그, 글쓰기·수정·삭제)
- 게시글 이미지 첨부 (Cloudinary 업로드)
- 댓글·대댓글, 게시글·댓글 좋아요
- 익명 닉네임 (`지나가는 숨숨 XXXX` 형태, 관리자는 "관리자" 표시)
- 인기 게시물 (`/hot` — 일별 조회수 기준)
- 알림 (댓글·답글, 폴링 갱신)
- 마이페이지 (내 글·댓글·좋아요한 글)

### 모임

- 모임 목록·카테고리 필터·태그
- 4단계 모임 생성 플로우 (카테고리, 상세, 일정·장소, 태그·필터)

### 인증·관리

- Google 로그인
- 관리자 대시보드 (`/admin` — 유저·게시글·모임 통계 및 관리)
- ADMIN 역할 기반 미들웨어 접근 제어

### SEO

- `sitemap.xml` (게시글 자동 반영, 1시간 revalidate)
- `robots.txt`
- 페이지별 메타데이터

### 미구현 (로드맵)

- 검색 (UI만 존재)
- 가치관 프로필 온보딩·매칭 알고리즘
- 모임 신청·채팅·후기
- 본인 인증
- Vercel + Neon 프로덕션 배포

---

## 프로젝트 구조

```
app/
├── board/          # 게시판 (목록, 상세, 글쓰기)
├── hot/            # 인기 게시물
├── meeting/        # 모임 (목록, 생성)
├── profile/        # 마이페이지
├── admin/          # 관리자 (대시보드, 유저·게시글·모임)
└── api/            # REST API (board, meeting, notifications, upload, auth)

components/         # UI 컴포넌트 (board, meeting, navBar, profile, auth 등)
lib/
├── services/       # 비즈니스 로직 (board, meeting, profile, notification)
├── admin/          # 관리자 서비스·액션
└── utils/          # 유틸 (카테고리, 익명 이름, Cloudinary 등)
prisma/             # 스키마, 마이그레이션, 시드
```

---

## 로컬 개발 환경 설정

### 사전 요구사항

- Node.js 20+
- Docker (로컬 PostgreSQL용)

### 1. 의존성 설치

```bash
npm install
```

### 2. PostgreSQL 실행

```bash
docker compose up -d postgres
```

로컬 DB: `postgresql://postgres:postgres@localhost:5431/soom`

### 3. 환경 변수

`.env.example`을 복사해 `.env`를 만듭니다.

```bash
cp .env.example .env
```

| 변수 | 설명 |
|------|------|
| `DATABASE_URL` | PostgreSQL 연결 URL (로컬: pooled와 동일) |
| `DIRECT_URL` | Prisma migrate용 direct connection URL |
| `AUTH_SECRET` | Auth.js 시크릿 (`openssl rand -base64 32`) |
| `AUTH_GOOGLE_ID` | Google OAuth 클라이언트 ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth 클라이언트 시크릿 |
| `AUTH_URL` | 배포 환경 기준 URL (OAuth 콜백) |
| `NEXT_PUBLIC_SITE_URL` | 사이트 공개 URL (sitemap·OG) |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary 클라우드 이름 |
| `CLOUDINARY_API_KEY` | Cloudinary API 키 |
| `CLOUDINARY_API_SECRET` | Cloudinary API 시크릿 |

### 4. DB 마이그레이션 및 시드

```bash
npm run db:migrate
npm run db:seed   # 선택
```

### 5. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) — 기본 진입점은 `/board`입니다.

---

## npm 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | 개발 서버 |
| `npm run build` | 프로덕션 빌드 |
| `npm run start` | 프로덕션 서버 |
| `npm run lint` | ESLint |
| `npm run db:migrate` | Prisma migrate dev |
| `npm run db:deploy` | Prisma migrate deploy (프로덕션) |
| `npm run db:studio` | Prisma Studio |
| `npm run db:seed` | 시드 데이터 삽입 |

---

## 배포 (Vercel + Neon)

1. [Neon](https://neon.tech)에서 PostgreSQL 프로젝트 생성
2. `DATABASE_URL`(pooled), `DIRECT_URL`(direct) 설정
3. Vercel에 프로젝트 연결 후 환경 변수 등록
4. `AUTH_URL`, `NEXT_PUBLIC_SITE_URL`을 배포 도메인으로 설정
5. 빌드 시 `prisma migrate deploy` 실행 (`postinstall`에서 `prisma generate` 자동 실행)

---

## 서비스 컨셉 (요약)

### 타겟

- **20대 후반 ~ 30대 직장인** (코어: 30대 비혼·비출산)
- 기존 모임 앱의 카테고리 중심 구조, 라이프스타일·가치관 불일치 문제 해결

### 핵심 차별화 — 가치관 매칭

- 온보딩 질문(30~50개)으로 가치관 프로필 생성, 민감 항목은 비공개 옵션
- 참가자 전원 매칭 대신 **모임장 가치관** 기준 매칭
- 모임장 검증·교육·등급 시스템 (Phase 1)

### 포지셔닝

- Do: "결이 맞는 사람들의 모임", "비슷한 처지의 사람들과 깊이 연결"
- Don't: 폐쇄적·배타적 이미지, 부정적 어워더리스

---

## 로드맵

| 단계 | 내용 |
|------|------|
| **현재 (베타)** | 커뮤니티, 모임 목록·생성, 관리자, Google 로그인 |
| **Phase 1** | 가치관 온보딩, 모임장 매칭 추천, 모임 신청·채팅, 본인 인증 |
| **Phase 2** | 검색, 모임장 팔로우, 정기 모임(시즌제), 추천 알고리즘 고도화 |
| **Phase 3** | 오프라인 모임 수수료, 브랜드 제휴, 프리미엄 기능 |

---

## 다음 액션

- [x] 커뮤니티 MVP (게시판·댓글·알림·인기)
- [x] 모임 목록·생성
- [x] 관리자 대시보드
- [x] SEO (sitemap, robots, 메타)
- [ ] Vercel + Neon 배포
- [ ] 검색 기능
- [ ] 가치관 질문 30개 설계
- [ ] 매칭 알고리즘 로직 구체화
- [ ] 모임장 검증·온보딩 프로세스
- [ ] 본인 인증 방식 확정

---

*문서 버전 1.2 · 2026-06 기준*
