/**
 * userId를 기반으로 결정론적인 익명 닉네임을 생성합니다.
 * 동일한 userId는 항상 동일한 "지나가는 숨숨 XXXX" 형태의 이름을 반환합니다.
 */
export function getAnonymousName(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (hash * 31 + userId.charCodeAt(i)) >>> 0;
  }
  const num = (hash % 9000) + 1000; // 1000 ~ 9999
  return `지나가는 숨숨 ${num}`;
}
