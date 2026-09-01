import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * SPEC §5 — SECTION 04 BUILT FROM THE FIELD.
 * 이 섹션만 이미지가 배경(풀폭)이고, 텍스트 오버레이 없이 이미지 아래에 온다.
 */

/**
 * 숫자 스트립 — 검증된 것만 노출한다 (SPEC §5).
 * 네 번째 칸은 친환경 화훼 인증 배지로, 숫자와 같은 스타일을 쓰되
 * 문자열이 길어 값 글자만 한 단계 줄인다 (`wide`).
 */
const STATS: { value: string; caption: string; wide?: boolean }[] = [
  { value: "4+", caption: "년 재배·출하 경험" },
  { value: "1", caption: "기술이전 (제2264047호)" },
  { value: "3", caption: "특허 출원" },
  { value: "MPS-ABC", caption: "A등급 · 친환경 화훼 인증", wide: true },
];

export default function Field() {
  return (
    <section id="field" className="scroll-mt-[72px] pb-16 md:pb-24">
      <AssetSlot
        id="P-01"
        sizes="100vw"
        className="h-[240px] w-full md:h-[480px]"
      />

      <div className="container-4g">
        <FadeIn className="pt-12 md:pt-16">
          <SectionLabel>02 — Field</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            기술의 출발점은 책상이 아니라 현장입니다
          </h2>
          <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-ink/80 md:text-base">
            포그로우스는 농업 현장에서 직접 작물을 생산하고 유통해 왔습니다. 화훼
            재배와 유통 협력 현장을 통해 축적한 4년 이상의 재배·출하 경험은 우리가
            만드는 기술의 기준이 됩니다. 어떤 데이터를 측정해야 하는지, 어떤
            자동화가 실제로 필요한지는 현장에서 반복해서 부딪혀 본 뒤에야 알 수
            있습니다.
          </p>
        </FadeIn>

        <FadeIn delay={120}>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.caption}>
                <dt className="sr-only">{s.caption}</dt>
                <dd>
                  <p
                    className={`flex h-[40px] items-end font-bold leading-none text-blue md:h-[52px] ${
                      s.wide
                        ? "text-[26px] tracking-tight md:text-[34px]"
                        : "text-[40px] md:text-[52px]"
                    }`}
                  >
                    {s.value}
                  </p>
                  <p className="mt-3 text-sm text-caption">{s.caption}</p>
                </dd>
              </div>
            ))}
          </dl>
        </FadeIn>
      </div>
    </section>
  );
}
