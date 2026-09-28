import type { AssetId } from "@/lib/assets";

/**
 * SPEC §3-3 — 사업영역 > 브랜드 데이터.
 *
 * 브랜드를 추가할 때(예: 꽃양꽃색)는
 *   1) 아래 BRANDS 에 항목 하나
 *   2) messages/{ko,en,vi}.json 의 `brands.<slug>` (name · slogan · desc)
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
};

export const BRANDS: Brand[] = [
  { slug: "chadam", href: "/business/chadam", image: "CH-01" },
];

/* ─── 차담 전용 (SPEC §3-4). 이 색은 차담 페이지에서만 쓴다. ─── */

/**
 * TODO(SPEC 0-1 · [확인 필요]): 차담 4색 HEX — 패키지 원본에서 추출해 교체한다.
 *   햇살 노랑 / 한낮 초록 / 노을 주황 / 달밤 남색.
 *   확정 전까지는 서로 구분만 되는 회색 계열을 임시로 쓴다.
 */
export const CHADAM_COLORS = {
  haetsal: "#D4D4D8", // TODO: 햇살 노랑
  hannat: "#A1A1AA", // TODO: 한낮 초록
  noeul: "#71717A", // TODO: 노을 주황
  dalbam: "#3F3F46", // TODO: 달밤 남색
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
