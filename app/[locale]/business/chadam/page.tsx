import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import ChadamHero from "@/components/chadam/ChadamHero";
import ChadamTeas from "@/components/chadam/ChadamTeas";
import ChadamPackage from "@/components/chadam/ChadamPackage";
import ChadamVideo from "@/components/chadam/ChadamVideo";
import CtaBand from "@/components/sections/CtaBand";
import type { Locale } from "@/i18n/routing";
import { pageMetadata } from "@/lib/seo";
type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  // SPEC §5, §6 CH-OG — CH-01 의 1200×630 크롭.
  return pageMetadata({
    locale,
    path: "/business/chadam",
    title: t("meta.chadamTitle"),
    description: t("brands.chadam.desc"),
    ogImage: { url: "/assets/chadam/og.jpg", alt: t("brands.chadam.imageAlt") },
  });
}

/**
 * SPEC §3-4 — 차담. Hero → 4종 → 패키지 → 홍보영상(파일 있을 때만) → 문의 띠.
 * 차담 4색은 이 페이지에서만 쓴다 (lib/brands.ts CHADAM_COLORS).
 * TODO(SPEC 0-1): 판매 주체가 정해지면 페이지 하단 판매자 표기를 추가한다 (그 전에는 생략).
 */
export default async function ChadamPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("chadam.hero");

  return (
    <>
      <ChadamHero />
      <ChadamTeas />
      <ChadamPackage />
      <ChadamVideo />
      <CtaBand
        buttonLabel={t("cta")}
        href={{ pathname: "/contact", query: { type: "chadam" } }}
      />
    </>
  );
}
