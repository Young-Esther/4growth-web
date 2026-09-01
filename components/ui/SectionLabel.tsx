/**
 * SPEC §1 — 섹션 라벨: 좌상단 영문 라벨 + 번호 (예: `01 — TECHNOLOGY`)
 */
export default function SectionLabel({ children }: { children: string }) {
  return (
    <p className="label-en mb-4 flex items-center gap-3 text-blue">
      <span aria-hidden className="h-px w-8 bg-blue" />
      {children}
    </p>
  );
}
