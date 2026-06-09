import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/navBar/NavBar";
import BottomNav from "@/components/navBar/BottomNav";

import { AuthSessionProvider } from "@/components/auth/session-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import titleLogo from "@/assets/logo/TitleLogo.png";
import { getSiteUrl } from "@/lib/utils/siteUrl";
import "./globals.css";

const SITE_DESCRIPTION =
  "20-30대 라이프스테이지 기반 커뮤니티. 게시판, 모임, 인기 글을 통해 결이 맞는 사람들과 연결하세요.";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: "잠깐 앉는 계단 - SOOM",
    template: "SOOM",
  },
  icons: {
    icon: titleLogo.src,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "SOOM",
    title: "잠깐 앉는 계단 - SOOM",
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: "잠깐 앉는 계단 - SOOM",
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    // 구글 서치콘솔 소유권 확인 토큰 (공개 값 — HTML에 그대로 노출되는 식별자)
    google: "DkO8dCaDmpCVBJRENNM1akxaBU8G8ORSvUW3FMa175U",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FBF7F3] pb-16 md:pb-0">
        <AuthSessionProvider>
          <QueryProvider>
            <NavBar />
            {children}
            <BottomNav />
          </QueryProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}
