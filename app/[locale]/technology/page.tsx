import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import TechStack from "@/components/sections/TechStack";
import TechDetail from "@/components/sections/TechDetail";
import RnD from "@/components/sections/RnD";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  return pageMetadata({
    locale,
    path: "/technology",
    title: `${t("common.nav.technology")} | 4growth`,
    description: t("technology.stack.body"),
  });
}

/** SPEC §3-2 — v0.1 §3 TechStack + §4 세 기술 상세 + §6 R&D 를 순서 그대로 옮긴다. */
export default async function TechnologyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="pt-[72px]">
      <TechStack no="01" />
      <TechDetail />
      <RnD no="02" />
    </div>
  );
}
