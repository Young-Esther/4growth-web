import type { Metadata } from "next";
import { routing, type Locale } from "@/i18n/routing";

const OG_LOCALE: Record<Locale, string> = { ko: "ko_KR", en: "en_US", vi: "vi_VN" };

/**
 * SPEC §5 — 페이지별 canonical + hreflang(ko/en/vi) + x-default(→ ko) + OG.
 * `path` 는 로케일을 뺀 경로 ("" 는 홈).
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
}): Metadata {
  const languages: Record<string, string> = Object.fromEntries(
    routing.locales.map((l) => [l, `/${l}${path}`]),
  );
  languages["x-default"] = `/${routing.defaultLocale}${path}`;

  return {
    title,
    description,
    alternates: { canonical: `/${locale}${path}`, languages },
    openGraph: {
      type: "website",
      locale: OG_LOCALE[locale],
      alternateLocale: routing.locales.filter((l) => l !== locale).map((l) => OG_LOCALE[l]),
      url: `/${locale}${path}`,
      siteName: "4GROWTH",
      title,
      description,
      // v0.1 OG 이미지 공용 (SPEC §5). 차담 전용 OG 는 CH-01 사진 확보 후.
      images: [{ url: "/assets/og.png", width: 1200, height: 630, alt: "4GROWTH" }],
    },
  };
}
