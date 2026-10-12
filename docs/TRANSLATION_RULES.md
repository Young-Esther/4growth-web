# 소식 번역 규칙 (KO → EN · VI)

4growth 홈페이지(4growth.co.kr)의 소식 번역 기준이다. HQ 가 공개 소식을 영어·베트남어로 번역할 때 이 규칙을 그대로 쓴다.

- 기준 구현: 홈페이지 저장소 `scripts/translate-news.mjs` (저장소 안 마크다운 글용)
- 이 문서와 스크립트가 다르면 스크립트가 맞다. 한쪽을 바꾸면 다른 쪽도 같이 바꾼다.

## 1. 시스템 프롬프트

아래 문장을 그대로 쓴다. `{English|Vietnamese}` 자리만 대상 언어로 바꾼다.

```
You translate Korean news posts for the 4growth company website into {English|Vietnamese}.
Rules:
- Translate faithfully. Do not add, remove, soften or exaggerate any fact, number, date or claim.
- Never translate these names: 4growth, A-Block, DLight, AI Farm OS, MPS-ABC, 차담 → Chadam.
- "특허 출원" = EN "patent application filed" / "patent pending"; VI "đã nộp đơn sáng chế". Never write "patented" or "đã được cấp bằng".
- Never add health or efficacy claims.
- Keep placeholders like [확인 필요] or [TBD] exactly as they are.
- Keep markdown structure. Keep the tone short and factual, matching docs/COPY.md.
- Vietnamese: natural business Vietnamese, not word-for-word.
- Always write numbers as Arabic numerals, including ordinals (e.g. 2회차 → 2nd round, 제2회 → 2nd). Never spell numbers out as words.
Output only the translated markdown body, no commentary.
```

HQ 는 본문이 HTML(`body_html`)이다. `Keep markdown structure` 줄은 "태그와 속성(href·src 등)은 그대로 두고 글자만 번역한다"로 읽는다. 문장을 바꿀지는 HQ 가 정한다.

## 2. 호출 방식 (홈페이지 기준)

| 항목 | 값 |
|---|---|
| 모델 | `claude-sonnet-5-5` (환경변수 `ANTHROPIC_MODEL` 로 바꿀 수 있다) |
| 본문 | 위 시스템 프롬프트로 한 번 호출. 응답 전체가 번역된 본문이다 |
| 제목·요약 | 같은 시스템 프롬프트로 따로 호출. `{ "title", "summary" }` JSON 구조화 출력으로 받는다 |
| 거절 | 서버 쪽 대체 실행(`fallbacks: "default"`)을 켠다. 그래도 `stop_reason` 이 `refusal` 이면 실패로 처리한다 |
| 잘림 | `stop_reason` 이 `max_tokens` 이면 실패로 처리한다 |
| 언어 | EN·VI 를 따로 호출하고, 한 언어가 실패해도 다른 언어는 쓴다 |

## 3. 번역 후 검증

원문(제목 + 요약 + 본문)과 번역문(제목 + 요약 + 본문)에서 아래 네 가지 **개수**를 센다. 하나라도 다르면 그 언어 번역은 **게시하지 않고** 실패로 남긴다. 사람이 고치거나 다시 번역한다.

| 항목 | 세는 것 |
|---|---|
| URL | `http://` · `https://` 주소. 마크다운이면 상대 경로 링크·이미지 대상 `](/news/a.jpg)` 도 센다 |
| 표시 | `[확인 필요]`, `[TBD]` |
| 날짜 | 아래 언어별 날짜 표기 |
| 숫자 | 위 셋과 `4growth` 를 지운 뒤 남은 숫자 덩어리 `\d+(?:[.,]\d+)*` (예: `1,000` · `1.5` 는 1개) |

### 세는 순서

순서가 바뀌면 결과가 달라진다. 앞 단계에서 센 것은 지운 뒤 다음 단계로 간다.

1. 줄끝을 LF 로 맞춘다
2. URL 을 세고 지운다
3. `[확인 필요]`·`[TBD]` 를 세고 지운다. `4growth` 는 세지 않고 지운다 — 회사명의 4 가 숫자로 잡히지 않게
4. 날짜를 세고 지운다 (대소문자 무시)
5. 세지 않는 달 표기를 지운다 (아래 "지우기만")
6. 남은 숫자를 센다

### 언어별 날짜 표기

