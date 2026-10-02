import { useTranslations } from "next-intl";
import AssetSlot from "@/components/ui/AssetSlot";
import ArrowText from "@/components/ui/ArrowText";
import StatusPill from "@/components/ui/StatusPill";
import { Link } from "@/i18n/navigation";
import type { Brand } from "@/lib/brands";

/**
 * SPEC §3-3 — 브랜드 카드: 패키지 사진(4:3) + 이름(+ 상태 태그) + 슬로건 + 1줄 설명 + 자세히 보기.
 * 사진 슬롯이 비어 있으면 사진 자리를 만들지 않고 글만 보인다.
 * `compact` 는 홈 미리보기용 (사진 + 이름 + 슬로건, SPEC §3-1 4번).
 */
export default function BrandCard({
  brand,
  compact = false,
  heading,
}: {
  brand: Brand;
  compact?: boolean;
  /** 카드 맨 위 작은 제목 (홈 미리보기의 "브랜드") */
  heading?: string;
}) {
  const t = useTranslations(`brands.${brand.slug}`);
  const common = useTranslations("common");
  const root = useTranslations();

  return (
    <Link
      href={brand.href}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface transition-shadow hover:shadow-[0_16px_40px_-24px_rgba(35,31,32,0.35)]"
    >
      <AssetSlot
        id={brand.image}
        alts={[t("imageAlt")]}
        sizes="(max-width: 768px) 100vw, 50vw"
        className="aspect-[4/3] w-full"
      />
      <div className="flex flex-1 flex-col p-6 md:p-8">
        {heading && <p className="mb-4 text-sm font-bold text-caption">{heading}</p>}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-[22px] font-bold md:text-[26px]">{t("name")}</p>
          {brand.status && <StatusPill>{root(brand.status)}</StatusPill>}
        </div>
        <p className="mt-1.5 text-[15px] text-blue">{t("slogan")}</p>
        {!compact && <p className="mt-4 text-sm leading-relaxed text-ink/70">{t("desc")}</p>}
        <div className="mt-auto pt-6">
          <ArrowText>{common("learnMore")}</ArrowText>
        </div>
      </div>
    </Link>
  );
}
