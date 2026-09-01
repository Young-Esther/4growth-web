import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * SPEC §6 — SECTION 05 R&D (짧은 스트립).
 * 특허번호·출원일 표는 v0.1에 넣지 않는다 (건수만 §5 숫자 스트립에 반영).
 */

const AREAS = [
  { no: "01", title: "모듈형 재배 구조 설계" },
  { no: "02", title: "광량 기반 에너지 최적 제어" },
  { no: "03", title: "영상 인식 기반 병해 진단" },
  { no: "04", title: "재배 데이터 분석 및 리포팅" },
];

export default function RnD() {
  return (
    <section className="bg-surface section-4g">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>03 — R&amp;D</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            기술이전과 자체 개발을 병행합니다.
          </h2>
        </FadeIn>

        <FadeIn delay={120}>
          <ul className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-14 md:grid-cols-4">
            {AREAS.map((a) => (
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
