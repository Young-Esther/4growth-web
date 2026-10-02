import type { AssetId } from "@/lib/assets";

/**
 * SPEC §3-3 — 사업영역 > 브랜드 데이터.
 *
 * 브랜드를 추가할 때(예: 꽃양꽃색)는
 *   1) 아래 BRANDS 에 항목 하나
 *   2) messages/{ko,en,vi}.json 의 `brands.<slug>` (name · slogan · desc · imageAlt)
 *   3) app/[locale]/business/<slug>/page.tsx
 * 만 늘리면 된다. 사업영역 카드 그리드와 홈 미리보기는 이 배열을 그대로 쓴다.
 * 빈 자리나 "Coming soon" 카드는 만들지 않는다 (SPEC §7).
 */
export type Brand = {
  /** messages 의 `brands.<slug>` 키이자 경로 조각 */
  slug: "chadam";
  href: `/business/${string}`;
  /** 대표 사진 슬롯. 파일이 없으면(null 슬롯) 카드는 사진 없이 렌더된다. */
  image: AssetId;
  /** 카드 이름 옆 상태 태그(StatusPill)의 messages 키. 없으면 태그 없음. */
  status?: string;
};

export const BRANDS: Brand[] = [
  // TODO(SPEC §3-4): 출시(2027.01) 후 status 제거.
  { slug: "chadam", href: "/business/chadam", image: "CH-01", status: "chadam.launch.tag" },
];

/* ─── 차담 전용 (SPEC §3-4). 이 색은 차담 페이지에서만 쓴다. ─── */

/**
 * 차담 4색 HEX — 패키지 이미지(CH-01)에서 추출한 임시값.
 * TODO(SPEC 0-1): 인쇄 원본 색이 나오면 교체한다.
 */
export const CHADAM_COLORS = {
  haetsal: "#CE7F0A", // 햇살 노랑
  hannat: "#52430E", // 한낮 초록
  noeul: "#B53A12", // 노을 주황
  dalbam: "#182337", // 달밤 남색
} as const;

export type ChadamTeaIcon = "sunrise" | "sun" | "sunset" | "moon";

/** messages `chadam.teas` 배열과 같은 순서 (아침 → 점심 → 오후 → 밤) */
export const CHADAM_TEAS: { key: keyof typeof CHADAM_COLORS; icon: ChadamTeaIcon }[] = [
  { key: "haetsal", icon: "sunrise" },
  { key: "hannat", icon: "sun" },
  { key: "noeul", icon: "sunset" },
  { key: "dalbam", icon: "moon" },
];

/**
 * 홍보영상 (SPEC §3-4 4번, §6 CH-V). 파일이 없으면 영상 섹션을 렌더링하지 않는다.
 * ≤15MB, H.264. 자동재생하지 않는다.
 */
export const CHADAM_VIDEO = {
  src: "/assets/chadam/promo.mp4",
  poster: "/assets/chadam/promo-poster.jpg",
};
