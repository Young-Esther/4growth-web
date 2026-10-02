import { useTranslations } from "next-intl";
import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import { Link } from "@/i18n/navigation";
import { hasAsset } from "@/lib/assets";

/**
 * SPEC §3-4 1번 — 차담 Hero. 좌 텍스트 / 우 패키지 사진 (모바일은 텍스트 → 사진).
 * 라벨 · 이름 · 슬로건 · 본문 · 뜻풀이 · CTA(구매·수입 문의 → /contact?type=chadam).
 *
 * CH-01 사진이 없으면 사진 칸을 만들지 않고 텍스트만 한 단으로 둔다.
 */
export default function ChadamHero() {
  const t = useTranslations("chadam.hero");
  const brand = useTranslations("brands.chadam");
  const label = useTranslations("labels");
  const withPhoto = hasAsset("CH-01");

  return (
    <section className="pt-[72px]">
      <div
        className={`container-4g grid items-center gap-10 py-12 md:gap-14 md:py-24 ${
          withPhoto ? "md:min-h-[75vh] md:grid-cols-2" : ""
        }`}
      >
        <FadeIn>
          <p className="label-en mb-5 text-blue">{label("brandChadam")}</p>
          <h1 className="text-[32px] font-bold leading-[1.25] tracking-[-0.01em] md:text-[52px]">
            {brand("name")}
          </h1>
          <p className="mt-3 text-xl font-medium text-ink/90 md:text-2xl">{brand("slogan")}</p>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-ink/80 md:text-lg">
            {t("body")}
          </p>
          <p className="mt-4 text-sm text-caption">{t("meaning")}</p>
          <div className="mt-9">
            <Link
              href={{ pathname: "/contact", query: { type: "chadam" } }}
              className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-7 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {t("cta")}
            </Link>
          </div>
        </FadeIn>

        {withPhoto && (
          <FadeIn delay={120}>
            <AssetSlot
              id="CH-01"
              alts={[brand("imageAlt")]}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="aspect-[4/3] w-full rounded-2xl"
            />
          </FadeIn>
        )}
      </div>
    </section>
  );
}
