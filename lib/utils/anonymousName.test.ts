import { describe, expect, it } from "vitest";
import { getAnonymousName, getDisplayName } from "@/lib/utils/anonymousName";

describe("getAnonymousName", () => {
  it("같은 userId는 항상 같은 이름을 만든다", () => {
    expect(getAnonymousName("user-1")).toBe(getAnonymousName("user-1"));
  });

  it("'지나가는 숨숨 XXXX'(1000~9999) 형식이다", () => {
    const name = getAnonymousName("cmwlzr6tu00009zq7e0example");
    const num = Number(name.replace("지나가는 숨숨 ", ""));

    expect(name).toMatch(/^지나가는 숨숨 \d{4}$/);
    expect(num).toBeGreaterThanOrEqual(1000);
    expect(num).toBeLessThanOrEqual(9999);
  });
});

describe("getDisplayName", () => {
  it("관리자는 닉네임보다 우선해서 '관리자'로 표시한다", () => {
    expect(
      getDisplayName({ userId: "u", role: "ADMIN", nickname: "닉네임" }),
    ).toBe("관리자");
  });

  it("닉네임이 있으면 닉네임을 쓴다", () => {
    expect(
      getDisplayName({ userId: "u", role: "USER", nickname: "숨쉬는사람" }),
    ).toBe("숨쉬는사람");
  });

  it("닉네임이 없거나 비어 있으면 익명 이름으로 대체한다", () => {
    const anonymous = getAnonymousName("u");

    expect(getDisplayName({ userId: "u", role: "USER" })).toBe(anonymous);
    expect(getDisplayName({ userId: "u", role: "USER", nickname: "" })).toBe(
      anonymous,
    );
    expect(getDisplayName({ userId: "u", role: null, nickname: null })).toBe(
      anonymous,
    );
  });
});
