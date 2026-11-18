# 작업 기록 (WORKLOG)

작업이 끝날 때마다 **최신 항목이 위로** 오도록 추가합니다. 작성 규칙은 [CLAUDE.md](../CLAUDE.md)를 참고하세요.
비밀번호·API 키·토큰 등 시크릿과 개인정보는 적지 않습니다.

방향: **커뮤니티(A) 먼저 → 이후 모임 완성·가치관 매칭(B)**. 모임 관련 작업은 A 단계 동안 보류합니다.

---

## 2026-11-18 · CI 수정: typecheck가 깨끗한 checkout에서 실패

- **왜**: push 후 GitHub Actions가 실패했다. 로컬에서는 통과했는데, `next-env.d.ts`(PNG 등 이미지 import 타입 선언)가 gitignore라 깨끗하게 checkout한 CI에는 없어 `Cannot find module '*.png'` 타입 에러가 났다. 로컬에는 `next dev`가 만들어 둔 파일이 있어 가려져 있었다.
- **무엇을**: `typecheck` 스크립트를 `next typegen && tsc --noEmit`으로 변경(로컬·CI가 같은 명령을 사용). 워크플로는 그대로 `npm run typecheck`.
- **검증**: `git archive HEAD`로 깨끗한 사본을 만들고 CI와 같은 npm 10으로 `npm ci` → lint → typecheck → test를 실행. 수정 전에는 typecheck에서 PNG 모듈 에러 7건으로 실패를 재현했고, 수정 후 모두 통과(exit 0). 실제 GitHub Actions 재실행은 push 후 확인 필요. 실패 로그는 직접 보지 못했고(`gh` 없음) 재현으로 원인을 특정했다.
- **남은 일 / 메모**: 교훈 — CI 검증은 "내 폴더"가 아니라 깨끗한 checkout에서 해야 한다(gitignore된 생성 파일에 의존하지 않는지).

## 2026-11-18 · 기반: 테스트·CI 도입, lint 에러 정리

- **왜**: 테스트가 없어서 익명성 수정처럼 큰 변경도 수동으로만 확인해야 했고, push 때 자동 검사가 없었다. 프로젝트 전체 lint에는 에러 1건이 있어 CI에 올릴 수 없는 상태였다.
- **무엇을**
  - `components/common/InAppBrowserNotice.tsx`: `useEffect` 안 동기 `setState`(lint 에러)를 `useSyncExternalStore`로 교체, `sessionStorage` 접근에 try/catch 추가, 안 쓰는 `appName` 제거. 문구·동작은 그대로.
  - vitest 도입(`vitest.config.mts`, `npm test`·`test:watch`·`typecheck` 스크립트). 최신 vitest 5는 `@types/node ^22` 이상을 요구해 프로젝트의 `^20`과 충돌해서 **vitest 4**를 사용.
  - 테스트 43개(DB 없이 검증 가능한 순수 로직): `boardPresenter`(익명성 회귀 방지 포함), `anonymousName`, `inAppBrowser`(삼성 인터넷 오탐 방지 등), `cloudinary` 유틸, `boardPost` 검증
  - `.github/workflows/ci.yml`: push(main)·PR마다 `npm ci` → lint → typecheck → test (Node 22)
- **검증**: 로컬에서 lint(에러 0, 경고 13) / typecheck / test 43개 통과 / `npm ci --dry-run` 통과 / YAML 문법 확인. 테스트가 실제로 회귀를 잡는지 확인하려고 `authorId`가 새도록 일부러 깨뜨려 보니 해당 테스트가 실패했고, 원복 후 통과.
- **남은 일 / 메모**
  - **GitHub Actions는 push 후에야 실행되므로 아직 실제 실행을 확인하지 못했다.** 첫 실행 결과를 확인할 것.
  - CI에 `next build`는 넣지 않았다: 목록 페이지가 빌드 시점에 DB를 조회해 DB 없이는 실패한다. 필요하면 CI에 Postgres 서비스를 붙여 추가.
  - 서비스·API 계층(Prisma 사용)은 아직 테스트가 없다. 이후 작업(신고·검색 등)에서 DB 포함 테스트 방식을 정할 것.
  - lint 경고 13개는 기존 미사용 변수 등이며 이번에 손대지 않음.
  - 다음은 쓰기 API 레이트 리밋(글·댓글·업로드)

## 2026-11-18 · 기반: `.env.example`·README 보강

