import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * SPEC §7 (v0.1) — APPLICATIONS. v0.2: 사업영역 페이지 `01 — APPLICATIONS` 로 이동.
 * 헤드라인·본문은 사업영역 페이지 헤더로 올라갔고, 여기에는 라벨 + 4카드만 남는다.
 * 카드 = 영문 라벨 + 현지어명 + 2줄 설명. 사진 없음 (컬러 블록).
 */

type Card = { label: string; name: string; desc: string };

export default function Applications({ no = "01" }: { no?: string }) {
  const t = useTranslations("business");
  const label = useTranslations("labels");
  const cards = t.raw("applications") as Card[];

  return (
    <section id="applications" className="section-4g scroll-mt-[72px]">
      <div className="container-4g">
        <FadeIn>
          <SectionLabel>{`${no} — ${label("applications")}`}</SectionLabel>
        </FadeIn>

        <FadeIn delay={120}>
          <ul className="mt-6 grid grid-cols-2 gap-4 md:mt-8 md:grid-cols-4 md:gap-6">
            {cards.map((c) => (
              <li key={c.label} className="flex flex-col rounded-2xl bg-surface p-5 md:p-6">
                <span aria-hidden className="mb-5 block h-1.5 w-10 rounded-full bg-blue" />
                <p className="label-en text-blue">{c.label}</p>
                {/* en 원고는 현지어명이 없다 (영문 라벨이 곧 이름) */}
                {c.name && <p className="mt-2 text-[17px] font-bold md:text-lg">{c.name}</p>}
                <p className="mt-3 text-sm leading-relaxed text-ink/70">{c.desc}</p>
              </li>
            ))}
          </ul>
        </FadeIn>
      </div>
    </section>
  );
}
