import { useTranslations } from "next-intl";
import FadeIn from "@/components/ui/FadeIn";
import { Link } from "@/i18n/navigation";

type Href = string | { pathname: string; query: Record<string, string> };

/**
 * SPEC §3-1 6번 — 문의 CTA 띠. 블루 배경 풀폭, 헤드라인 + 절차 + 흰색 버튼.
 * 차담 페이지는 버튼만 바꿔 재사용한다 (§3-4 5번).
 */
export default function CtaBand({
  buttonLabel,
  href = "/contact",
}: {
  buttonLabel?: string;
  href?: Href;
}) {
  const t = useTranslations("home.cta");

  return (
    <section className="bg-blue text-white">
      <div className="container-4g py-14 md:py-20">
        <FadeIn className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-[24px] font-bold leading-snug md:text-[34px]">{t("title")}</h2>
            <p className="mt-4 text-sm text-white/80 md:text-[15px]">{t("process")}</p>
          </div>
          <Link
            href={href}
            className="inline-flex h-12 shrink-0 items-center justify-center self-start rounded-full bg-white px-7 text-sm font-bold text-blue transition-opacity hover:opacity-90 md:self-auto"
          >
            {buttonLabel ?? t("button")}
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
