import { useTranslations } from "next-intl";
import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * SPEC §6 (v0.1) — R&D (짧은 스트립). v0.2: 기술 페이지로 이동, 앵커 id `rnd`.
 * 특허번호·출원일 표는 넣지 않는다 (건수만 Field 숫자 스트립에 반영).
 */

type Area = { no: string; title: string };

export default function RnD({ no = "02" }: { no?: string }) {
  const t = useTranslations("technology.rnd");
  const label = useTranslations("labels");
  const areas = t.raw("areas") as Area[];

  return (
    <section id="rnd" className="bg-surface section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>{`${no} — ${label("rnd")}`}</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            {t("title")}
          </h2>
        </FadeIn>

        <FadeIn delay={120}>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-14 md:grid-cols-4">
            {areas.map((a) => (
              <li key={a.no} className="border-t border-line pt-4">
                <p className="label-en text-blue">{a.no}</p>
                <p className="mt-2 text-[15px] font-bold leading-snug md:text-base">
                  {a.title}
                </p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>

      {/* 섹션 하단 가로 띠 — B-01 제어반 시제품 (SPEC §10) */}
      <FadeIn delay={200} className="container-4g mt-12 md:mt-16">
        <AssetSlot
          id="B-01"
          sizes="(max-width: 768px) 100vw, 1200px"
          className="h-[160px] w-full rounded-2xl md:h-[220px]"
        />
      </FadeIn>
    </section>
  );
}
