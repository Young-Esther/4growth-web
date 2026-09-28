import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Hero from "@/components/sections/Hero";
import TechStack from "@/components/sections/TechStack";
import Field from "@/components/sections/Field";
import BusinessPreview from "@/components/sections/BusinessPreview";
import LatestNews from "@/components/sections/LatestNews";
import CtaBand from "@/components/sections/CtaBand";
import LegacyHashRedirect from "@/components/LegacyHashRedirect";
import type { Locale } from "@/i18n/routing";
import { getNewsList } from "@/lib/news";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMetadata({ locale, path: "", title: t("title"), description: t("description") });
}

/** SPEC §3-1 — 홈 (요약판) */
export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const news = getNewsList(locale);

  return (
    <>
      <LegacyHashRedirect locale={locale} />
      <Hero />
      <TechStack no="01" detailBase={`/${locale}/technology`} />
      <Field no="02" />
      <BusinessPreview no="03" />
      <LatestNews no="04" posts={news} />
      <CtaBand />
    </>
  );
}
