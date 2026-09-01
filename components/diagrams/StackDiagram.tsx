/**
 * SPEC §3 — 3단 연결 다이어그램. 인라인 SVG (이미지 파일 아님).
 * 데스크톱: 가로 3단 + 사이 화살표 / 모바일: 세로 3단 + 아래 화살표.
 * 각 블록 클릭 → SECTION 03의 해당 카드로 스크롤.
 */

const BLOCKS = [
  {
    title: "A-Block",
    ko: "공간",
    en: ["Modular", "Growing Space"],
    href: "#a-block",
  },
  {
    title: "DLight",
    ko: "제어",
    en: ["Light", "Optimization"],
    href: "#dlight",
  },
  {
    title: "AI Farm OS",
    ko: "운영 · 데이터",
    en: ["Data &", "Control"],
    href: "#ai-farm-os",
  },
];

function ArrowRight({ x, y }: { x: number; y: number }) {
  return (
    <g aria-hidden transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="40" y2="0" className="stroke-blue" strokeWidth="1.5" />
      <path d="M40 -5 L50 0 L40 5 Z" className="fill-blue" />
    </g>
  );
}

function ArrowDown({ x, y }: { x: number; y: number }) {
  return (
    <g aria-hidden transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="0" y2="30" className="stroke-blue" strokeWidth="1.5" />
      <path d="M-5 30 L0 40 L5 30 Z" className="fill-blue" />
    </g>
  );
}

export default function StackDiagram() {
  return (
    <>
      {/* 데스크톱: 가로 3단 */}
      <svg
        viewBox="0 0 1000 200"
        role="group"
        aria-label="A-Block(공간) → DLight(제어) → AI Farm OS(운영 · 데이터) 3단 구성도"
        className="hidden w-full md:block"
      >
        {BLOCKS.map((block, i) => {
          const x = i * 360;
          return (
            <g key={block.title}>
              <a href={block.href} aria-label={`${block.title} 상세로 이동`} className="group">
                <rect
                  x={x}
                  y="10"
                  width="280"
                  height="160"
                  rx="16"
                  className="fill-surface stroke-line transition-colors group-hover:stroke-blue"
                  strokeWidth="1"
                />
                <text
                  x={x + 140}
                  y="62"
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="700"
                  className="fill-ink"
                >
                  {block.title}
                </text>
                <text
                  x={x + 140}
                  y="94"
                  textAnchor="middle"
                  fontSize="15"
                  className="fill-blue"
                >
                  {block.ko}
                </text>
                <text
                  x={x + 140}
                  y="126"
                  textAnchor="middle"
                  fontSize="12"
                  letterSpacing="1.1"
                  className="fill-caption"
                >
                  {block.en[0].toUpperCase()}
                </text>
                <text
                  x={x + 140}
                  y="146"
                  textAnchor="middle"
                  fontSize="12"
                  letterSpacing="1.1"
                  className="fill-caption"
                >
                  {block.en[1].toUpperCase()}
                </text>
              </a>
              {i < BLOCKS.length - 1 && <ArrowRight x={x + 295} y={90} />}
            </g>
          );
        })}
      </svg>

      {/* 모바일: 세로 3단 */}
      <svg
        viewBox="0 0 320 620"
        role="group"
        aria-label="A-Block(공간) → DLight(제어) → AI Farm OS(운영 · 데이터) 3단 구성도"
        className="mx-auto block w-full max-w-[320px] md:hidden"
      >
        {BLOCKS.map((block, i) => {
          const y = i * 220;
          return (
            <g key={block.title}>
              <a href={block.href} aria-label={`${block.title} 상세로 이동`}>
                <rect
                  x="0"
                  y={y}
                  width="320"
                  height="160"
                  rx="16"
                  className="fill-surface stroke-line"
                  strokeWidth="1"
                />
                <text
                  x="160"
                  y={y + 52}
                  textAnchor="middle"
                  fontSize="24"
                  fontWeight="700"
                  className="fill-ink"
                >
                  {block.title}
                </text>
                <text x="160" y={y + 84} textAnchor="middle" fontSize="15" className="fill-blue">
                  {block.ko}
                </text>
                <text
                  x="160"
                  y={y + 116}
                  textAnchor="middle"
                  fontSize="12"
                  letterSpacing="1.1"
                  className="fill-caption"
                >
                  {block.en[0].toUpperCase()}
                </text>
                <text
                  x="160"
                  y={y + 136}
                  textAnchor="middle"
                  fontSize="12"
                  letterSpacing="1.1"
                  className="fill-caption"
                >
                  {block.en[1].toUpperCase()}
                </text>
              </a>
              {i < BLOCKS.length - 1 && <ArrowDown x={160} y={y + 175} />}
            </g>
          );
        })}
      </svg>
    </>
  );
}
