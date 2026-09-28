import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Contact from "@/components/sections/Contact";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/contact",
    title: `${t("common.nav.contact")} | 4growth`,
    description: t("meta.description"),
  });
}

/** SPEC §3-6 — v0.1 §8 레이아웃 그대로 + 차담 유형. `?type=` 프리셀렉트는 Contact 가 처리한다. */
export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-[72px]">
      <Contact no="01" />
    </div>
  );
}
