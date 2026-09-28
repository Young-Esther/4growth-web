import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";
import BrandCard from "@/components/sections/BrandCard";
import { BRANDS } from "@/lib/brands";

/**
 * TODO(SPEC 0-1 · [확인 필요]): 차담 판매 주체(포그로우스 / 꽃양꽃색) 확정 후 true.
 *   COPY 의 브랜드 소개 1줄에 `[확인 필요: 판매 주체에 따라 조정]` 이 붙어 있어,
 *   확정 전에는 세 언어 모두 그 줄을 렌더링하지 않는다. 문구는 messages `business.brands.body`.
 */
const SHOW_BRANDS_BODY = false;

/**
 * SPEC §3-3 3번 — `02 — BRANDS`. 헤드라인 + 1줄 본문 + 카드 그리드 (데스크톱 2열, 모바일 1열).
 * 카드는 lib/brands.ts 에 있는 만큼만. 빈 카드나 "Coming soon" 자리를 만들지 않는다.
 */
export default function Brands({ no = "02" }: { no?: string }) {
  const t = useTranslations("business.brands");
  const label = useTranslations("labels");

  return (
    <section id="brands" className="section-4g scroll-mt-[72px] pt-0 md:pt-0">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>{`${no} — ${label("brands")}`}</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            {t("title")}
          </h2>
          {SHOW_BRANDS_BODY && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">{t("body")}</p>
          )}
        </FadeIn>

        <FadeIn delay={120}>
          <ul className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2">
            {BRANDS.map((brand) => (
              <li key={brand.slug}>
                <BrandCard brand={brand} />
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
