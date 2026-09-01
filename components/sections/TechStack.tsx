import SectionLabel from "@/components/ui/SectionLabel";
import FadeIn from "@/components/ui/FadeIn";
import StackDiagram from "@/components/diagrams/StackDiagram";

/** SPEC §3 — SECTION 02 TECHNOLOGY STACK */
export default function TechStack() {
  return (
    <section id="technology" className="section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>01 — Technology</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            하나의 농장을 구성하는 세 가지 기술
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">
            재배 공간, 광 제어, 운영 데이터. 세 기술은 따로 팔리는 제품이 아니라
            하나의 농장을 구성하는 한 시스템입니다.
          </p>
        </FadeIn>

        <FadeIn delay={120} className="mt-12 md:mt-16">
          <StackDiagram />
        </FadeIn>
      </div>
    </section>
  );
}
