#!/usr/bin/env node
/**
 * 소식 자동 번역 (SPEC §3-5). content/news/<slug>/ko.md → en.md, vi.md
 *
 * 대상 (언어별로 따로 판단한다):
 *   a) 번역 파일이 없다
 *   b) 번역 파일이 `auto: true` 이고 `source_hash` 가 지금 ko.md 의 sha256 앞 12자리와 다르다
 *   번역 파일에 `auto: false` 가 있으면(사람이 고친 것) 절대 덮어쓰지 않는다.
 *   auto 표시가 없는 기존 번역 파일도 사람이 쓴 것으로 보고 건드리지 않는다.
 *
 * 번역 뒤 숫자·날짜·URL·[확인 필요]/[TBD] 개수를 원문과 대조한다. 다르면 그 언어 파일을 쓰지 않고 실패로 남긴다.
 *
 * 사용: node scripts/translate-news.mjs                전체 검사
 *       node scripts/translate-news.mjs --slug <slug>  한 글만
 *       node scripts/translate-news.mjs --dry-run      할 일만 출력 (API 호출 없음, 키 불필요)
 * 환경: ANTHROPIC_API_KEY (필수), ANTHROPIC_MODEL (기본 claude-sonnet-5-5)
 * 종료 코드: 실패한 언어가 하나라도 있으면 1 (성공한 파일은 그대로 쓴다)
 */
import { createHash } from "node:crypto";
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import matter from "gray-matter";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const NEWS_DIR = join(root, "content", "news");
const LANGS = { en: "English", vi: "Vietnamese" };
const MODEL = (process.env.ANTHROPIC_MODEL || "").trim() || "claude-sonnet-5-5";

const systemPrompt = (language) => `You translate Korean news posts for the 4growth company website into ${language}.
Rules:
- Translate faithfully. Do not add, remove, soften or exaggerate any fact, number, date or claim.
- Never translate these names: 4growth, A-Block, DLight, AI Farm OS, MPS-ABC, 차담 → Chadam.
- "특허 출원" = EN "patent application filed" / "patent pending"; VI "đã nộp đơn sáng chế". Never write "patented" or "đã được cấp bằng".
- Never add health or efficacy claims.
- Keep placeholders like [확인 필요] or [TBD] exactly as they are.
- Keep markdown structure. Keep the tone short and factual, matching docs/COPY.md.
- Vietnamese: natural business Vietnamese, not word-for-word.
Output only the translated markdown body, no commentary.`;

// ── 대상 판정 ────────────────────────────────────────────────────────────

const normalize = (text) => text.replace(/\r\n/g, "\n");

/** ko.md 내용의 sha256 앞 12자리. 줄끝을 LF 로 맞춰 Windows·CI 에서 같은 값이 나오게 한다. */
export const sourceHash = (text) => createHash("sha256").update(normalize(text)).digest("hex").slice(0, 12);

/** 이 언어를 번역해야 하면 사유, 아니면 null */
export function needsTranslation(dir, lang, hash) {
  const file = join(dir, `${lang}.md`);
  if (!existsSync(file)) return "번역 파일 없음";
  const { data } = matter(readFileSync(file, "utf8"));
  if (data.auto === true && data.source_hash !== hash) return `원문 변경 (${data.source_hash ?? "해시 없음"} → ${hash})`;
  return null;
}

// ── 번역 후 검증 ──────────────────────────────────────────────────────────

const MONTH =
  "(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|June?|July?|Aug(?:ust)?|Sep(?:t(?:ember)?)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)";
const ISO = String.raw`\d{4}[.\-/]\s?\d{1,2}[.\-/]\s?\d{1,2}\.?`;

/**
 * 언어별 날짜 표기. `count` 는 날짜 1건으로 세고, `strip` 은 세지 않고 지우기만 한다.
 * "9월" 처럼 연·일 없는 달은 EN 에서 "September"(숫자 없음)가 되므로 양쪽 다 세지 않는다.
 */
const DATES = {
  ko: {
    count: [String.raw`\d{4}\s*년\s*\d{1,2}\s*월(?:\s*\d{1,2}\s*일)?`, String.raw`\d{1,2}\s*월\s*\d{1,2}\s*일`, ISO],
    strip: [String.raw`\d{1,2}\s*월`],
  },
  en: {
    count: [
      String.raw`${MONTH}\.?\s+\d{1,2}(?:st|nd|rd|th)?,?\s+\d{4}`,
      String.raw`\d{1,2}(?:st|nd|rd|th)?\s+(?:of\s+)?${MONTH}\.?,?\s+\d{4}`,
      String.raw`${MONTH}\.?,?\s+\d{4}`,
      String.raw`${MONTH}\.?\s+\d{1,2}(?:st|nd|rd|th)?\b`,
      ISO,
    ],
    strip: [],
  },
  vi: {
    count: [
      String.raw`ngày\s+\d{1,2}\s*(?:tháng\s+|/)\s*\d{1,2}(?:\s*(?:,?\s*năm\s+|/)\s*\d{4})?`,
      String.raw`\d{1,2}/\d{1,2}/\d{4}`,
      String.raw`tháng\s+\d{1,2}\s*(?:,?\s*năm\s+|/)\s*\d{4}`,
      ISO,
    ],
    strip: [String.raw`tháng\s+\d{1,2}`],
  },
};

