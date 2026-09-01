/**
 * SPEC §4 (03-B) — DLight 그래프. 인라인 SVG (이미지 파일 아님).
 * 자연광 곡선 + LED 보충분 + 목표 누적광량선.
 * 수치 눈금은 표기하지 않는다 (실증 전이므로 SPEC상 시뮬레이션 수치 비노출).
 */

const X0 = 56;
const X1 = 612;
const Y_BASE = 264;
const Y_TOP = 44;

/** 목표 광량선의 높이 (0~1, 1이 그래프 상단) */
const TARGET = 0.6;
/** 보광 운영 구간 */
const LIT_FROM = 0.08;
const LIT_TO = 0.92;

const px = (t: number) => X0 + t * (X1 - X0);
const py = (v: number) => Y_BASE - v * (Y_BASE - Y_TOP);

/** 자연광 유입량(정규화). 정오에 정점을 갖는 종 모양. */
function natural(t: number) {
  const v = Math.exp(-Math.pow(t - 0.5, 2) / (2 * Math.pow(0.185, 2)));
  return Math.max(0, v * 0.92 - 0.03);
}

const SAMPLES = Array.from({ length: 121 }, (_, i) => i / 120);

const naturalLine = SAMPLES.map(
  (t, i) => `${i === 0 ? "M" : "L"}${px(t).toFixed(1)} ${py(natural(t)).toFixed(1)}`,
).join(" ");

const naturalArea = `${naturalLine} L${px(1).toFixed(1)} ${Y_BASE} L${px(0).toFixed(1)} ${Y_BASE} Z`;

/** 목표선과 자연광 곡선 사이의 부족분 = LED가 보충하는 영역 */
const litSamples = SAMPLES.filter((t) => t >= LIT_FROM && t <= LIT_TO);
const ledArea = [
  `M${px(LIT_FROM).toFixed(1)} ${py(TARGET).toFixed(1)}`,
  `L${px(LIT_TO).toFixed(1)} ${py(TARGET).toFixed(1)}`,
  ...[...litSamples]
    .reverse()
    .map((t) => `L${px(t).toFixed(1)} ${py(Math.min(natural(t), TARGET)).toFixed(1)}`),
  "Z",
].join(" ");

export default function DLightGraph() {
  return (
    <svg
      viewBox="0 0 640 320"
      role="img"
      aria-label="하루 동안 유입되는 자연광 곡선과, 목표 광량에서 부족한 만큼만 LED로 보충하는 구간을 나타낸 그래프"
      className="w-full"
    >
      {/* 축 */}
      <line x1={X0} y1={Y_BASE} x2={X1} y2={Y_BASE} className="stroke-line" strokeWidth="1" />
      <line x1={X0} y1={Y_TOP - 12} x2={X0} y2={Y_BASE} className="stroke-line" strokeWidth="1" />

      {/* LED 보충분 */}
      <path d={ledArea} className="fill-blue" opacity="0.16" />
      <path d={ledArea} className="fill-none stroke-blue" strokeWidth="1" strokeDasharray="3 3" />

      {/* 자연광 */}
      <path d={naturalArea} className="fill-caption" opacity="0.14" />
      <path d={naturalLine} className="fill-none stroke-caption" strokeWidth="2" />

      {/* 목표 누적광량선 */}
      <line
        x1={X0}
        y1={py(TARGET)}
        x2={X1}
        y2={py(TARGET)}
        className="stroke-ink"
        strokeWidth="1.5"
        strokeDasharray="6 4"
      />
      <text x={X1} y={py(TARGET) - 10} textAnchor="end" fontSize="12" className="fill-ink">
        목표 누적광량
      </text>

      {/* 라벨 */}
      <text x={px(0.5)} y={py(natural(0.5)) - 12} textAnchor="middle" fontSize="12" className="fill-caption">
        자연광
      </text>
      <text x={px(0.16)} y={py(0.28)} textAnchor="middle" fontSize="12" className="fill-blue">
        LED 보충
      </text>
      <text x={px(0.84)} y={py(0.28)} textAnchor="middle" fontSize="12" className="fill-blue">
        LED 보충
      </text>

      {/* 축 캡션 */}
      <text x={X0} y={Y_BASE + 22} fontSize="11" className="fill-caption">
        일출
      </text>
      <text x={px(0.5)} y={Y_BASE + 22} textAnchor="middle" fontSize="11" className="fill-caption">
        정오
      </text>
      <text x={X1} y={Y_BASE + 22} textAnchor="end" fontSize="11" className="fill-caption">
        일몰
      </text>
      <text
        x="14"
        y={(Y_TOP + Y_BASE) / 2}
        fontSize="11"
        textAnchor="middle"
        className="fill-caption"
        transform={`rotate(-90 14 ${(Y_TOP + Y_BASE) / 2})`}
      >
        광량
      </text>
    </svg>
  );
}
