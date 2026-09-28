#!/usr/bin/env node
/**
 * 번역 키 검사 (SPEC §1, §8).
 *
 * 1. 누락 키   — ko.json 을 기준으로 en/vi 에 없는 키 (배열 길이 차이 포함). 있으면 실패.
 * 2. 여분 키   — ko.json 에 없는데 en/vi 에만 있는 키. 경고.
 * 3. 원고 대조 — 모든 문자열이 docs/COPY.md · SPEC.md · SPEC_v0.1.md 에 그대로 있는지. 없으면 경고.
 *                (COPY 문장을 한 글자도 바꾸지 않는다는 원칙의 기계 검사)
 *                영문 섹션 라벨은 SPEC 에 대문자로 적혀 있고 화면에서 CSS 로 대문자 처리하므로
 *                대소문자만 다른 것은 통과시킨다.
 * 4. 소식 글   — draft 가 아닌 글에 `[확인 필요]`·`[TBD]` 같은 미확정 표시가 남아 있으면 실패.
 *
 * 사용: node scripts/i18n-check.mjs          → 누락이 있으면 exit 1
 *       node scripts/i18n-check.mjs --warn   → 항상 exit 0 (prebuild 용, 목록만 출력)
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const warnOnly = process.argv.includes("--warn");
const LOCALES = ["ko", "en", "vi"];
const BASE = "ko";

const load = (locale) =>
  JSON.parse(readFileSync(join(root, "messages", `${locale}.json`), "utf8"));

/** { "a.b.0.c": "문자열" } 형태로 편다 */
function flatten(value, prefix = "", out = new Map()) {
  if (Array.isArray(value)) {
    value.forEach((v, i) => flatten(v, prefix ? `${prefix}.${i}` : String(i), out));
  } else if (value && typeof value === "object") {
    for (const [k, v] of Object.entries(value)) flatten(v, prefix ? `${prefix}.${k}` : k, out);
  } else {
    out.set(prefix, value);
  }
  return out;
}

const messages = Object.fromEntries(LOCALES.map((l) => [l, flatten(load(l))]));
const base = messages[BASE];

let missingCount = 0;
let warnCount = 0;

for (const locale of LOCALES.filter((l) => l !== BASE)) {
  const target = messages[locale];
  const missing = [...base.keys()].filter((k) => !target.has(k));
  const extra = [...target.keys()].filter((k) => !base.has(k));
  missingCount += missing.length;
  warnCount += extra.length;
  for (const k of missing) console.warn(`[i18n] 누락 ${locale}: ${k}`);
  for (const k of extra) console.warn(`[i18n] 여분 ${locale}: ${k} (ko 에 없음)`);
}

// 원고 대조
const normalize = (s) => s.replace(/\\\|/g, "|").replace(/\*\*/g, "");
const sources = normalize(
  ["docs/COPY.md", "docs/SPEC.md", "docs/SPEC_v0.1.md"].map((f) => readFileSync(join(root, f), "utf8")).join("\n"),
);
const sourcesLower = sources.toLowerCase();
for (const locale of LOCALES) {
  for (const [key, value] of messages[locale]) {
    if (typeof value !== "string" || value === "") continue;
    if (!sources.includes(value) && !sourcesLower.includes(value.toLowerCase())) {
      warnCount++;
      console.warn(`[i18n] 원고에 없는 문장 ${locale}: ${key} = "${value}"`);
    }
  }
}

// 소식 글
const newsDir = join(root, "content", "news");
const UNRESOLVED = /\[(확인 필요|TBD|박람회명|Expo name|Tên triển lãm)[^\]]*\]/;
let newsErrors = 0;
if (existsSync(newsDir)) {
  for (const slug of readdirSync(newsDir)) {
    for (const locale of LOCALES) {
      const file = join(newsDir, slug, `${locale}.md`);
      if (!existsSync(file)) continue;
      const { data, content } = matter(readFileSync(file, "utf8"));
      if (data.draft) continue;
      if (UNRESOLVED.test(content) || UNRESOLVED.test(JSON.stringify(data))) {
        newsErrors++;
        console.warn(`[news] 미확정 표시가 남은 게시 글: content/news/${slug}/${locale}.md`);
      }
    }
  }
}

console.log(
  `[i18n] 누락 키 ${missingCount}개 · 경고 ${warnCount}개 · 게시 글 오류 ${newsErrors}개 (키 ${base.size}개 × ${LOCALES.length}개 언어)`,
);

if (!warnOnly && (missingCount > 0 || newsErrors > 0)) process.exit(1);
