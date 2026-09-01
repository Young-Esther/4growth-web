"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/ui/Logo";

const NAV = [
  { label: "Technology", href: "#technology" },
  { label: "Field", href: "#field" },
  { label: "Applications", href: "#applications" },
  { label: "Contact", href: "#contact" },
];

/** SPEC §1 — 고정 헤더. 스크롤 시 흰 배경 + 얇은 하단선. 모바일은 풀스크린 메뉴. */
export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors ${
        scrolled || menuOpen ? "border-b border-line bg-white" : "bg-white/0"
      }`}
    >
      <div className="container-4g flex h-[72px] items-center justify-between">
        <a href="#top" className="flex items-center" aria-label="4GROWTH 홈">
          <Logo className="h-6" />
        </a>

        <nav aria-label="주요 메뉴" className="hidden md:block">
          <ul className="flex items-center gap-8">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="label-en text-ink transition-colors hover:text-blue"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}
          className="-mr-2 flex h-11 w-11 items-center justify-center md:hidden"
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

      {/* 모바일 풀스크린 메뉴 */}
      <div
        id="mobile-menu"
        hidden={!menuOpen}
        className="fixed inset-x-0 bottom-0 top-[72px] bg-white md:hidden"
      >
        <nav aria-label="모바일 메뉴" className="container-4g pt-6">
          <ul className="flex flex-col">
            {NAV.map((item) => (
              <li key={item.href} className="border-b border-line">
                <a
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="label-en block py-5 text-base text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
