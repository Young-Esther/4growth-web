import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** 소식 — 4growth HQ 공개 API 의 커버·첨부 이미지 호스트 (lib/hq.ts 는 이 origin 의 이미지만 쓴다) */
const hq = new URL(
  process.env.NEXT_PUBLIC_HQ_API_BASE || "https://4growth-hq-production.up.railway.app",
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: hq.protocol === "http:" ? "http" : "https",
        hostname: hq.hostname,
        port: hq.port,
      },
    ],
  },
};

export default withNextIntl(nextConfig);
