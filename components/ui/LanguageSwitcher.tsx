"use client";

import { Fragment } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { routing, type Locale } from "@/i18n/routing";

/**
 * SPEC §2 — 언어 전환 `KO · EN · VI`. 드롭다운 아님.
 * 현재 언어는 굵게 + 블루, 나머지는 회색. 같은 경로의 다른 로케일로 이동하고 선택은 쿠키(NEXT_LOCALE)에 남는다.
 */
export default function LanguageSwitcher() {
  const t = useTranslations("common");
  const current = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  // `/contact?type=chadam` 처럼 쿼리가 있으면 그대로 들고 간다.
  // (useSearchParams 는 정적 페이지 전체를 Suspense 로 감싸야 해서, 클릭 시점에 읽는다.)
  function handleClick(event: React.MouseEvent, locale: Locale) {
    const search = window.location.search;
    if (!search || event.metaKey || event.ctrlKey || event.shiftKey) return;
    event.preventDefault();
    router.replace(
      { pathname, query: Object.fromEntries(new URLSearchParams(search)) },
      { locale, scroll: false },
    );
  }

  return (
    <nav aria-label={t("language")}>
      <ul className="flex items-center gap-1.5 text-[13px] md:text-sm">
        {routing.locales.map((locale, i) => {
          const active = locale === current;
          return (
            <Fragment key={locale}>
              {i > 0 && (
                <li aria-hidden className="text-caption">
                  ·
                </li>
              )}
              <li>
                <Link
                  href={pathname}
                  locale={locale}
                  hrefLang={locale}
                  lang={locale}
                  scroll={false}
                  aria-current={active ? "true" : undefined}
                  onClick={(e) => handleClick(e, locale)}
                  className={`inline-flex min-h-[44px] items-center px-0.5 uppercase transition-colors ${
                    active ? "font-bold text-blue" : "font-medium text-caption hover:text-ink"
                  }`}
                >
                  {locale}
                </Link>
              </li>
            </Fragment>
          );
        })}
      </ul>
    </nav>
  );
}
