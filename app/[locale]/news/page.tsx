import { Suspense } from "react";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/sections/PageIntro";
import NewsCard from "@/components/news/NewsCard";
import NewsList, { NewsListView } from "@/components/news/NewsList";
import type { Locale } from "@/i18n/routing";
import { getNewsList, NEWS_CATEGORIES } from "@/lib/news";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

/** HQ 소식을 60초마다 다시 읽는다 (lib/hq.ts) */
export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/news",
    title: `${t("common.nav.news")} | 4growth`,
    description: t("news.body"),
  });
}

/** SPEC §3-5 — 소식 목록. 페이지 헤더 + 카테고리 칩(?category=) + 카드 리스트 (날짜 내림차순). */
export default async function NewsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("news");
  const label = await getTranslations("labels");

  const { posts, hqError } = await getNewsList(locale);
  const items = posts.map((post) => ({
    key: post.slug,
    category: post.category,
    card: <NewsCard post={post} />,
  }));
  const categories = NEWS_CATEGORIES.filter((c) => posts.some((p) => p.category === c));

  return (
    <>
      <PageIntro label={label("news")} title={t("title")} body={t("body")} />
      {hqError && (
        <section className="section-4g pb-0 pt-10 md:pb-0 md:pt-14">
          <div className="container-4g">
            <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink/80">
              {t("loadError")}
            </p>
          </div>
        </section>
      )}
      {/* 게시 글이 0건이면 목록 자리를 만들지 않는다 (SPEC §7) */}
      {posts.length > 0 && (
        <section className="section-4g pt-10 md:pt-14">
          <div className="container-4g">
            <Suspense
              fallback={<NewsListView items={items} categories={categories} selected={null} />}
            >
              <NewsList items={items} categories={categories} />
            </Suspense>
          </div>
        </section>
      )}
    </>
  );
}
