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
  ogImage = { url: "/assets/og.png", alt: "4GROWTH", width: 1200, height: 630 },
}: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** 없으면 v0.1 공용 OG (1200×630). 소식 상세는 대표 이미지 — 크기를 모르면 width/height 를 뺀다. */
  ogImage?: { url: string; alt: string; width?: number; height?: number };
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
      images: [ogImage],
    },
  };
}
