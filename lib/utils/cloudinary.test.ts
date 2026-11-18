import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getOptimizedCloudinaryUrl,
  isCloudinaryImageUrl,
} from "@/lib/utils/cloudinary";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("isCloudinaryImageUrl", () => {
  const valid =
    "https://res.cloudinary.com/mycloud/image/upload/v1/soom/board/abc.png";

  it("설정된 클라우드의 https 이미지 URL만 허용한다", () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "mycloud");

    expect(isCloudinaryImageUrl(valid)).toBe(true);
  });

  it("다른 클라우드, http, 다른 호스트, 잘못된 값은 거부한다", () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "mycloud");

    expect(
      isCloudinaryImageUrl(valid.replace("/mycloud/", "/other/")),
    ).toBe(false);
    expect(isCloudinaryImageUrl(valid.replace("https://", "http://"))).toBe(
      false,
    );
    expect(
      isCloudinaryImageUrl("https://evil.example.com/mycloud/image/upload/x.png"),
    ).toBe(false);
    expect(isCloudinaryImageUrl("not a url")).toBe(false);
  });

  it("CLOUDINARY_CLOUD_NAME이 없으면 항상 거부한다", () => {
    vi.stubEnv("CLOUDINARY_CLOUD_NAME", "");

    expect(isCloudinaryImageUrl(valid)).toBe(false);
  });
});

describe("getOptimizedCloudinaryUrl", () => {
  const url = "https://res.cloudinary.com/mycloud/image/upload/v1/a.png";

  it("Cloudinary URL에는 변환 옵션을 끼워 넣는다", () => {
    const result = getOptimizedCloudinaryUrl(url, { width: 400 });

    expect(result).toContain("/upload/");
    expect(result).toContain("w_400");
    expect(result).toContain("f_auto");
  });

  it("Cloudinary가 아닌 URL은 그대로 돌려준다", () => {
    expect(getOptimizedCloudinaryUrl("https://example.com/a.png")).toBe(
      "https://example.com/a.png",
    );
  });
});
