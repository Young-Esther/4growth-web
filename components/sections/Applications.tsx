import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * SPEC §7 — SECTION 06 APPLICATIONS.
 * 카드 = 영문 라벨 + 한글명 + 2줄 설명. 사진 없음 (아이콘 또는 컬러 블록).
 */

const CARDS = [
  {
    en: "Production",
    ko: "생산·재배",
    desc: "작물과 현장 환경에 맞춘 모듈 구성. 대규모 시설을 한 번에 짓기 어려울 때 모듈 단위로 시작합니다.",
  },
  {
    en: "Education",
    ko: "교육",
    desc: "소형 모듈과 제어·데이터 화면으로 구성. 작물을 기르는 과정이 곧 기술을 다루는 과정이 됩니다.",
  },
  {
    en: "AgTech Startup",
    ko: "기술 창업",
    desc: "모듈 단위 도입과 데이터 기반 운영. 농업 기반 창업을 준비하는 개인·팀을 위한 장비와 소프트웨어.",
  },
  {
    en: "Public Project",
    ko: "공공 프로젝트",
    desc: "지자체·공공기관과의 스마트농업 사업 공동 기획 및 실증.",
  },
];

export default function Applications() {
  return (
    <section id="applications" className="section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>04 — Applications</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            같은 기술이 다른 현장으로 확장됩니다.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">
            A-Block · DLight · AI Farm OS는 재배 규모와 목적에 따라 다르게
            구성됩니다.
          </p>
        </FadeIn>

        <FadeIn delay={120}>
          <ul className="mt-10 grid grid-cols-2 gap-4 md:mt-14 md:grid-cols-4 md:gap-6">
            {CARDS.map((c) => (
              <li
                key={c.en}
                className="flex flex-col rounded-2xl bg-surface p-5 md:p-6"
              >
                <span aria-hidden className="mb-5 block h-1.5 w-10 rounded-full bg-blue" />
                <p className="label-en text-blue">{c.en}</p>
                <p className="mt-2 text-[17px] font-bold md:text-lg">{c.ko}</p>
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{c.desc}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
