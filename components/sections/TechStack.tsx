import { useTranslations } from "next-intl";
import SectionLabel from "@/components/ui/SectionLabel";
import FadeIn from "@/components/ui/FadeIn";
import StackDiagram from "@/components/diagrams/StackDiagram";

type Props = {
  /** 섹션 라벨 번호 — 페이지마다 01부터 다시 매긴다 (v0.2 §3) */
  no?: string;
  /** 다이어그램 블록 링크의 앞부분. 홈은 "/{locale}/technology", 기술 페이지는 "" (같은 페이지 앵커) */
  detailBase?: string;
};

/** SPEC §3 (v0.1) — TECHNOLOGY STACK. 홈 요약과 기술 페이지에서 같이 쓴다. */
export default function TechStack({ no = "01", detailBase = "" }: Props) {
  const t = useTranslations("technology.stack");
  const label = useTranslations("labels");
  return (
    <section id="technology" className="section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>{`${no} — ${label("technology")}`}</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink/80">{t("body")}</p>
        </FadeIn>

        <FadeIn delay={120} className="mt-12 md:mt-16">
          <StackDiagram
            detailBase={detailBase}
            terms={{ space: t("space"), control: t("control"), operations: t("operations") }}
          />
        </FadeIn>
      </div>
    </section>
  );
}
