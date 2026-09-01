import type { Metadata, Viewport } from "next";
import "./globals.css";
import { siteUrl } from "@/lib/site";

const TITLE =
  "4growth 포그로우스 — 모듈형 스마트팜 A-Block · DLight · AI Farm OS";
const DESCRIPTION =
  "농업 현장에서 발견한 문제를 하드웨어와 소프트웨어로 해결합니다. 모듈형 스마트팜 A-Block, DLI 기반 LED 제어 DLight, 재배 데이터 통합 플랫폼 AI Farm OS.";

// SPEC §11 — SEO · 메타
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "4GROWTH",
    title: TITLE,
    description: DESCRIPTION,
    // TODO(SPEC §10, OG): 1200×630 OG 이미지를 public/assets/og.png 에 넣는다.
    //   (Hero 이미지 + 로고로 제작). 파일 전까지는 경로만 잡아 둔 상태.
    images: [{ url: "/assets/og.png", width: 1200, height: 630, alt: "4GROWTH" }],
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        {/* SPEC §1 — Pretendard (jsdelivr CDN, font-display: swap) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
