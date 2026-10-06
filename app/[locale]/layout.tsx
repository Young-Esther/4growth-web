import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import { routing } from "@/i18n/routing";
import { siteUrl } from "@/lib/site";

/**
 * SPEC §1 — vi 전용 본문 폰트.
 * Pretendard 의 서브셋에는 베트남어 성조 조합 글자(U+1EA0–1EF9: ạ ế ữ ờ …)와 ơ · ư 가 없어
 * 그 글자만 시스템 폰트로 섞여 보인다. vi 로케일에만 Be Vietnam Pro 를 앞세우고
 * 한글·한자는 Pretendard 로 폴백한다 (globals.css `html:lang(vi) body`).
 * ko/en 페이지에서 폰트를 받지 않도록 preload 는 끈다.
 */
const beVietnamPro = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  verification: { other: { "naver-site-verification": "be6ba30f255ca8f402531d49544ebfaead7bfd13" } },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={locale === "vi" ? beVietnamPro.variable : undefined}>
      <head>
        {/* SPEC §1 — Pretendard (jsdelivr CDN, font-display: swap) */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          as="style"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body>
        <NextIntlClientProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
