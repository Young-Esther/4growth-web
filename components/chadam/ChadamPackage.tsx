import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import ImageCarousel from "@/components/ui/ImageCarousel";
import { ASSETS, type AssetImage } from "@/lib/assets";

/**
 * SPEC §3-4 3번 — 패키지. 사진 1장(또는 캐러셀) + 2줄 설명 (24시간 시계 다이얼 모티프).
 * 사진은 CH-02(4종 티백) · CH-03(연출컷) 중 들어온 것만 쓴다. 하나도 없으면 사진 칸 없이 글만.
 *
 * TODO(SPEC 0-1 · [확인 필요]): 티백 개수가 확정되면 구성 줄을 추가한다.
 *   COPY: `구성: 4종 · 티백 4g × [확인 필요]` / `Contents: 4 blends · 4g tea bags × [TBD]` /
 *         `Thành phần: 4 loại · túi lọc 4g × [TBD]` — messages 에 `chadam.package.contents` 로 넣고 여기서 렌더.
 * TODO(SPEC 0-1): 베트남 수입·유통 파트너 모집 문구 노출이 결정되면 COPY §선택 문구를 추가한다.
 */
export default function ChadamPackage() {
  const t = useTranslations("chadam.package");

  const photos = (["CH-02", "CH-03"] as const)
    .map((id) => ASSETS[id])
    .flatMap((entry): AssetImage[] => (entry ? (Array.isArray(entry) ? entry : [entry]) : []));
  const withPhoto = photos.length > 0;

  return (
    <section className="bg-surface section-4g">
      <div
        className={`container-4g grid items-center gap-10 md:gap-14 ${
          withPhoto ? "md:grid-cols-2" : ""
        }`}
      >
        <FadeIn>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">{t("body")}</p>
        </FadeIn>

        {withPhoto && (
          <FadeIn delay={120}>
            <ImageCarousel
              images={photos}
              aspect="4 / 3"
              sizes="(max-width: 768px) 100vw, 50vw"
              className="w-full overflow-hidden rounded-2xl"
            />
          </FadeIn>
        )}
      </div>
    </section>
  );
}