- **왜**: 새로 clone한 뒤 `.env`가 없어 로그인·DB·이미지 업로드가 순서대로 실패했고, `.env.example`에 Cloudinary 항목이 빠져 있었으며 DB 이름도 docker-compose와 달랐다.
- **무엇을**
  - `.env.example`: DB 이름을 `soom`으로 통일, Cloudinary 3개 변수 추가
  - `README.md`: 로컬 개발 시 참고 사항(운영 값 금지, `AUTH_URL`은 비움, Google 리디렉션 URI, Cloudinary 같은 계정 조건) 추가
- **검증**: 문서 변경만이라 별도 테스트 없음
- **남은 일 / 메모**: 다음은 테스트·CI 도입

## 2026-11-18 · 익명성: 게시판 응답에서 작성자 식별 값 제거

- **왜**: 화면은 익명 닉네임이지만 API 응답·서버 렌더 데이터에 실명·프로필 사진·계정 id가 그대로 있어 글쓴이를 추적할 수 있었다.
- **무엇을** (커밋 `4cfebe8`, `e848b7c`, `d2967df`)
  - `name`, `image` 제거 → `author.id`, `authorId` 제거(A안)
  - `lib/utils/boardPresenter.ts` 추가: 서버가 `displayName`, `isMine`, `isPostAuthor`만 계산해 내려줌(화이트리스트 변환)
  - 알림 `actorId` → `actorName`
  - 이미지 업로드 파일명을 `${userId}-…`에서 무작위 UUID로 변경
- **검증**: `tsc`, `eslint` 통과. 로컬에서 임시 댓글로 목록 API·목록/인기/상세 HTML에 id·authorId·구글 사진이 없음을 확인. 로그인 상태 동작(수정·삭제 버튼, 댓글 삭제, 대댓글, 마이페이지, 새 이미지 파일명)은 사용자가 직접 확인.
- **남은 일 / 메모**
  - 변경 전에 올라간 기존 이미지 URL에는 사용자 id가 남아 있음(배포 데이터 작업이라 보류, 결정 필요)
  - 모임 호스트(`meetingService.ts`)는 `name`·`image`를 공개 중 — 모임 정책은 B 단계에서 결정

## 2026-11-18 · DB: `User.role` 마이그레이션 누락 수정

- **왜**: 관리자 기능 커밋이 스키마에만 `Role`/`User.role`을 추가하고 마이그레이션이 없어, 마이그레이션만으로 만든 새 DB에서 로그인이 `column User.role does not exist`로 실패했다.
- **무엇을** (커밋 `979edb4`): `20260609000000_add_user_role` 추가. 이미 있으면 건너뛰는(멱등) SQL이라 배포 DB에도 안전.
- **검증**: 임시 DB 두 개로 확인 — 새 DB 전체 적용 후 스키마 차이 없음 / `role`이 이미 있는 DB에서도 에러 없음.
- **남은 일 / 메모**: 빈 마이그레이션 `20260605160000_add_board_post_images`는 배포 DB에 기록돼 있을 수 있어 그대로 둠(삭제·수정 금지).

## 2026-11-18 · 로컬 환경 복구 및 리뷰 반영

- **왜**: 이 폴더는 새로 clone된 사본이라 gitignore된 `.env`가 없어 로컬에서 DB·로그인·이미지 업로드가 모두 실패했다. 배포는 Vercel 환경변수를 써서 정상이었다.
- **무엇을**
  - 로컬 `.env` 구성(로컬 Docker DB, 인증, Google OAuth, Cloudinary) — 파일은 gitignore라 커밋 대상 아님
  - 코드 리뷰(reviewer) 반영: 안드로이드 웹뷰 판별 오탐 수정, 이미지 업로드 전 형식·크기 검증, `SSOModal` hydration 불일치 수정
  - `.claude/agents/planner.md`, `reviewer.md`, 프롬프트 로그 hook 추가(로그는 gitignore)
- **검증**: `tsc`, `eslint` 통과, 로컬 로그인·이미지 업로드 동작 확인
- **남은 일 / 메모**: 에러 원인이 모두 환경변수 누락이었고, Vercel 민감 변수는 값을 다시 볼 수 없어 원본 서비스(Google·Cloudinary)에서 가져와야 함

## 2026-11-18 · 방향 결정

- **결정**: 커뮤니티(A) 먼저 → 모임 완성·가치관 매칭(B). 가치관 온보딩만 먼저 하는 안(C)은 채택하지 않음.
- **A 단계 순서**: ① `.env.example`·README ② 테스트·CI ③ 쓰기 API 레이트 리밋 ④ 신고·운영 관리 ⑤ 검색 ⑥ 목록 페이지네이션 ⑦ 인앱 브라우저 가입 전환 ⑧ 알림 개선·인기글·지표
- **병행(코드 아님)**: 모임장 후보 확보, 가치관 문항(10~15개) 설계
- **미정**: A→B 전환 기준 지표