const URL_RE = /https?:\/\/[^\s)\]>"']+/g;
/** 마크다운 링크·이미지의 상대 경로 대상 — ](/news/a.jpg) */
const LINK_TARGET_RE = /\]\((?!https?:)[^)\s]+(?:\s+"[^"]*")?\)/g;
const PLACEHOLDER_RE = /\[(?:확인 필요|TBD)\]/g;
/** 숫자가 든 고유명사 — 숫자로 세지 않는다 (ko 원문은 보통 "포그로우스"라 숫자가 없다) */
const NAME_RE = /4growth/gi;
const NUMBER_RE = /\d+(?:[.,]\d+)*/g;

const count = (text, re) => (text.match(re) ?? []).length;

/** 검증용 집계: 날짜·URL·표시를 먼저 세고 지운 뒤 남은 숫자를 센다 */
export function tally(text, lang) {
  let rest = normalize(text);
  const urls = count(rest, URL_RE) + count(rest, LINK_TARGET_RE);
  rest = rest.replace(URL_RE, " ").replace(LINK_TARGET_RE, " ");
  const placeholders = count(rest, PLACEHOLDER_RE);
  rest = rest.replace(PLACEHOLDER_RE, " ").replace(NAME_RE, " ");
  const dateRe = new RegExp(DATES[lang].count.join("|"), "giu");
  const dates = count(rest, dateRe);
  rest = rest.replace(dateRe, " ");
  for (const s of DATES[lang].strip) rest = rest.replace(new RegExp(s, "giu"), " ");
  const numbers = rest.match(NUMBER_RE) ?? [];
  return { numbers: numbers.length, dates, urls, placeholders, numberList: numbers };
}

/** 원문(ko)과 번역문을 대조해 문제 목록을 돌려준다 (빈 배열이면 통과) */
export function validate(source, translated, lang) {
  const a = tally(source, "ko");
  const b = tally(translated, lang);
  const problems = [];
  for (const key of ["numbers", "dates", "urls", "placeholders"]) {
    if (a[key] !== b[key]) problems.push(`${key} ${a[key]} → ${b[key]}`);
  }
  if (a.numbers !== b.numbers) {
    problems.push(`숫자 원문 [${a.numberList.join(", ")}] / 번역 [${b.numberList.join(", ")}]`);
  }
  return problems;
}

// ── 파일 만들기 ──────────────────────────────────────────────────────────

/** ko.md frontmatter 에서 키 한 줄을 원문 그대로 꺼낸다 (한 줄짜리 값만). 날짜 따옴표 등 형식을 보존한다. */
function rawLine(frontmatter, key) {
  return frontmatter.match(new RegExp(`^${key}:.*$`, "m"))?.[0] ?? null;
}

/** JSON 문자열은 그대로 YAML 큰따옴표 문자열이다 */
const yamlString = (value) => JSON.stringify(value);

export function buildFile(koRaw, { title, summary, body }, hash) {
  const frontmatter = normalize(koRaw).match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const copied = (key) => rawLine(frontmatter, key);
  // ko.md 와 같은 순서: title · date · category · summary · cover · draft
  const lines = [
    `title: ${yamlString(title)}`,
    copied("date"),
    copied("category"),
    `summary: ${yamlString(summary)}`,
    copied("cover"),
    copied("draft"),
    "auto: true",
    `source_hash: "${hash}"`,
  ].filter(Boolean);
  const text = `---\n${lines.join("\n")}\n---\n\n${body.trim()}\n`;

  // 쓰기 전에 다시 읽어 본다 — 따옴표·이스케이프가 깨지면 여기서 멈춘다
  const parsed = matter(text);
  if (parsed.data.title !== title || parsed.data.summary !== summary || parsed.data.source_hash !== hash) {
    throw new Error("frontmatter 를 다시 읽은 값이 다릅니다");
  }
  return text;
}

// ── Claude API ───────────────────────────────────────────────────────────

let client;
async function getClient() {
  if (!client) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    client = new Anthropic();
  }
  return client;
}

