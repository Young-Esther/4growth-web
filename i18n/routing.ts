import { defineRouting } from "next-intl/routing";

/** SPEC §1 — 로케일 ko(기본) · en · vi, 항상 접두사를 붙인다. */
export const routing = defineRouting({
  locales: ["ko", "en", "vi"],
  defaultLocale: "ko",
  localePrefix: "always",
  // 언어 선택을 1년간 기억한다 (기본값은 세션 쿠키).
  localeCookie: { maxAge: 60 * 60 * 24 * 365 },
});

export type Locale = (typeof routing.locales)[number];
