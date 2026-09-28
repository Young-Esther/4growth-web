import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import ArrowText from "@/components/ui/ArrowText";
import BrandCard from "@/components/sections/BrandCard";
import { Link } from "@/i18n/navigation";
import { BRANDS } from "@/lib/brands";

/**
 * SPEC §3-1 4번 — 홈 사업영역 미리보기. 카드 2장 가로 배치.
 *  (좌) 기술 적용처: 네 라벨 나열 → /business
 *  (우) 브랜드: 차담 카드 (사진 + 이름 + 슬로건) → /business/chadam
 * 홈에 브랜드는 이 카드 1장까지만 (SPEC §0 원칙).
 */
export default function BusinessPreview({ no = "03" }: { no?: string }) {
  const t = useTranslations("home.preview");
  const business = useTranslations("business");
  const common = useTranslations("common");
  const label = useTranslations("labels");

  const applicationLabels = (business.raw("applications") as { label: string }[]).map(
    (a) => a.label,
  );
  const [featuredBrand] = BRANDS;

  return (
    <section className="section-4g">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>{`${no} — ${label("business")}`}</SectionLabel>
        </FadeIn>

        <FadeIn delay={120}>
          <div className="mt-6 grid gap-6 md:mt-8 md:grid-cols-2">
            <Link
              href="/business"
              className="group flex flex-col rounded-2xl bg-surface p-6 transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(35,31,32,0.35)] md:p-8"
            >
              <p className="mb-4 text-sm font-bold text-caption">{t("applications")}</p>
              <span aria-hidden className="mb-5 block h-1.5 w-10 rounded-full bg-blue" />
              <ul className="space-y-3">
                {applicationLabels.map((l) => (
                  <li key={l} className="label-en text-[15px] text-ink md:text-base">
                    {l}
                  </li>
                ))}
              </ul>
              <div className="mt-auto pt-8">
                <ArrowText>{common("learnMore")}</ArrowText>
              </div>
            </Link>

            {featuredBrand && <BrandCard brand={featuredBrand} compact heading={t("brands")} />}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