/** 거절은 다른 모델로 다시 돌린다 (server-side fallback, Claude API 전용) */
async function callClaude(params) {
  const anthropic = await getClient();
  const response = await anthropic.beta.messages.create({
    model: MODEL,
    max_tokens: 16000,
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    ...params,
  });
  if (response.stop_reason === "refusal") {
    throw new Error(`모델이 거절했습니다 (${response.stop_details?.category ?? "분류 없음"})`);
  }
  if (response.stop_reason === "max_tokens") throw new Error("응답이 max_tokens 에서 잘렸습니다");
  const text = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
  if (!text) throw new Error("빈 응답");
  const { input_tokens: inTok, output_tokens: outTok } = response.usage;
  return { text, tokens: `${inTok}+${outTok} tok, ${response.model}` };
}

async function translate(ko, lang) {
  const system = systemPrompt(LANGS[lang]);

  const body = await callClaude({
    system,
    messages: [{ role: "user", content: `Translate this Korean markdown body.\n\n${ko.content.trim()}` }],
  });

  const meta = await callClaude({
    system,
    messages: [
      {
        role: "user",
        content:
          "Translate the title and summary of the same post. Return JSON with the same keys.\n\n" +
          JSON.stringify({ title: String(ko.data.title ?? ""), summary: String(ko.data.summary ?? "") }),
      },
    ],
    output_config: {
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          properties: { title: { type: "string" }, summary: { type: "string" } },
          required: ["title", "summary"],
          additionalProperties: false,
        },
      },
    },
  });
  const { title, summary } = JSON.parse(meta.text);

  // 모델이 본문을 코드 블록으로 감싸 오면 벗긴다
  const fenced = body.text.match(/^```(?:markdown|md)?\n([\s\S]*)\n```$/);
  return { title, summary, body: fenced ? fenced[1] : body.text, tokens: [body.tokens, meta.tokens] };
}

// ── 실행 ─────────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const args = { slug: null, dryRun: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--dry-run") args.dryRun = true;
    else if (argv[i] === "--slug") args.slug = argv[++i];
    else throw new Error(`알 수 없는 인자: ${argv[i]}`);
  }
  return args;
}

async function main() {
  const { slug, dryRun } = parseArgs(process.argv.slice(2));
  const slugs = slug ? [slug] : readdirSync(NEWS_DIR).filter((s) => existsSync(join(NEWS_DIR, s, "ko.md")));
  if (slug && !existsSync(join(NEWS_DIR, slug, "ko.md"))) {
    throw new Error(`content/news/${slug}/ko.md 가 없습니다`);
  }

  const jobs = [];
  for (const s of slugs) {
    const dir = join(NEWS_DIR, s);
    const hash = sourceHash(readFileSync(join(dir, "ko.md"), "utf8"));
    for (const lang of Object.keys(LANGS)) {
      const reason = needsTranslation(dir, lang, hash);
      if (reason) jobs.push({ slug: s, lang, reason, dir, hash });
    }
  }

  console.log(`[translate] 모델 ${MODEL} · 대상 ${jobs.length}건${dryRun ? " (dry-run)" : ""}`);
  for (const j of jobs) console.log(`  - ${j.slug}/${j.lang}.md — ${j.reason}`);
  if (dryRun || jobs.length === 0) return 0;

  if (!(process.env.ANTHROPIC_API_KEY || "").trim()) {
    console.error(
      "[translate] ANTHROPIC_API_KEY 가 없습니다.\n" +
        "  GitHub Actions: 저장소 Settings → Secrets and variables → Actions 에 ANTHROPIC_API_KEY 를 추가하세요.\n" +
        "  로컬: export ANTHROPIC_API_KEY=... 후 다시 실행하거나, --dry-run 으로 대상만 확인하세요.",
    );
    return 1;
  }

  let failed = 0;
  for (const j of jobs) {
    const koRaw = readFileSync(join(j.dir, "ko.md"), "utf8");
    const ko = matter(koRaw);
    const label = `${j.slug}/${j.lang}.md`;
    try {
      const out = await translate(ko, j.lang);
      const problems = validate(
        `${ko.data.title ?? ""}\n${ko.data.summary ?? ""}\n${ko.content}`,
        `${out.title}\n${out.summary}\n${out.body}`,
        j.lang,
      );
      if (problems.length) {
        failed++;
        console.error(`  ✗ ${label} — 검증 실패, 쓰지 않음: ${problems.join(" · ")}`);
        continue;
      }
      writeFileSync(join(j.dir, `${j.lang}.md`), buildFile(koRaw, out, j.hash), "utf8");
      console.log(`  ✓ ${label} (${out.tokens.join(" / ")})`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${label} — ${err instanceof Error ? err.message : err}`);
    }
  }
  console.log(`[translate] 완료 ${jobs.length - failed} · 실패 ${failed}`);
  return failed ? 1 : 0;
}

// 직접 실행할 때만 돈다 (검증 함수만 import 해서 시험할 수 있게)
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().then(
    (code) => process.exit(code),
    (err) => {
      console.error(`[translate] ${err instanceof Error ? err.message : err}`);
      process.exit(1);
    },
  );
}
