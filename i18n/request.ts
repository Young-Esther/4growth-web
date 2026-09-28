import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { routing } from "./routing";
import ko from "@/messages/ko.json";

type Messages = Record<string, unknown>;

/** 번역 누락 키는 ko 로 폴백한다 (SPEC §1). */
function withFallback(base: Messages, override: Messages): Messages {
  const out: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const baseValue = base[key];
    out[key] =
      value &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === "object" &&
      !Array.isArray(baseValue)
        ? withFallback(baseValue as Messages, value as Messages)
        : value;
  }
  return out;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const messages =
    locale === "ko"
      ? ko
      : withFallback(
          ko,
          (await import(`@/messages/${locale}.json`)).default as Messages,
        );

  return { locale, messages };
});
