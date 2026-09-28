import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import StatusPill from "@/components/ui/StatusPill";
import { Link } from "@/i18n/navigation";
import type { Locale } from "@/i18n/routing";
import { formatDate } from "@/lib/format";
import type { NewsMeta } from "@/lib/news";

/** SPEC §3-5 — 소식 카드: 커버(있을 때만) · 카테고리 pill · 날짜 · 제목 · 요약 */
export default function NewsCard({ post }: { post: NewsMeta }) {
  const t = useTranslations("news.categories");
  const locale = useLocale() as Locale;

  return (
    <Link
      href={`/news/${post.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(35,31,32,0.35)]"
    >
      {post.cover && (
        <Image
          src={post.cover}
          alt=""
          width={1200}
          height={675}
          sizes="(max-width: 768px) 100vw, 33vw"
          className="aspect-[16/9] w-full object-cover"
        />
      )}
      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-center gap-3">
          <StatusPill>{t(post.category)}</StatusPill>
          <time dateTime={post.date} className="text-sm text-caption">
            {formatDate(post.date, locale)}
          </time>
        </div>
        {/* ko 폴백 글은 본문 언어를 표시해 보조기기가 한국어로 읽게 한다 */}
        <div lang={post.fallback ? "ko" : undefined}>
          <p className="mt-4 text-[17px] font-bold leading-snug group-hover:text-blue md:text-lg">
            {post.title}
          </p>
          {post.summary && (
            <p className="mt-3 text-sm leading-relaxed text-ink/70">{post.summary}</p>
          )}
        </div>
      </div>
    </Link>
  );
}
