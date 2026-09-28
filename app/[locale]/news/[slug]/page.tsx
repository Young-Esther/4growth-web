import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StatusPill from "@/components/ui/StatusPill";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { getNewsPost, getPublishedSlugs } from "@/lib/news";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

/** 게시된 글 × 로케일만 정적 생성한다. draft 나 없는 slug 는 404. */
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getPublishedSlugs().map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getNewsPost(slug, locale);
  if (!post) return {};
  return pageMetadata({
    locale,
    path: `/news/${slug}`,
    title: `${post.title} | 4growth`,
    description: post.summary,
  });
}

/** SPEC §3-5 — 소식 상세: 카테고리 pill + 날짜 + 제목 + 커버 + 본문 + 목록으로 */
export default async function NewsPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const post = await getNewsPost(slug, locale);
  if (!post) notFound();

  const t = await getTranslations("news");

  return (
    <article className="pt-[72px]">
      <div className="container-4g max-w-3xl py-16 md:py-24">
        {post.fallback && (
          <p className="mb-8 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink/80">
            {t("koreanOnly")}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill>{t(`categories.${post.category}`)}</StatusPill>
          <time dateTime={post.date} className="text-sm text-caption">
            {formatDate(post.date, locale)}
          </time>
        </div>

        <div lang={post.fallback ? "ko" : undefined}>
          <h1 className="mt-5 text-[26px] font-bold leading-snug md:text-[36px]">{post.title}</h1>

          {post.cover && (
            <Image
              src={post.cover}
              alt=""
              width={1200}
              height={675}
              priority
              sizes="(max-width: 768px) 100vw, 768px"
              className="mt-8 aspect-[16/9] w-full rounded-2xl object-cover"
            />
          )}

          <div
            className="news-body mt-8"
            // content/news/*.md 는 저장소 안의 파일만 읽는다 (외부 입력 없음).
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </div>

        <div className="mt-14 border-t border-line pt-8">
          <Link href="/news" className="text-sm font-bold text-blue">
            <span aria-hidden>← </span>
            {t("backToList")}
          </Link>
        </div>
      </div>
    </article>
  );
}
