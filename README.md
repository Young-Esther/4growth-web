# 4growth 홈페이지 v0.1

포그로우스(4growth) 회사 홈페이지. 단일 페이지 + 앵커(`#technology` `#field` `#applications` `#contact`).

명세는 [`docs/SPEC.md`](docs/SPEC.md) 하나다.

- Next.js 15 (App Router) · TypeScript · Tailwind CSS 3
- 배포 대상: Vercel (GitHub main push → 자동 배포)

## 로컬 실행

```bash
npm install
cp .env.example .env.local   # Formspree endpoint 입력
npm run dev                  # http://localhost:3000
```

프로덕션 빌드 확인:

```bash
npm run build && npm run start
```

## 환경변수

| 변수 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_FORMSPREE_ENDPOINT` | ✅ | 문의폼 전송 대상. Formspree에서 폼 생성(수신 4orgrow@gmail.com) 후 발급되는 `https://formspree.io/f/xxxxxxxx`. 미설정 시 폼 전송은 실패 메시지를 띄운다. |
| `NEXT_PUBLIC_SITE_URL` | — | 절대 URL(OG·sitemap·robots용). 미설정 시 Vercel 배포 URL로 대체. 도메인 확정 후 등록. |

Vercel에서는 두 변수를 Project Settings → Environment Variables에 등록한다.

## 이미지 넣는 법

이미지 슬롯은 `lib/assets.ts` 한 곳에서 관리한다. 파일을 `public/assets/`에 넣고
해당 슬롯의 `src`를 채우면 회색 플레이스홀더가 `next/image`로 자동 교체된다.

```ts
"I-01": { label: "A-Block 메인 렌더링", src: "/assets/a-block-hero.webp" },
```

현재 비어 있는 슬롯: `I-01` `I-03` `I-04` `S-01` `P-01` `B-01` `B-03` `LOGO`
(+ OG 이미지 `public/assets/og.png`, favicon).

`LOGO`가 비어 있는 동안 헤더·푸터는 `4GROWTH` 워드마크 텍스트로 표시된다.

## 남은 `[확인 필요]`

코드에서 `TODO(SPEC` 으로 검색하면 전부 나온다.

```bash
grep -rn "TODO(SPEC" app components lib
```

- 도메인 (SPEC §0) — 카탈로그 인쇄 전 필수
- 로고 그린 컬러값 (§1)
- 회사명 · 소재지 · 대표번호 공개 여부 (§9)
- 숫자 스트립 `~20 유통 매장`, `40 교육용 키트` (§5)
- 친환경 화훼 인증 배지 (§5)
- OG 이미지, favicon (§10, §11)

## 구조

```
app/
  layout.tsx      메타·OG·Pretendard CDN
  page.tsx        섹션 조립
  sitemap.ts  robots.ts
components/
  sections/       Header Hero TechStack TechDetail Field RnD Applications Contact Footer
  diagrams/       StackDiagram DLightGraph  (인라인 SVG, 이미지 파일 아님)
  ui/             AssetSlot FadeIn Logo SectionLabel StatusPill
lib/
  assets.ts       이미지 슬롯 매니페스트
  site.ts         사이트 절대 URL
```
