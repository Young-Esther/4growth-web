/** 카드 하단 "자세히 보기 →" · "전체 보기 →" 표시. 링크 자체는 감싸는 쪽이 건다. */
export default function ArrowText({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-bold text-blue">
      {children}
      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
        →
      </span>
    </span>
  );
}
