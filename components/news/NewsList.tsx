"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { NewsCategory } from "@/lib/news";

type Item = { category: NewsCategory; card: React.ReactNode; key: string };

/**
 * SPEC §3-5 — 카테고리 칩 + 카드 리스트. `?category=` 로 필터한다.
 *
 * 칩은 글이 1건 이상 있는 카테고리만 보인다 — 눌렀을 때 빈 목록이 나오는 칩을 만들지 않기 위해서다
 * (SPEC §7 "빈 소식 자리" 금지). 글이 늘면 칩도 자동으로 늘어난다.
 *
 * 카드는 서버에서 만든 것을 받아 거르기만 한다. useSearchParams 를 쓰므로 페이지에서
 * Suspense 로 감싸고, fallback 으로 `category` 없이(전체) 렌더한다.
 */
export default function NewsList({
  items,
  categories,
}: {
  items: Item[];
  /** 글이 있는 카테고리 (표시 순서대로) */
  categories: NewsCategory[];
}) {
  const params = useSearchParams();
  return <NewsListView items={items} categories={categories} selected={params.get("category")} />;
}

export function NewsListView({
  items,
  categories,
  selected,
}: {
  items: Item[];
  categories: NewsCategory[];
  selected: string | null;
}) {
  const t = useTranslations("news.categories");
  const active = categories.find((c) => c === selected) ?? null;
  const visible = active ? items.filter((i) => i.category === active) : items;

  const chip = (key: NewsCategory | null, label: string) => {
    const on = key === active;
    return (
      <li key={key ?? "all"}>
        <Link
          href={key ? { pathname: "/news", query: { category: key } } : "/news"}
          scroll={false}
          aria-current={on ? "true" : undefined}
          className={`inline-flex h-10 items-center rounded-full border px-4 text-sm transition-colors ${
            on
              ? "border-blue bg-blue font-bold text-white"
              : "border-line bg-white font-medium text-ink hover:border-blue hover:text-blue"
          }`}
        >
          {label}
        </Link>
      </li>
    );
  };

  return (
    <>
      <ul className="flex flex-wrap gap-2">
        {chip(null, t("all"))}
        {categories.map((c) => chip(c, t(c)))}
      </ul>
      <ul className="mt-8 grid gap-6 md:mt-10 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((item) => (
          <li key={item.key}>{item.card}</li>
        ))}
      </ul>
    </>
  );
}
