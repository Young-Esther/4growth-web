"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { Link, usePathname } from "@/i18n/navigation";

const NAV = [
  { key: "technology", href: "/technology" },
  { key: "business", href: "/business" },
  { key: "news", href: "/news" },
  { key: "contact", href: "/contact" },
] as const;

/**
 * SPEC §2 (v0.2) — 고정 헤더. 스크롤 시 흰 배경 + 얇은 하단선 (v0.1과 동일).
 * 데스크톱: 로고 | 메뉴 4개 + KO · EN · VI
 * 모바일:   로고 | KO · EN · VI | 햄버거 — 언어 전환은 메뉴를 열지 않아도 보인다.
 */
export default function Header() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 페이지를 옮기면 모바일 메뉴를 닫는다.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || menuOpen ? "border-b border-line bg-white" : "bg-white/0"
      }`}
    >
      <div className="container-4g flex h-[72px] items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center">
          <Logo className="h-6" />
        </Link>

        <div className="hidden items-center gap-10 md:flex">
          <nav>
            <ul className="flex items-center gap-8">
              {NAV.map((item) => {
                const active = isActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={active ? "page" : undefined}
                      className={`text-[15px] transition-colors hover:text-blue ${
                        active ? "font-bold text-blue" : "font-medium text-ink"
                      }`}
                    >
                      {t(`nav.${item.key}`)}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          <LanguageSwitcher />
        </div>

        {/* 모바일: 언어 전환 + 햄버거 */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("menuClose") : t("menuOpen")}
            className="-mr-2 flex h-11 w-11 items-center justify-center"
          >
            <span className="relative block h-4 w-6" aria-hidden>
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-ink transition-transform ${
                  menuOpen ? "top-[7px] rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 top-[7px] block h-0.5 w-6 bg-ink transition-opacity ${
                  menuOpen ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 block h-0.5 w-6 bg-ink transition-transform ${
                  menuOpen ? "top-[7px] -rotate-45" : "top-[14px]"
                }`}
              />
            </span>
          </button>
        </div>
      </div>

      {/* 모바일 풀스크린 메뉴 */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-[72px] bg-white md:hidden"
      >
        <nav className="container-4g pt-6">
          <ul className="flex flex-col">
            {NAV.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href} className="border-b border-line">
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block py-5 text-base ${
                      active ? "font-bold text-blue" : "font-medium text-ink"
                    }`}
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
