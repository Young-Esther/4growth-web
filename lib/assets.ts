/**
 * SPEC §10 (v0.1), §6 (v0.2) — 사진·이미지 준비 목록.
 *
 * 슬롯 값이 배열이면 AssetSlot 이 캐러셀로, 단일 객체면 next/image 한 장으로 렌더한다.
 * 값이 null 이면 아직 파일이 없는 슬롯이다. AssetSlot 은 아무것도 렌더하지 않는다.
 */
export type AssetId =
  | "I-01"
  | "I-03"
  | "I-04"
  | "S-01"
  | "P-01"
  | "B-01"
  | "LOGO"
  // v0.2 차담 (SPEC §6). 경로: public/assets/chadam/
  | "CH-01"
  | "CH-02"
  | "CH-03";

export type AssetImage = {
  /** public 기준 경로 */
  src: string;
  /** 원본 픽셀 크기 */
  width: number;
  height: number;
  /** next/image 의 alt */
  alt: string;
  /** 슬롯 박스 안에서의 맞춤 방식. 렌더링·도면·캡처는 잘리면 안 되므로 contain. */
  fit?: "cover" | "contain";
  /** 어두운 배경용 흰색 변형 (LOGO 전용) */
  srcWhite?: string;
};

export type AssetEntry = AssetImage | AssetImage[];

/** 배열 슬롯에서 대표 1장 (크기·fit 조회용) */
export function firstImage(entry: AssetEntry): AssetImage {
  return Array.isArray(entry) ? entry[0] : entry;
}

/** 파일이 들어온 슬롯인지 */
export function hasAsset(id: AssetId): boolean {
  return ASSETS[id] !== null;
}

export const ASSETS: Record<AssetId, AssetEntry | null> = {
  // 카탈로그 1p A-Block 메인 렌더링. 박람회 후 실사로 교체 예정 (SPEC §2).
  "I-01": {
    src: "/assets/a-block-hero.png",
    width: 1448,
    height: 1086,
    alt: "A-Block 메인 렌더링",
    fit: "contain",
  },
  // 라벨 없는 도면으로 교체됨 — 부품 라벨은 TechDetail에서 HTML로 병기한다.
  "I-03": {
    src: "/assets/a-block-structure.png",
    width: 1331,
    height: 1710,
    alt: "A-Block 아이소메트릭 구조도",
    fit: "contain",
  },
  "I-04": {
    src: "/assets/a-block-modules.png",
    width: 2393,
    height: 1020,
    alt: "1 → 2 → 3 모듈 확장",
    fit: "contain",
  },
  "S-01": {
    src: "/assets/farm-os.png",
    width: 2872,
    height: 1606,
    alt: "AI Farm OS 화면",
    fit: "contain",
  },
  // SPEC §5 — 포그로우스 자체 현장. 캐러셀로 4장을 넘긴다.
  "P-01": [
    {
      src: "/assets/field-01.jpg",
      width: 2400,
      height: 1028,
      alt: "포그로우스 온실 — 리시안셔스 재배 베드",
      fit: "cover",
    },
    {
      src: "/assets/field-02.jpg",
      width: 2400,
      height: 1028,
      alt: "포그로우스 온실 — 거베라 재배 베드 전경",
      fit: "cover",
    },
    {
      src: "/assets/field-03.jpg",
      width: 2400,
      height: 1028,
      alt: "포그로우스 온실 — 거베라 재배 베드, 오후",
      fit: "cover",
    },
    {
      src: "/assets/field-04.jpg",
      width: 2400,
      height: 1028,
      alt: "포그로우스 온실 — 거베라 개화",
      fit: "cover",
    },
  ],
  "B-01": {
    src: "/assets/board.jpg",
    width: 2400,
    height: 436,
    alt: "포그로우스 제어반 시제품",
    fit: "cover",
  },
  LOGO: {
    src: "/assets/logo.svg",
    srcWhite: "/assets/logo-white.svg",
    width: 115,
    height: 27,
    alt: "4GROWTH",
    fit: "contain",
  },
  // SPEC §6 CH-01 — 차담 패키지 연출 사진. 차담 Hero · 브랜드 카드 · 홈 미리보기.
  //   OG 크롭(1200×630, 세로 190~950px)은 /assets/chadam/og.jpg — 차담 페이지 metadata 에서 쓴다.
  //   번역 alt 는 messages `brands.chadam.imageAlt` (COPY §차담 > 이미지 alt).
  "CH-01": {
    src: "/assets/chadam/set.jpg",
    width: 1448,
    height: 1086,
    alt: "차담 기프트 세트 — 햇살차, 한낮차, 노을차, 달밤차",
    fit: "cover",
  },
  // TODO(SPEC §6 CH-02 · 권장): 4종 티백 나란히 — 차담 패키지 섹션.
  "CH-02": null,
  // TODO(SPEC §6 CH-03 · 선택): 연출컷 (테이블·찻잔) — 차담 패키지 캐러셀.
  "CH-03": null,
};
