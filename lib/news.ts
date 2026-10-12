import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import { routing, type Locale } from "@/i18n/routing";
import { getHqList, getHqPost } from "@/lib/hq";

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
 *
 * 여기에 4growth HQ 공개 API 의 글(lib/hq.ts)을 합친다. HQ 글은 한국어로만 쓰인다.
 * HQ 응답의 category 가 NEWS_CATEGORIES 중 하나가 아니면(없으면) '전체'에만 보인다.
 * slug 가 겹치면 파일 글이 이긴다.
 */

/** 탭 순서. 4growth HQ 공개 API 의 category 와 같은 값을 쓴다. */
export const NEWS_CATEGORIES = ["notice", "event", "award", "press", "product"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type NewsMeta = {
  slug: string;
  title: string;
  /** YYYY-MM-DD */
  date: string;
  /** HQ 글은 category 가 없을 수 있다 — 그때는 '전체'에만 보인다 */
  category: NewsCategory | null;
  summary: string;
  /** public/ 경로 또는 HQ 이미지 절대 URL */
  cover?: string;
  /** 요청한 로케일 파일이 없어 ko 로 대체했는지 */
  fallback: boolean;
};

export type NewsPost = NewsMeta & {
  html: string;
  /** 본문 HTML 에 들어 있지 않은 HQ 첨부 이미지 */
  images: string[];
};

export type NewsPostResult =
  | { status: "ok"; post: NewsPost }
  | { status: "not-found" }
  /** HQ API 를 읽지 못함 */
  | { status: "error" };

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

/** HQ 글의 로케일 대체 여부 — HQ 글은 한국어로만 쓰인다 */
const hqFallback = (locale: Locale) => locale !== routing.defaultLocale;

const toCategory = (value: string | null): NewsCategory | null =>
  NEWS_CATEGORIES.find((c) => c === value) ?? null;

/**
 * 게시된 글 목록 (파일 + HQ), 날짜 내림차순.
 * `hqError` — HQ API 를 읽지 못했다. 파일 글은 그대로 나온다.
 */
export async function getNewsList(locale: Locale): Promise<{ posts: NewsMeta[]; hqError: boolean }> {
  const files = getPublishedSlugs()
    .map((slug) => resolve(slug, locale)?.meta)
    .filter((m): m is NewsMeta => Boolean(m));

  const hq = await getHqList();
  const taken = new Set(files.map((m) => m.slug));
  const remote = hq.posts
    .filter((p) => !taken.has(p.slug))
    .map(
      (p): NewsMeta => ({
        slug: p.slug,
        title: p.title,
        date: p.date,
        category: toCategory(p.category),
        summary: p.excerpt,
        cover: p.cover,
        fallback: hqFallback(locale),
      }),
    );

  const posts = [...files, ...remote].sort((a, b) =>
    a.date < b.date ? 1 : a.date > b.date ? -1 : 0,
  );
  return { posts, hqError: hq.error };
}

/** 사이트맵·정적 생성용 slug (파일 + HQ). HQ 를 못 읽으면 파일 slug 만. */
export async function getAllSlugs(): Promise<string[]> {
  const files = getPublishedSlugs();
  const hq = await getHqList();
  return [...new Set([...files, ...hq.posts.map((p) => p.slug)])];
}

/** HTML 태그를 걷어 낸 앞부분 — 요약이 없을 때 description 용 */
function plainText(html: string, max = 120): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

export async function getNewsPost(slug: string, locale: Locale): Promise<NewsPostResult> {
  if (getPublishedSlugs().includes(slug)) {
    const resolved = resolve(slug, locale);
    if (!resolved) return { status: "not-found" };
    const html = String(await remark().use(remarkHtml).process(resolved.content));
    return { status: "ok", post: { ...resolved.meta, html, images: [] } };
  }

  const [res, list] = await Promise.all([getHqPost(slug), getHqList()]);
  if (res.status !== "ok") return res;
  const { post } = res;
  const item = list.posts.find((p) => p.slug === slug);
  const cover = item?.cover ?? post.images[0];

  return {
    status: "ok",
    post: {
      slug,
      title: post.title,
      date: post.date,
      category: toCategory(post.category ?? item?.category ?? null),
      summary: item?.excerpt || plainText(post.html),
      cover,
      fallback: hqFallback(locale),
      html: post.html,
      // 커버나 본문에 이미 나온 이미지는 다시 보여 주지 않는다
      images: post.images.filter(
        (src) => src !== cover && !post.html.includes(new URL(src).pathname),
      ),
    },
  };
}
