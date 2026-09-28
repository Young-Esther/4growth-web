import type { ChadamTeaIcon } from "@/lib/brands";

/**
 * SPEC §3-4 2번 — 4종 카드 아이콘: 일출 / 태양 / 일몰 / 초승달. 인라인 SVG 라인 아이콘.
 * 색은 currentColor 를 따른다 (카드에서 차 색을 지정).
 */
export default function TeaIcon({ icon, className = "" }: { icon: ChadamTeaIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      aria-hidden
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {icon === "sunrise" && (
        <>
          <path d="M8 22a8 8 0 0 1 16 0" />
          <path d="M4 22h24M16 7v4M7.5 12.5l2.1 2.1M24.5 12.5l-2.1 2.1M11 26h10" />
        </>
      )}
      {icon === "sun" && (
        <>
          <circle cx="16" cy="16" r="5.5" />
          <path d="M16 4v3M16 25v3M4 16h3M25 16h3M7.5 7.5l2.1 2.1M22.4 22.4l2.1 2.1M24.5 7.5l-2.1 2.1M9.6 22.4l-2.1 2.1" />
        </>
      )}
      {icon === "sunset" && (
        <>
          <path d="M8 20a8 8 0 0 1 16 0" />
          <path d="M4 20h24M8 24h16M12 28h8M16 5v5M13 8l3 3 3-3" />
        </>
      )}
      {icon === "moon" && <path d="M21.5 5.5a11 11 0 1 0 5 14.2A9 9 0 0 1 21.5 5.5Z" />}
    </svg>
  );
}
