import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getAllSlugs } from "@/lib/news";
import { siteUrl } from "@/lib/site";

/** 로케일을 뺀 정적 페이지 경로 ("" 는 홈) */
const PAGES = ["", "/technology", "/business", "/business/chadam", "/news", "/contact"];

/** HQ 소식 slug 를 60초마다 다시 읽는다 */
export const revalidate = 60;

/**
 * SPEC §5 — 모든 로케일 × 모든 페이지 + 게시된 소식 글(파일 + HQ). draft 는 제외된다.
 * 항목마다 hreflang 대체 주소(ko/en/vi + x-default → ko)를 함께 적는다.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = [...PAGES, ...(await getAllSlugs()).map((slug) => `/news/${slug}`)];

  return paths.flatMap((path) => {
    const languages: Record<string, string> = Object.fromEntries(
      routing.locales.map((l) => [l, `${siteUrl}/${l}${path}`]),
    );
    languages["x-default"] = `${siteUrl}/${routing.defaultLocale}${path}`;

    return routing.locales.map((locale) => ({
      url: `${siteUrl}/${locale}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
      alternates: { languages },
    }));
  });
}
