/**
 * SPEC §10 — 사진·이미지 준비 목록.
 *
 * 파일을 `public/assets/`에 넣고 아래 `src`(+ 원본 픽셀 크기)를 채우면 그 슬롯은
 * 자동으로 next/image 로 렌더된다. `src`가 null인 슬롯은 ID가 표시된 회색
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
  /** 원본 픽셀 크기 */
  width?: number;
  height?: number;
  /** 슬롯 박스 안에서의 맞춤 방식. 렌더링·도면·캡처는 잘리면 안 되므로 contain. */
  fit?: "cover" | "contain";
  /** 어두운 배경용 흰색 변형 (LOGO 전용) */
  srcWhite?: string;
};

export const ASSETS: Record<AssetId, AssetEntry> = {
  // 카탈로그 1p A-Block 메인 렌더링. 박람회 후 실사로 교체 예정 (SPEC §2).
  "I-01": {
    label: "A-Block 메인 렌더링",
    src: "/assets/a-block-hero.png",
    width: 1448,
    height: 1086,
    fit: "contain",
  },
  // 라벨 없는 도면으로 교체됨 — 부품 라벨은 TechDetail에서 HTML로 병기한다.
  "I-03": {
    label: "A-Block 아이소메트릭 구조도",
    src: "/assets/a-block-structure.png",
    width: 1331,
    height: 1710,
    fit: "contain",
  },
  "I-04": {
    label: "1 → 2 → 3 모듈 확장",
    src: "/assets/a-block-modules.png",
    width: 2393,
    height: 1020,
    fit: "contain",
  },
  // TODO(SPEC §10): S-01 은 카탈로그 7p 캡처. 최신 GUI로 갱신할지 확인 필요.
  "S-01": {
    label: "AI Farm OS 화면",
    src: "/assets/farm-os.png",
    width: 2872,
    height: 1606,
    fit: "contain",
  },
  "P-01": {
    label: "농장 전경",
    src: "/assets/field.jpg",
    width: 4134,
    height: 2756,
    fit: "cover",
  },
  // TODO(SPEC §10): 제어보드 매크로 — 촬영 필요 (박람회 전 B-01 또는 B-03 중 1장 필수)
  "B-01": { label: "제어보드 매크로", src: null },
  // TODO(SPEC §10): 제어함 내부 — 촬영 필요 (B-01 대체)
  "B-03": { label: "제어함 내부", src: null },
  LOGO: {
    label: "4GROWTH 로고",
    src: "/assets/logo.svg",
    srcWhite: "/assets/logo-white.svg",
    width: 115,
    height: 27,
    fit: "contain",
  },
};
