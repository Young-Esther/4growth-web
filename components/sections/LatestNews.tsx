import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowText from "@/components/ui/ArrowText";
import NewsCard from "@/components/news/NewsCard";
import { Link } from "@/i18n/navigation";
import type { NewsMeta } from "@/lib/news";

/**
 * SPEC §3-1 5번 — 최신 소식 3건 + 전체 보기.
 * 글이 0건이면 섹션 자체를 렌더링하지 않는다.
 */
export default function LatestNews({ posts, no = "04" }: { posts: NewsMeta[]; no?: string }) {
  const t = useTranslations("home");
  const common = useTranslations("common");
  const label = useTranslations("labels");

  if (posts.length === 0) return null;

  return (
    <section className="section-4g pt-0 md:pt-0">
      <div className="container-4g">
        <FadeIn className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <SectionLabel>{`${no} — ${label("news")}`}</SectionLabel>
            <h2 className="text-[26px] font-bold leading-snug md:text-[40px]">
              {t("latestNews")}
            </h2>
          </div>
          <Link href="/news" className="group">
            <ArrowText>{common("viewAll")}</ArrowText>
          </Link>
        </FadeIn>

        <FadeIn delay={120}>
          <ul className="mt-10 grid gap-6 md:mt-14 md:grid-cols-3">
            {posts.slice(0, 3).map((post) => (
              <li key={post.slug}>
                <NewsCard post={post} />
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
