import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NavBar from "@/components/navBar/NavBar";
import BottomNav from "@/components/navBar/BottomNav";
import { auth } from "@/auth";

import { AuthSessionProvider } from "@/components/auth/session-provider";
import titleLogo from "@/assets/logo/TitleLogo.png";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SOOM",
  icons: {
    icon: titleLogo.src,
  },
  description: "익명 커뮤니티",
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
  const session = await auth();
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-[#FBF7F3] pb-16 md:pb-0">
        <NavBar session={session} />
        <AuthSessionProvider>{children}</AuthSessionProvider>
        <BottomNav session={session} />
      </body>
    </html>
  );
}
