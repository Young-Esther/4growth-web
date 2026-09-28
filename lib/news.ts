import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { routing, type Locale } from "@/i18n/routing";

/**
 * SPEC §3-5 — 소식. CMS 없이 파일로 관리한다.
 *
 *   content/news/<slug>/ko.md   (필수)
 *   content/news/<slug>/en.md   (선택 — 없으면 ko 본문 + "한국어로만 제공" 안내)
 *   content/news/<slug>/vi.md   (선택)
 *   public/news/<slug>/cover.jpg (선택 — frontmatter `cover` 에 경로를 적는다)
 *
 * ko.md 에 `draft: true` 가 있으면 그 글은 목록·상세·사이트맵 어디에도 나오지 않는다.
 * 빌드 서버에서만 호출한다 (node:fs).
 */

export const NEWS_CATEGORIES = ["event", "trial", "award", "notice"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type NewsMeta = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  category: NewsCategory;
  summary: string;
  cover?: string;
  /** 요청한 로케일 파일이 없어 ko 로 대체했는지 */
  fallback: boolean;
};

export type NewsPost = NewsMeta & { html: string };

const NEWS_DIR = join(process.cwd(), "content", "news");
const PUBLIC_DIR = join(process.cwd(), "public");

/** gray-matter 는 따옴표 없는 날짜를 Date 로 바꾼다. 문자열로 되돌린다. */
function toDateString(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value);
}

function readFile(slug: string, locale: Locale) {
  const file = join(NEWS_DIR, slug, `${locale}.md`);
  if (!existsSync(file)) return null;
  return matter(readFileSync(file, "utf8"));
}

/** ko.md 가 있고 draft 가 아닌 글의 slug */
export function getPublishedSlugs(): string[] {
  if (!existsSync(NEWS_DIR)) return [];
  return readdirSync(NEWS_DIR).filter((slug) => {
    const ko = readFile(slug, routing.defaultLocale);
    return ko !== null && !ko.data.draft;
  });
}

function resolve(slug: string, locale: Locale) {
  const own = readFile(slug, locale);
  const usable = own && !own.data.draft ? own : null;
  const file = usable ?? readFile(slug, routing.defaultLocale);
  if (!file || file.data.draft) return null;

  const { data } = file;
  if (!NEWS_CATEGORIES.includes(data.category)) {
    throw new Error(`content/news/${slug}: category 는 ${NEWS_CATEGORIES.join(" | ")} 중 하나여야 합니다.`);
  }

  // 커버는 파일이 실제로 있을 때만 쓴다 (깨진 이미지 방지).
  const cover =
    typeof data.cover === "string" && existsSync(join(PUBLIC_DIR, data.cover))
      ? data.cover
      : undefined;

  const meta: NewsMeta = {
    slug,
    title: String(data.title),
    date: toDateString(data.date),
    category: data.category,
    summary: String(data.summary ?? ""),
    cover,
    fallback: usable === null && locale !== routing.defaultLocale,
  };
  return { meta, content: file.content };
}

/** 게시된 글 목록, 날짜 내림차순 */
export function getNewsList(locale: Locale): NewsMeta[] {
  return getPublishedSlugs()
    .map((slug) => resolve(slug, locale)?.meta)
    .filter((m): m is NewsMeta => Boolean(m))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export async function getNewsPost(slug: string, locale: Locale): Promise<NewsPost | null> {
  if (!getPublishedSlugs().includes(slug)) return null;
  const resolved = resolve(slug, locale);
  if (!resolved) return null;
  const html = String(await remark().use(remarkHtml).process(resolved.content));
  return { ...resolved.meta, html };
}
