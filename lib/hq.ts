/**
 * 4growth HQ 공개 API — 소식. 서버에서만 호출하고 응답은 60초마다 갱신한다 (ISR).
 *
 *   GET {base}/api/public/4growth/posts         → [{ slug, title, excerpt, published_at, cover_url, category? }]
 *   GET {base}/api/public/4growth/posts/{slug}  → { title, body_html, images[], published_at, updated_at }
 *                                                  없는 slug 는 404 { error: "not found" }
 *
 * NEXT_PUBLIC_HQ_API_BASE 가 없으면 HQ 글 없이 동작한다 (파일 소식만).
 * API 가 죽어 있어도 예외를 던지지 않고 `error` 로 돌려준다 — 페이지에서 안내 문구를 띄운다.
 */

export const HQ_REVALIDATE = 60;

const BASE = process.env.NEXT_PUBLIC_HQ_API_BASE?.replace(/\/+$/, "") || null;
const ORIGIN = BASE ? new URL(BASE).origin : null;
const TIMEOUT_MS = 8000;

export type HqListItem = {
  slug: string;
  title: string;
  excerpt: string;
  /** YYYY-MM-DD (KST) */
  date: string;
  cover?: string;
  /** notice | event | award | press | product. 2026-10-12 현재 HQ 응답에는 아직 없다. */
  category: string | null;
};

export type HqPost = {
  title: string;
  html: string;
  images: string[];
  /** YYYY-MM-DD (KST) */
  date: string;
  category: string | null;
};

type Fetched = { status: "ok"; json: unknown } | { status: "not-found" } | { status: "error" };

async function get(path: string): Promise<Fetched> {
  if (!BASE) return { status: "error" };
  try {
    const res = await fetch(`${BASE}${path}`, {
      next: { revalidate: HQ_REVALIDATE },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 404) return { status: "not-found" };
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return { status: "ok", json: await res.json() };
  } catch (err) {
    console.error(`[hq] GET ${path} 실패:`, err instanceof Error ? err.message : err);
    return { status: "error" };
  }
}

/** ISO 시각 → KST 날짜 YYYY-MM-DD. 날짜만 오면 그대로. */
function toKstDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) return null;
  return new Date(ms + 9 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

/**
 * HQ 이미지 주소를 절대 URL 로. next/image 는 next.config 의 remotePatterns 에 없는 호스트를
 * 받으면 렌더가 깨지므로 HQ 와 같은 origin 만 통과시킨다.
 */
function toImageUrl(value: unknown): string | undefined {
  const raw =
    typeof value === "string"
      ? value
      : value && typeof value === "object" && "url" in value
        ? (value as { url: unknown }).url
        : null;
  if (typeof raw !== "string" || !raw || !BASE) return undefined;
  try {
    const url = new URL(raw, `${BASE}/`);
    return url.origin === ORIGIN ? url.href : undefined;
  } catch {
    return undefined;
  }
}

const str = (v: unknown) => (typeof v === "string" ? v : "");

/** HQ 가 설정되지 않았으면 빈 목록 (error 아님) */
export async function getHqList(): Promise<{ posts: HqListItem[]; error: boolean }> {
  if (!BASE) return { posts: [], error: false };
  const res = await get("/api/public/4growth/posts");
  if (res.status !== "ok" || !Array.isArray(res.json)) return { posts: [], error: true };

  const posts = res.json.flatMap((item): HqListItem[] => {
    const slug = str(item?.slug);
    const title = str(item?.title);
    const date = toKstDate(item?.published_at);
    if (!slug || !title || !date) return [];
    return [
      {
        slug,
        title,
        date,
        excerpt: str(item?.excerpt),
        cover: toImageUrl(item?.cover_url),
        category: str(item?.category) || null,
      },
    ];
  });
  return { posts, error: false };
}

export async function getHqPost(
  slug: string,
): Promise<{ status: "ok"; post: HqPost } | { status: "not-found" } | { status: "error" }> {
  if (!BASE) return { status: "not-found" };
  const res = await get(`/api/public/4growth/posts/${encodeURIComponent(slug)}`);
  if (res.status !== "ok") return res;

  const data = res.json as Record<string, unknown> | null;
  const title = str(data?.title);
  const date = toKstDate(data?.published_at);
  if (!title || !date) return { status: "error" };

  const images = (Array.isArray(data?.images) ? data.images : [])
    .map(toImageUrl)
    .filter((u): u is string => Boolean(u));
  // 본문의 상대 경로 이미지(src="/uploads/…")는 사이트가 아니라 HQ 기준이다
  const html = str(data?.body_html).replace(/(\ssrc=["'])\/(?!\/)/g, `$1${BASE}/`);
  return { status: "ok", post: { title, date, html, images, category: str(data?.category) || null } };
}
