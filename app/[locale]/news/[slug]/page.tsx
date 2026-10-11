import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import StatusPill from "@/components/ui/StatusPill";
import { Link } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import { getAllSlugs, getNewsPost } from "@/lib/news";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

/**
 * 게시된 글 × 로케일을 미리 생성하고, 빌드 뒤에 HQ 에 올라온 글은 첫 요청 때 만든다.
 * 60초마다 다시 읽는다. draft 나 없는 slug 는 404.
 */
export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getAllSlugs();
  return routing.locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const res = await getNewsPost(slug, locale);
  if (res.status !== "ok") return {};
  const { post } = res;
  return pageMetadata({
    locale,
    path: `/news/${slug}`,
    title: `${post.title} | 4growth`,
    description: post.summary,
    ogImage: post.cover ? { url: post.cover, alt: post.title } : undefined,
  });
}

/** SPEC §3-5 — 소식 상세: 카테고리 pill + 날짜 + 제목 + 커버 + 본문 + 목록으로 */
export default async function NewsPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const res = await getNewsPost(slug, locale);
  if (res.status === "not-found") notFound();

  const t = await getTranslations("news");

  const backToList = (
    <div className="mt-14 border-t border-line pt-8">
      <Link href="/news" className="text-sm font-bold text-blue">
        <span aria-hidden>← </span>
        {t("backToList")}
      </Link>
    </div>
  );

  // HQ API 를 읽지 못함 — 페이지는 그대로 두고 안내만 띄운다.
  if (res.status === "error") {
    return (
      <article className="pt-[72px]">
        <div className="container-4g max-w-3xl py-16 md:py-24">
          <p className="rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink/80">
            {t("loadError")}
          </p>
          {backToList}
        </div>
      </article>
    );
  }

  const { post } = res;

  return (
    <article className="pt-[72px]">
      <div className="container-4g max-w-3xl py-16 md:py-24">
        {post.fallback && (
          <p className="mb-8 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-ink/80">
            {t("koreanOnly")}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          {post.category && <StatusPill>{t(`categories.${post.category}`)}</StatusPill>}
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
            // content/news/*.md(저장소 파일) 또는 HQ 가 만든 body_html — 둘 다 우리 쪽에서 작성한 것만 들어온다.
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {post.images.length > 0 && (
            <ul className="mt-8 space-y-5">
              {post.images.map((src) => (
                <li key={src}>
                  <Image
                    src={src}
                    alt=""
                    width={1200}
                    height={800}
                    sizes="(max-width: 768px) 100vw, 768px"
                    className="h-auto w-full rounded-2xl"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        {backToList}
      </div>
    </article>
  );
}
