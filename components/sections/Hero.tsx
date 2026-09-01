import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";

/** SPEC §2 — SECTION 01 HERO */
export default function Hero() {
  return (
    <section id="top" className="pt-[72px]">
      <div className="container-4g grid items-center gap-10 py-12 md:min-h-[85vh] md:grid-cols-2 md:gap-14 md:py-24">
        <FadeIn>
          <p className="label-en mb-5 text-blue">
            Technology for Sustainable Agriculture
          </p>
          <h1 className="text-[32px] font-bold leading-[1.25] tracking-[-0.01em] md:text-[52px]">
            농업의 지속가능성을
            <br />
            기술로 설계합니다
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink/80 md:text-lg">
            농업 현장에서 발견한 문제를 하드웨어와 소프트웨어로 해결합니다.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="#technology"
              className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-7 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              기술 알아보기
            </a>
            <a
              href="#contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink px-7 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              프로젝트 문의
            </a>
          </div>
        </FadeIn>

        <FadeIn delay={120}>
          {/* 카탈로그 표지와 동일하게 회색 박스 없이 렌더링만 (v0.1 검토 반영) */}
          <AssetSlot
            id="I-01"
            priority
            bare
            sizes="(max-width: 768px) 100vw, 50vw"
            className="max-h-[70vh]"
          />
        </FadeIn>
      </div>
    </section>
  );
}
