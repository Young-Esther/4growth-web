type Props = {
  children: React.ReactNode;
  /** 특허 출원 등 강조가 필요한 태그 */
  tone?: "neutral" | "blue";
};

/**
 * SPEC §1 — 상태 태그 컴포넌트.
 * "개발 중 · 시제품 제작 단계" 같은 정직한 상태 표시를 pill 로 재사용한다.
 */
export default function StatusPill({ children, tone = "neutral" }: Props) {
  const toneClass =
    tone === "blue"
      ? "border-blue/30 bg-blue/[0.08] text-blue"
      : "border-line bg-surface text-caption";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium leading-none ${toneClass}`}
    >
      {children}
    </span>
  );
}