| 언어 | 날짜 1건으로 센다 | 지우기만 (세지 않음) |
|---|---|---|
| KO | `2026년 8월 24일` · `2026년 8월` · `8월 24일` · `2026.08.24` / `2026-08-24` / `2026/08/24` | 연·일 없는 달 `9월` |
| EN | `August 24, 2026` · `24 August 2026` · `24th of August, 2026` · `August 2026` · `August 24` (약어 `Aug.` 포함) · `2026-08-24` | 없음 |
| VI | `ngày 24 tháng 8 năm 2026` · `ngày 24/8/2026` · `ngày 24 tháng 8` · `24/08/2026` · `tháng 8 năm 2026` · `tháng 8/2026` · `2026-08-24` | 연·일 없는 달 `tháng 9` |

- 연·일 없는 달을 세지 않는 이유: KO `9월` 은 EN 에서 `September`(숫자 없음)가 된다. 세면 맞는 번역이 실패로 나온다.
- 정확한 정규식은 스크립트의 `DATES` 에 있다.

### HTML 본문에 쓸 때 (HQ)

스크립트는 마크다운 기준이다. HQ 의 `body_html` 에는 다음처럼 맞춘다.

- URL 은 `href`·`src` 속성 값을 하나씩 센다. 상대 경로(`/uploads/…`)도 센다.
- 숫자·날짜·표시는 태그를 걷어 낸 글자에서만 센다. `width="2000"` 이나 파일 이름의 숫자가 잡히지 않게 하기 위해서다.

### 알려진 한계

- 숫자를 단어로 바꾸면 실패로 나온다(예: `2회차` → `second`). 그래서 시스템 프롬프트에 아라비아 숫자 규칙을 넣었다. 검증은 완화하지 않는다.
- 개수만 비교한다. `3` 이 `4` 로 바뀌어 개수가 같으면 통과한다. 숫자 개수가 다를 때는 실패 메시지에 원문·번역의 숫자 목록이 같이 나온다.

## 4. 공개 API 에 번역을 싣는 형식

홈페이지는 HQ 공개 API(`/api/public/4growth/posts`, `/posts/{slug}`)를 60초마다 다시 읽는다. 번역은 같은 필드에 언어별 객체로 싣는다.

```jsonc
{
  "title":     "한국어 제목",                                   // 지금처럼 문자열 = 한국어만
  "excerpt":   { "ko": "요약", "en": "Summary", "vi": "Tóm tắt" },  // 또는 언어별 객체
  "body_html": { "ko": "<p>…</p>", "en": "<p>…</p>" }             // 없는 언어는 키를 빼거나 빈 문자열
}
```

| 규칙 | 내용 |
|---|---|
| 형식 | `title`·`excerpt`·`body_html` 은 각각 문자열(한국어만) 또는 `{ ko, en?, vi? }` |
| 한국어 | 객체로 보낼 때 `ko` 는 반드시 있어야 한다. `title.ko` 가 없으면 그 글은 목록에서 빠지고 상세는 "소식을 불러오지 못했습니다"로 나온다 |
| 목록 카드 | 그 언어 `title` 이 있으면 그 언어로 보인다. 요약도 같은 언어 값만 쓴다(없으면 요약 없이) |
| 상세 페이지 | `title` 과 `body_html` 이 **둘 다** 그 언어로 있어야 그 언어로 보인다. 하나라도 없으면 한국어 본문 + "이 글은 한국어로만 제공됩니다" — 한 페이지에 언어를 섞지 않는다 |
| 상세의 요약 | 목록의 같은 언어 `excerpt`. 없으면 본문 앞 120자 |
| 그대로인 것 | `slug`·`category`·`published_at`·`cover_url`·`images` 는 언어와 무관하다 |

검증에 실패한 언어는 키를 빼고 보낸다. 그러면 그 언어 페이지는 한국어 + 안내로 나온다. 틀린 번역이 게시되는 것보다 낫다.

## 5. 사람이 고친 번역

홈페이지 파일 글은 번역 파일에 `auto: false` 가 있으면 다시 번역하지 않고, `auto: true` 면 원문이 바뀔 때(`source_hash` = 원문 sha256 앞 12자리) 다시 번역한다. HQ 도 같은 원칙을 쓴다.

- 사람이 고친 번역은 자동 번역으로 덮어쓰지 않는다.
- 자동 번역은 원문이 바뀌었을 때만 다시 만든다.
- draft(비공개) 글은 번역하지 않고, 게시할 때 번역한다.
