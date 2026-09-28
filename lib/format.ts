import type { Locale } from "@/i18n/routing";

const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/**
 * SPEC §3-5 — 로케일별 날짜 형식. 입력은 YYYY-MM-DD.
 * ko `2026.09.30` / en `Sep 30, 2026` / vi `30/09/2026`
 * (Intl 은 런타임마다 결과가 조금씩 달라 직접 만든다.)
 */
export function formatDate(date: string, locale: Locale): string {
  const [y, m, d] = date.split("-");
  if (locale === "en") return `${EN_MONTHS[Number(m) - 1]} ${Number(d)}, ${y}`;
  if (locale === "vi") return `${d}/${m}/${y}`;
  return `${y}.${m}.${d}`;
}
