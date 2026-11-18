import { describe, expect, it } from "vitest";
import { getInAppBrowserName, isInAppBrowser } from "@/lib/utils/inAppBrowser";

const UA = {
  kakaoAndroid:
    "Mozilla/5.0 (Linux; Android 13; SM-S918N Build/TP1A.220624.014; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36 KAKAOTALK 2511290",
  instagramIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 300.0.0.0",
  androidWebView:
    "Mozilla/5.0 (Linux; Android 13; Pixel 7 Build/TQ3A; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.0.0 Mobile Safari/537.36",
  iosWebView:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  chromeAndroid:
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
  samsungInternet:
    "Mozilla/5.0 (Linux; Android 13; SAMSUNG SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/23.0 Chrome/115.0.0.0 Mobile Safari/537.36",
  safariIos:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  desktopChrome:
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
};

describe("isInAppBrowser", () => {
  it.each([
    ["카카오톡(Android)", UA.kakaoAndroid],
    ["인스타그램(iOS)", UA.instagramIos],
    ["Android WebView(; wv)", UA.androidWebView],
    ["iOS WebView(Safari 토큰 없음)", UA.iosWebView],
  ])("%s는 인앱 브라우저로 판별한다", (_name, ua) => {
    expect(isInAppBrowser(ua)).toBe(true);
  });

  it.each([
    ["Android Chrome", UA.chromeAndroid],
    ["삼성 인터넷", UA.samsungInternet],
    ["iOS Safari", UA.safariIos],
    ["데스크톱 Chrome", UA.desktopChrome],
  ])("%s는 인앱 브라우저로 오탐하지 않는다", (_name, ua) => {
    expect(isInAppBrowser(ua)).toBe(false);
  });

  it("UA가 비어 있으면 false다", () => {
    expect(isInAppBrowser("")).toBe(false);
    expect(isInAppBrowser()).toBe(false);
  });
});

describe("getInAppBrowserName", () => {
  it("알려진 앱은 이름을 돌려준다", () => {
    expect(getInAppBrowserName(UA.kakaoAndroid)).toBe("카카오톡");
    expect(getInAppBrowserName(UA.instagramIos)).toBe("인스타그램");
  });

  it("이름은 모르지만 웹뷰이면 '앱'을 돌려준다", () => {
    expect(getInAppBrowserName(UA.androidWebView)).toBe("앱");
  });

  it("일반 브라우저는 null이다", () => {
    expect(getInAppBrowserName(UA.chromeAndroid)).toBeNull();
    expect(getInAppBrowserName(UA.samsungInternet)).toBeNull();
  });
});
