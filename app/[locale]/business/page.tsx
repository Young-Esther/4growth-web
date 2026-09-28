import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import PageIntro from "@/components/sections/PageIntro";
import Applications from "@/components/sections/Applications";
import Brands from "@/components/sections/Brands";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/business",
    title: `${t("common.nav.business")} | 4growth`,
    description: t("business.body"),
  });
}

/** SPEC §3-3 — 페이지 헤더(BUSINESS) → 01 APPLICATIONS → 02 BRANDS */
export default async function BusinessPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("business");
  const label = await getTranslations("labels");

  return (
    <>
      <PageIntro label={label("business")} title={t("title")} body={t("body")} />
      <Applications no="01" />
      <Brands no="02" />
    </>
  );
}
