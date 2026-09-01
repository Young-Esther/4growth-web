/**
 * SPEC §10 — 사진·이미지 준비 목록.
 *
 * 파일을 `public/assets/`에 넣고 아래 `src`를 채우면 그 슬롯은 자동으로
 * next/image 로 렌더된다. `src`가 null인 슬롯은 ID가 표시된 회색
 * 플레이스홀더 박스로 남는다.
 */
export type AssetId =
  | "I-01"
  | "I-03"
  | "I-04"
  | "S-01"
  | "P-01"
  | "B-01"
  | "B-03"
  | "LOGO";

export type AssetEntry = {
  /** 실제 이미지 설명 — next/image 의 alt 로 사용 */
  label: string;
  /** public 기준 경로. 파일이 준비되면 채운다. */
  src: string | null;
};

export const ASSETS: Record<AssetId, AssetEntry> = {
  // TODO(SPEC §10): 카탈로그 1p A-Block 메인 렌더링 → public/assets/a-block-hero.webp
  "I-01": { label: "A-Block 메인 렌더링", src: null },
  // TODO(SPEC §10): A-Block 아이소메트릭 구조도 (SVG 보유)
  "I-03": { label: "A-Block 아이소메트릭 구조도", src: null },
  // TODO(SPEC §10): 1 → 2 → 3 모듈 확장 그림 (SVG 보유)
  "I-04": { label: "1 → 2 → 3 모듈 확장", src: null },
  // TODO(SPEC §10): AI Farm OS 화면 캡처 (카탈로그 7p, 최신 GUI 갱신 여부 확인)
  "S-01": { label: "AI Farm OS 화면", src: null },
  // TODO(SPEC §10): 농장 실사 (넓게) — 카탈로그 8p 또는 재촬영
  "P-01": { label: "농장 전경", src: null },
  // TODO(SPEC §10): 제어보드 매크로 — 촬영 필요 (박람회 전 B-01 또는 B-03 중 1장 필수)
  "B-01": { label: "제어보드 매크로", src: null },
  // TODO(SPEC §10): 제어함 내부 — 촬영 필요 (B-01 대체)
  "B-03": { label: "제어함 내부", src: null },
  // TODO(SPEC §10): 4GROWTH 로고 SVG (컬러/화이트) — AI 원본에서 추출.
  //   준비 전까지 헤더·푸터는 워드마크 텍스트로 표시된다.
  LOGO: { label: "4GROWTH 로고", src: null },
};
