import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

/**
 * SPEC §3-4 — 출시 안내 띠. 차담 페이지 맨 위(헤더 바로 아래, Hero 위).
 * 한 줄 (모바일은 줄바꿈 허용). 닫기 버튼 없음. 문장 끝 "문의하기" → /contact?type=chadam.
 * TODO(SPEC §3-4): 출시(2027.01) 후 제거한다. 출시 예정 태그는 lib/brands.ts `status` 와 ChadamHero.
 */
export default function ChadamLaunchNotice() {
  const t = useTranslations("chadam.launch");

  return (
    <div className="bg-surface text-ink">
      <p className="container-4g py-3 text-center text-sm leading-relaxed">
        {t("body")}{" "}
        <Link
          href={{ pathname: "/contact", query: { type: "chadam" } }}
          className="whitespace-nowrap font-bold underline underline-offset-4"
        >
          {t("cta")}
        </Link>
      </p>
    </div>
  );
}
