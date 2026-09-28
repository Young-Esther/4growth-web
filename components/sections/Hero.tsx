import { useTranslations } from "next-intl";
import AssetSlot from "@/components/ui/AssetSlot";
import FadeIn from "@/components/ui/FadeIn";
import { Link } from "@/i18n/navigation";

/** SPEC §2 (v0.1) — HERO. v0.2 §3-1: CTA 는 /technology · /contact 페이지로 이동. */
export default function Hero() {
  const t = useTranslations("home.hero");
  return (
    <section id="top" className="pt-[72px]">
      <div className="container-4g grid items-center gap-10 py-12 md:min-h-[85vh] md:grid-cols-2 md:gap-14 md:py-24">
        <FadeIn>
          <p className="label-en mb-5 text-blue">{t("label")}</p>
          {/* v0.1 의 수동 <br /> 대신 균형 줄바꿈 — 문장을 원고 그대로 유지하면서 두 줄로 나눈다. */}
          <h1 className="text-balance text-[32px] font-bold leading-[1.25] tracking-[-0.01em] md:text-[52px]">
            {t("title")}
          </h1>
          <p className="mt-6 text-base leading-relaxed text-ink/80 md:text-lg">{t("body")}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/technology"
              className="inline-flex h-12 items-center justify-center rounded-full bg-blue px-7 text-sm font-bold text-white transition-opacity hover:opacity-90"
            >
              {t("ctaTechnology")}
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center rounded-full border border-ink px-7 text-sm font-bold text-ink transition-colors hover:bg-ink hover:text-white"
            >
              {t("ctaContact")}
            </Link>
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
