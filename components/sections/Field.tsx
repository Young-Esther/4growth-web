import { useTranslations } from "next-intl";
import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import SectionLabel from "@/components/ui/SectionLabel";

/**
 * SPEC §5 (v0.1) — BUILT FROM THE FIELD. v0.2: 홈에 유지 (별도 탭 없음), 섹션 id `field` 유지.
 * 이 섹션만 이미지가 배경(풀폭)이고, 텍스트 오버레이 없이 이미지 아래에 온다.
 */

/**
 * 숫자 스트립 — 검증된 것만 노출한다 (SPEC §5).
 * 네 번째 칸은 친환경 화훼 인증 배지로, 숫자와 같은 스타일을 쓰되
 * 문자열이 길어 값 글자만 한 단계 줄인다.
 */
type Stat = { value: string; caption: string };
const WIDE_VALUES = new Set(["MPS-ABC"]);

export default function Field({ no = "02" }: { no?: string }) {
  const t = useTranslations("home.field");
  const label = useTranslations("labels");
  const stats = t.raw("stats") as Stat[];
  // field-01 리시안셔스, field-02~04 거베라 (lib/assets.ts P-01 순서)
  const alts = [t("altLisianthus"), t("altGerbera"), t("altGerbera"), t("altGerbera")];

  return (
    <section id="field" className="scroll-mt-[72px] pb-16 md:pb-24">
      <AssetSlot
        id="P-01"
        sizes="100vw"
        alts={alts}
        className="h-[240px] w-full md:h-[480px]"
      />

      <div className="container-4g">
        <FadeIn className="pt-12 md:pt-16">
          <SectionLabel>{`${no} — ${label("field")}`}</SectionLabel>
          <h2 className="max-w-3xl text-[26px] font-bold leading-snug md:text-[40px]">
            {t("title")}
          </h2>
          <p className="mt-5 max-w-3xl text-[15px] leading-[1.8] text-ink/80 md:text-base">
            {t("body")}
          </p>
        </FadeIn>

        <FadeIn delay={120}>
          <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-10 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.caption}>
                <dt className="sr-only">{s.caption}</dt>
                <dd>
                  <p
                    className={`flex h-[40px] items-end font-bold leading-none text-blue md:h-[52px] ${
                      WIDE_VALUES.has(s.value)
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
